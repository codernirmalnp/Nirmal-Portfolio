import Head from 'next/head';

interface SEOProps {
  title: string;
  description: string;
  keywords: string[];
  canonicalUrl: string;
}

/**
 * SEO component for rendering meta tags and structured data
 */
const SEO = ({ title, description, keywords, canonicalUrl }: SEOProps) => (
  <Head>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="keywords" content={keywords.join(', ')} />
    <link rel="canonical" href={canonicalUrl} />
    {/* Open Graph */}
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:type" content="website" />
    <meta property="og:url" content={canonicalUrl} />
    {/* Twitter Card */}
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    {/* JSON-LD Structured Data */}
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'Blog',
          name: title,
          description,
          url: canonicalUrl,
        }),
      }}
    />
  </Head>
);

export default SEO; 