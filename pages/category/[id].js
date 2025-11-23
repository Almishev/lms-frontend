import Header from "@/components/Header";
import styled from "styled-components";
import Center from "@/components/Center";
import {mongooseConnect} from "@/lib/mongoose";
import {Category} from "@/models/Category";
import {Product} from "@/models/Product";
import ProductsGrid from "@/components/ProductsGrid";
import Title from "@/components/Title";
import Link from "next/link";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";

const Breadcrumb = styled.div`
  margin-bottom: 20px;
  font-size: 0.9rem;
  color: #666;
  
  a {
    color: #666;
    text-decoration: none;
    
    &:hover {
      color: #000;
    }
  }
`;

const CategoryInfo = styled.div`
  background-color: #f8f9fa;
  padding: 20px;
  border-radius: 10px;
  margin-bottom: 30px;
`;

const CategoryName = styled.h1`
  margin: 0 0 10px 0;
  font-size: 2rem;
  color: #333;
`;

const CategoryDescription = styled.p`
  margin: 0;
  color: #666;
  font-size: 1.1rem;
`;

const ProductCount = styled.span`
  display: inline-block;
  background-color: #e9ecef;
  padding: 8px 16px;
  border-radius: 20px;
  font-size: 0.9rem;
  margin-top: 15px;
  color: #495057;
`;

const NoProducts = styled.div`
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.1rem;
`;

export default function CategoryPage({category, products, parentCategory}) {
  if (!category) {
    return (
      <>
        <Header />
        <Center>
          <Title>Жанрът не е намерен</Title>
          <p>Жанрът, който търсите, не съществува.</p>
          <Link href="/categories">← Назад към жанровете</Link>
        </Center>
        <Footer />
      </>
    );
  }

  return (
    <>
      <SEO 
        title={`${category.name} - Книги | Библиотека с. Мосомище`}
        description={`Книги в жанр "${category.name}" в библиотека с. Мосомище. ${products.length} ${products.length === 1 ? 'книга' : 'книги'} безплатно за четене.`}
        keywords={`${category.name}, жанр, книги, библиотека Мосомище, безплатни книги`}
        url={`/category/${category._id}`}
      />
      <Header />
      <Center>
        <Breadcrumb>
          <Link href="/">Начало</Link> / <Link href="/categories">Жанрове</Link> / {category.name}
        </Breadcrumb>
        
        <CategoryInfo>
          <CategoryName>{category.name}</CategoryName>
          {parentCategory && (
            <CategoryDescription>
              Поджанр на: <strong>{parentCategory.name}</strong>
            </CategoryDescription>
          )}
          <ProductCount>
            {products.length} {products.length === 1 ? 'книга' : 'книги'} в този жанр
          </ProductCount>
        </CategoryInfo>

        {products.length === 0 ? (
          <NoProducts>
            Няма намерени книги в този жанр.
          </NoProducts>
        ) : (
          <ProductsGrid products={products} />
        )}
      </Center>
      <Footer />
    </>
  );
}

export async function getServerSideProps(context) {
  try {
    await mongooseConnect();
    const {id} = context.query;
    
    // Взимаме категорията с родителя
    const category = await Category.findById(id).populate('parent');
    
    if (!category) {
      return {
        props: {
          category: null,
          products: [],
          parentCategory: null,
        }
      };
    }
    
    // Взимаме продуктите в тази категория
    const products = await Product.find({category: id});
    
    return {
      props: {
        category: JSON.parse(JSON.stringify(category)),
        products: JSON.parse(JSON.stringify(products)),
        parentCategory: category.parent ? JSON.parse(JSON.stringify(category.parent)) : null,
      }
    };
  } catch (error) {
    console.error('Error fetching category:', error);
    return {
      props: {
        category: null,
        products: [],
        parentCategory: null,
      }
    };
  }
}
