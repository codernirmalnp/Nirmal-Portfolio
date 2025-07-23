import SEO from '@/app/components/SEO';
import { seoData } from '@/lib/seoData';

/**
 * Blog page component
 * Renders SEO meta tags and blog content
 */
const Blog = () => {
    return (
        <>
            <SEO
                title={seoData.blog.title}
                description={seoData.blog.description}
                keywords={seoData.blog.keywords}
                canonicalUrl={seoData.blog.canonicalUrl}
            />
            {/* Blog main content goes here */}
            <main>
                <h1>{seoData.blog.title}</h1>
                <p>{seoData.blog.description}</p>
                {/* Render blog posts here */}
            </main>
        </>
    );
};

export default Blog; 