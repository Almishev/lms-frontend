import Header from "@/components/Header";
import Center from "@/components/Center";
import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import Footer from "@/components/Footer";
import Pagination from "@/components/Pagination";
import SEO from "@/components/SEO";

const PAGE_SIZE = 20;

import {useRouter} from "next/router";
import {useState} from "react";

export default function ProductsPage({products, page, totalPages, totalCount, search: initialSearch}) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState(initialSearch || '');

  function handleSearch(e) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm.trim()) {
      params.set('search', searchTerm.trim());
    }
    params.set('page', '1'); // Reset to page 1 on new search
    router.push('/products?' + params.toString());
  }

  // Build base path for pagination (preserves search query)
  const basePath = searchTerm.trim() 
    ? `/products?search=${encodeURIComponent(searchTerm.trim())}`
    : '/products';

  const seoTitle = initialSearch 
    ? `Търсене: "${initialSearch}" | Библиотека с. Мосомище`
    : 'Всички книги | Библиотека с. Мосомище';
  
  const seoDescription = initialSearch
    ? `Търсене на книги по "${initialSearch}" в библиотека с. Мосомище. Намерени ${totalCount} ${totalCount === 1 ? 'книга' : 'книги'}.`
    : `Всички книги в библиотека с. Мосомище. Общо ${totalCount} ${totalCount === 1 ? 'книга' : 'книги'}. Безплатни книги за четене в община Гоце Делчев.`;

  return (
    <>
      <SEO 
        title={seoTitle}
        description={seoDescription}
        keywords={initialSearch ? `търсене книги, ${initialSearch}, библиотека Мосомище` : 'всички книги, библиотека Мосомище, каталог книги, безплатни книги'}
        url={initialSearch ? `/products?search=${encodeURIComponent(initialSearch)}` : '/products'}
      />
      <Header />
      <Center>
        <Title>Всички книги</Title>
        <p style={{color:'#6b7280', marginTop: '-8px'}}>
          {searchTerm ? `Намерени ${totalCount} ${totalCount === 1 ? 'книга' : 'книги'}` : `Общо книги: ${totalCount}`}
        </p>
        
        <form onSubmit={handleSearch} style={{marginBottom: '20px', display: 'flex', gap: '10px'}}>
          <input
            type="text"
            placeholder="Търси по заглавие, автор, ISBN..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{flex: 1, padding: '10px', border: '1px solid #ddd', borderRadius: '5px'}}
          />
          <button type="submit" style={{padding: '10px 20px', background: '#4338ca', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}>
            Търси
          </button>
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm('');
                router.push('/products');
              }}
              style={{padding: '10px 20px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer'}}
            >
              Изчисти
            </button>
          )}
        </form>

        {products.length === 0 ? (
          <div>Няма намерени книги.</div>
        ) : (
          <>
            <ProductsGrid products={products} />
            <Pagination 
              page={page} 
              totalPages={totalPages} 
              basePath={basePath}
            />
          </>
        )}
      </Center>
      <Footer />
    </>
  );
}

export async function getServerSideProps({query}) {
  try {
    await mongooseConnect();
    const pageParam = parseInt(query.page, 10);
    const page = Math.max(1, isNaN(pageParam) ? 1 : pageParam);
    const search = query.search?.trim() || '';

    // Създаваме query за търсене
    let mongoQuery = {};
    if (search) {
      const regex = new RegExp(search, 'i');
      mongoQuery = {
        $or: [
          { title: regex },
          { author: regex },
          { isbn: regex },
          { description: regex },
        ]
      };
    }

    // Броим общия брой резултати
    const totalCount = await Product.countDocuments(mongoQuery);
    const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
    const currentPage = Math.min(page, totalPages);
    const skip = (currentPage - 1) * PAGE_SIZE;

    // Намираме продуктите с пагинация
    const products = await Product.find(mongoQuery, null, {
      sort: {'_id': -1},
      skip,
      limit: PAGE_SIZE,
    }).lean();

    return {
      props:{
        products: JSON.parse(JSON.stringify(products)),
        page: currentPage,
        totalPages,
        totalCount,
        search,
      }
    };
  } catch (error) {
    console.error('Error fetching products:', error.message);
    return {
      props:{
        products: [],
        page: 1,
        totalPages: 1,
        totalCount: 0,
        search: '',
      }
    };
  }
}