import {mongooseConnect} from "@/lib/mongoose";
import {Product} from "@/models/Product";
import {Category} from "@/models/Category";

function generateSiteMap(products, categories) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lms-frontend-virid-kappa.vercel.app';
  
  return `<?xml version="1.0" encoding="UTF-8"?>
   <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
     <url>
       <loc>${siteUrl}</loc>
       <changefreq>daily</changefreq>
       <priority>1.0</priority>
     </url>
     <url>
       <loc>${siteUrl}/products</loc>
       <changefreq>daily</changefreq>
       <priority>0.9</priority>
     </url>
     <url>
       <loc>${siteUrl}/categories</loc>
       <changefreq>weekly</changefreq>
       <priority>0.8</priority>
     </url>
     <url>
       <loc>${siteUrl}/authors</loc>
       <changefreq>weekly</changefreq>
       <priority>0.8</priority>
     </url>
     ${categories.map((category) => `
       <url>
           <loc>${siteUrl}/category/${category._id}</loc>
           <changefreq>weekly</changefreq>
           <priority>0.7</priority>
       </url>
     `).join('')}
     ${products.map((product) => `
       <url>
           <loc>${siteUrl}/product/${product._id}</loc>
           <changefreq>monthly</changefreq>
           <priority>0.6</priority>
       </url>
     `).join('')}
   </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps ще направи заявката
}

export async function getServerSideProps({ res }) {
  try {
    await mongooseConnect();
    
    // Взимаме всички продукти и категории
    const [products, categories] = await Promise.all([
      Product.find({}).select('_id').lean(),
      Category.find({}).select('_id').lean(),
    ]);

    // Генерираме XML sitemap
    const sitemap = generateSiteMap(products, categories);

    res.setHeader('Content-Type', 'text/xml');
    res.write(sitemap);
    res.end();

    return {
      props: {},
    };
  } catch (error) {
    console.error('Error generating sitemap:', error);
    res.statusCode = 500;
    res.end();
    return {
      props: {},
    };
  }
}

export default SiteMap;

