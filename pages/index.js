import Header from "@/components/Header";
import Featured from "@/components/Featured";
import {Product} from "@/models/Product";
import {mongooseConnect} from "@/lib/mongoose";
import NewProducts from "@/components/NewProducts";
import Footer from "@/components/Footer";
import HeroVideo from "@/components/HeroVideo";
import SEO from "@/components/SEO";

export default function HomePage({featuredProduct,newProducts}) {
  return (
    <>
      <SEO 
        title="Библиотека с. Мосомище - Безплатни книги за четене | Гоце Делчев"
        description="Библиотека с. Мосомище, община Гоце Делчев. Безплатни книги за четене - българска и световна литература. Посетете библиотеката и изберете книга за четене!"
        keywords="библиотека Мосомище, безплатни книги, Гоце Делчев, българска литература, световна литература, книги за четене, библиотека България"
        url="/"
      />
      <div>
        <Header />
        <HeroVideo />
        {featuredProduct && <Featured product={featuredProduct} />}
        <NewProducts products={newProducts} />
        <Footer />
      </div>
    </>
  );
}

export async function getServerSideProps() {
  try {
    await mongooseConnect();
    
    // Взимаме featured product ID от settings
    const {Settings} = await import('@/models/Settings');
    const featuredProductSetting = await Settings.findOne({name: 'featuredProductId'});
    const featuredProductId = featuredProductSetting?.value;
    
    let featuredProduct = null;
    if (featuredProductId) {
      featuredProduct = await Product.findById(featuredProductId);
    }
    
    const newProducts = await Product.find({}, null, {sort: {'_id':-1}, limit:12});
    return {
      props: {
        featuredProduct: featuredProduct ? JSON.parse(JSON.stringify(featuredProduct)) : null,
        newProducts: JSON.parse(JSON.stringify(newProducts)),
      },
    };
  } catch (error) {
    console.error('Error in getServerSideProps:', error);
    return {
      props: {
        featuredProduct: null,
        newProducts: [],
      },
    };
  }
}