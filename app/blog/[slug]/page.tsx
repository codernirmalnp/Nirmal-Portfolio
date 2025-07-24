import { notFound } from 'next/navigation';
import Image from 'next/image';

import { headers } from 'next/headers';
import ClientGalleryWrapper from '@/components/ClientGalleryWrapper';
import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const host = (await headers()).get('host');
  const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
  const baseUrl = `${protocol}://${host}`;
  const res = await fetch(`${baseUrl}/api/blogs/${slug}`);
  let post = null;
  if (res.ok) {
    post = await res.json();
  }
  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The requested blog post could not be found'
    };
  }
  return {
    title: post.title,
    description: post.excerpt || post.description,
    keywords: post.tags?.map((t: any) => t.name).join(', '),
    openGraph: {
      title: post.title,
      description: post.excerpt || post.description,
      type: 'article',
      images: post.imageUrl ? [post.imageUrl] : [],
      authors: [post.postedBy || ''],
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt || post.description,
      images: post.imageUrl ? [post.imageUrl] : [],
    },
  };
}

export default async function BlogPost({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const host = (await headers()).get('host');
  const isLocalhost = host && (host.includes('localhost') || host.includes('127.0.0.1'));
  const protocol = isLocalhost ? 'http' : (process.env.NODE_ENV === 'production' ? 'https' : 'http');
  const baseUrl = `${protocol}://${host}`;
  const res = await fetch(`${baseUrl}/api/blogs/${slug}`);
  let post = null;
  if (res.ok) {
    post = await res.json();
  }

  if (!post) {
    notFound();
  }

  return (
    <>
      <div className="container mx-auto max-w-[1320px] px-5 md:px-10 xl:px-5">
        <div className="py-24 xl:py-28">
          <div className="md:mx-auto md:w-3/4 lg:w-2/3">
            <h2 className="font-outfit font-medium text-4xl md:text-5xl lg:text-6xl text-white mb-4">{post.title}</h2>
            <p className="text-white/70">{post.excerpt || post.description}</p>
          </div>
          {/*  Post Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
            {/* box 1 */}
            <div className="z-[1] p-8 space-y-1.5 bg-darkBg rounded-lg relative overflow-hidden before:content-[''] before:absolute before:-z-[1] before:left-0 before:top-0 before:w-full before:h-full before:bg-themeGradient before:opacity-0 hover:before:opacity-10 before:transition-all before:ease-linear before:duration-100 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-themeGradient">
              <span className="block font-outfit font-medium uppercase text-sm tracking-wider text-white">Category:</span>
              <ul className="space-x-3 text-white/70">
                <li className="list-none inline-block">{typeof post.category === 'object' ? post.category.name : post.category}</li>
              </ul>
            </div>
            {/* box 2 */}
            <div className="z-[1] p-8 space-y-1.5 bg-darkBg rounded-lg relative overflow-hidden before:content-[''] before:absolute before:-z-[1] before:left-0 before:top-0 before:w-full before:h-full before:bg-themeGradient before:opacity-0 hover:before:opacity-10 before:transition-all before:ease-linear before:duration-100 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-themeGradient">
              <span className="block font-outfit font-medium uppercase text-sm tracking-wider text-white">Posted by:</span>
              <p className="text-white/70">Nirmal</p>
            </div>
            {/* Created by Nirmal */}
          
            {/* box 3 */}
            <div className="z-[1] p-8 space-y-1.5 bg-darkBg rounded-lg relative overflow-hidden before:content-[''] before:absolute before:-z-[1] before:left-0 before:top-0 before:w-full before:h-full before:bg-themeGradient before:opacity-0 hover:before:opacity-10 before:transition-all before:ease-linear before:duration-100 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-themeGradient">
              <span className="block font-outfit font-medium uppercase text-sm tracking-wider text-white">Tags:</span>
              <a className="inline-block overflow-hidden" href="#">
                <ul className="space-x-3 text-white/70">
                  {Array.isArray(post.tags) && post.tags.map((item: any, index: number) => (
                    <li key={index} className="list-none inline-block">
                      #{item.name}
                    </li>
                  ))}
                </ul>
              </a>
            </div>
            {/* box 4 */}
            <div className="z-[1] p-8 space-y-1.5 bg-darkBg rounded-lg relative overflow-hidden before:content-[''] before:absolute before:-z-[1] before:left-0 before:top-0 before:w-full before:h-full before:bg-themeGradient before:opacity-0 hover:before:opacity-10 before:transition-all before:ease-linear before:duration-100 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-themeGradient">
              <span className="block font-outfit font-medium uppercase text-sm tracking-wider text-white">Posted on:</span>
              <p className="text-white/70">{
                post.updatedAt
                  ? new Date(post.updatedAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                  : (post.createdAt
                      ? new Date(post.createdAt).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : '')
              }</p>
             
            </div>
          </div>
        </div>
      </div>
      {/* Post Details */}
      <div className="px-5 lg:px-10">
        <div className="bg-darkBg rounded-2xl overflow-hidden py-20">
          <div className="container mx-auto max-w-[1320px] px-5">
            <div className="md:mx-auto md:w-3/4 lg:w-2/3">
              {post.imageUrl && (
                <ClientGalleryWrapper>
                  <div className="mb-8">
                    <Image className="rounded-lg w-full h-auto object-cover glightbox" src={post.imageUrl} alt={post.title} loading="lazy" width={1280} height={500} />
                  </div>
                </ClientGalleryWrapper>
              )}
              <div>
                <p dangerouslySetInnerHTML={{ __html: post.content }} className="text-white/70" />
              </div>
            </div>
            {/* You can add more details or media here as needed */}
          </div>
        </div>
      </div>
    </>
  );
}
