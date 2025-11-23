import Head from 'next/head';

export default function SEO({
  title = 'Библиотека с. Мосомище - Безплатни книги за четене',
  description = 'Библиотека с. Мосомище, община Гоце Делчев. Безплатни книги за четене, голяма колекция от българска и световна литература. Посетете библиотеката и изберете книга за четене!',
  keywords = 'библиотека, Мосомище, Гоце Делчев, книги, безплатни книги, четене, българска литература, световна литература, библиотека Мосомище',
  image = '/натруфенка.png',
  url,
  type = 'website',
  author,
  bookTitle,
  bookAuthor,
  bookIsbn,
  bookPublishedYear,
  structuredData,
  breadcrumbs,
}) {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://lms-frontend-virid-kappa.vercel.app';
  const fullUrl = url ? `${siteUrl}${url}` : siteUrl;
  const fullImage = image.startsWith('http') ? image : `${siteUrl}${image}`;

  // Structured Data за библиотека (Library + LocalBusiness)
  const defaultStructuredData = [
    {
      '@context': 'https://schema.org',
      '@type': 'Library',
      name: 'Библиотека с. Мосомище',
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Мосомище',
        addressRegion: 'Благоевград',
        addressCountry: 'BG',
        streetAddress: 'с. Мосомище',
        postalCode: '2900',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '41.5700',
        longitude: '23.2800',
      },
      url: siteUrl,
      description: 'Библиотека в село Мосомище, община Гоце Делчев, предлагаща безплатни книги за четене',
      telephone: '+359 888 123 456',
      email: 'info@library-mosomishche.bg',
      openingHours: 'Mo-Fr 09:00-17:00',
      priceRange: 'Безплатно',
    },
    {
      '@context': 'https://schema.org',
      '@type': 'LocalBusiness',
      '@id': siteUrl,
      name: 'Библиотека с. Мосомище',
      image: `${siteUrl}/натруфенка.png`,
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'с. Мосомище',
        addressLocality: 'Мосомище',
        addressRegion: 'Благоевград',
        postalCode: '2900',
        addressCountry: 'BG',
      },
      geo: {
        '@type': 'GeoCoordinates',
        latitude: '41.5700',
        longitude: '23.2800',
      },
      url: siteUrl,
      telephone: '+359 888 123 456',
      priceRange: 'Безплатно',
      description: 'Безплатна библиотека в село Мосомище, община Гоце Делчев. Българска и световна литература за всички възрасти.',
    },
  ];

  // Structured Data за книга (ако е предоставена)
  const bookStructuredData = bookTitle ? {
    '@context': 'https://schema.org',
    '@type': 'Book',
    name: bookTitle,
    author: bookAuthor ? {
      '@type': 'Person',
      name: bookAuthor,
    } : undefined,
    isbn: bookIsbn,
    datePublished: bookPublishedYear ? `${bookPublishedYear}` : undefined,
    publisher: {
      '@type': 'Organization',
      name: 'Библиотека с. Мосомище',
    },
    inLanguage: 'bg',
    availableAt: {
      '@type': 'Library',
      name: 'Библиотека с. Мосомище',
    },
  } : null;

  return (
    <Head>
      {/* Основни meta tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={author || 'Библиотека с. Мосомище'} />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="language" content="bg" />
      <meta name="geo.region" content="BG-01" />
      <meta name="geo.placename" content="Мосомище, Гоце Делчев" />
      <meta name="geo.position" content="41.5700;23.2800" />
      <meta name="ICBM" content="41.5700, 23.2800" />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={type} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={fullImage} />
      <meta property="og:locale" content="bg_BG" />
      <meta property="og:site_name" content="Библиотека с. Мосомище" />

      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:url" content={fullUrl} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={fullImage} />

      {/* Canonical URL */}
      <link rel="canonical" href={fullUrl} />

      {/* Structured Data */}
      {(structuredData || defaultStructuredData).map((data, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(data),
          }}
        />
      ))}
      {bookStructuredData && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(bookStructuredData),
          }}
        />
      )}
      {breadcrumbs && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: breadcrumbs.map((crumb, index) => ({
                '@type': 'ListItem',
                position: index + 1,
                name: crumb.name,
                item: `${siteUrl}${crumb.url}`,
              })),
            }),
          }}
        />
      )}
    </Head>
  );
}

