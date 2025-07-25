import Blog from "@/components/Blog";
import Portfolio from "@/components/Portfolio";
import About from "@/components/About";
import Services from "@/components/Services";
import Testimonial from "@/components/Testimonial";
import Contact from "@/components/Contact";
import Hero from "@/components/Hero";

export default async function Home() {
  // Use absolute URLs for SSR
  const host = process.env.NEXT_PUBLIC_BASE_URL || 'localhost:3000';
  const isLocalhost = host.includes('localhost') || host.includes('127.0.0.1');
  const protocol = isLocalhost ? 'http' : 'https';
  const baseUrl = `${protocol}://${host.replace(/^https?:\/\//, '')}`;

  const blogsRes = await fetch(`${baseUrl}/api/blogs?limit=6`, { cache: 'no-store' });
  if (!blogsRes.ok) {
    throw new Error(`Failed to fetch blogs: ${blogsRes.status}`);
  }
  const blogsData = await blogsRes.json();

  const projectsRes = await fetch(`${baseUrl}/api/projects?limit=6`, { cache: 'no-store' });
  if (!projectsRes.ok) {
    throw new Error(`Failed to fetch projects: ${projectsRes.status}`);
  }
  const projectsData = await projectsRes.json();

  return (
    <>
      <div className="container mx-auto max-w-[1320px] px-5 md:px-10 xl:px-5">
        {/* Hero */}
        <Hero />
        {/* About */}
        <About />
        {/* Services */}
        <Services />
      </div>
      {/* Portfolio */}
      <Portfolio projects={projectsData.projects || []} />
      {/* Testimonial */}
      <Testimonial />
      {/* Blog */}
      <Blog blogs={blogsData.blogs || []} />
      {/* Contact */}
      <Contact />
    </>
  );
}
