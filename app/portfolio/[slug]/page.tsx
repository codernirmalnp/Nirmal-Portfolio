import { notFound } from 'next/navigation';
import Image from 'next/image';
import GalleryWrapper from '@/components/GalleryWrapper';
import Link from 'next/link';

export default async function PortfolioProject({ params }: { params: { slug: string } }) {
    const { slug } = params;
    // Always use an absolute URL for server fetch
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000';
    let project: any = null;
    try {
        const res = await fetch(`${baseUrl}/api/projects/${slug}`, { cache: 'no-store' });
        if (!res.ok) {
            console.error('API returned error:', res.status, res.statusText);
            notFound();
        }
        const data = await res.json();
        project = data.project;
        if (!project) {
            console.error('API response missing project:', data);
            notFound();
        }
    } catch (err) {
        console.error('Error fetching project:', err);
        notFound();
    }

    // Defensive: check required fields
    if (!project.title || !project.imageUrl) {
        console.error('Project missing required fields:', project);
        notFound();
    }

    // Example: get previous/next projects if you want (not implemented here)
    // You may want to fetch all projects and find prev/next by index if needed

    // Helper to get last word of title
    const getLastWord = (str: string) => {
        const words = str.split(' ');
        return words[words.length - 1];
    };
    const lastWord = getLastWord(project.title);

    return (
        <GalleryWrapper>
            <div className="container mx-auto max-w-[1320px] px-5 md:px-10 xl:px-5">
                <div className="py-24 xl:py-28">
                    <div className="md:mx-auto md:w-3/4 lg:w-2/3">
                        <h2 className="font-outfit font-medium text-4xl md:text-5xl lg:text-6xl text-white mb-4">{project.title.replace(lastWord, '')} <span className="bg-themeGradient bg-clip-text text-transparent">{lastWord}</span></h2>
                        <p className="text-white/70">{project.description}</p>
                    </div>
                    {/*  Project Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-14">
                        {/* box 1: Tags */}
                        <div className="z-[1] p-8 space-y-1.5 bg-darkBg rounded-lg relative overflow-hidden before:content-[''] before:absolute before:-z-[1] before:left-0 before:top-0 before:w-full before:h-full before:bg-themeGradient before:opacity-0 hover:before:opacity-10 before:transition-all before:ease-linear before:duration-100 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-themeGradient">
                            <span className="block font-outfit font-medium uppercase text-sm tracking-wider text-white">Tags:</span>
                            <ul className="space-x-3 text-white/70">
                                {project.tags?.map((item: any, index: number) => (
                                    <li key={index} className="list-none inline-block">
                                        {item.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* box 2: Categories */}
                        <div className="z-[1] p-8 space-y-1.5 bg-darkBg rounded-lg relative overflow-hidden before:content-[''] before:absolute before:-z-[1] before:left-0 before:top-0 before:w-full before:h-full before:bg-themeGradient before:opacity-0 hover:before:opacity-10 before:transition-all before:ease-linear before:duration-100 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-themeGradient">
                            <span className="block font-outfit font-medium uppercase text-sm tracking-wider text-white">Categories:</span>
                            <ul className="space-x-3 text-white/70">
                                {project.categories?.map((item: any, index: number) => (
                                    <li key={index} className="list-none inline-block">
                                        {item.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* box 3: Project link */}
                        <div className="z-[1] p-8 space-y-1.5 bg-darkBg rounded-lg relative overflow-hidden before:content-[''] before:absolute before:-z-[1] before:left-0 before:top-0 before:w-full before:h-full before:bg-themeGradient before:opacity-0 hover:before:opacity-10 before:transition-all before:ease-linear before:duration-100 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-themeGradient">
                            <span className="block font-outfit font-medium uppercase text-sm tracking-wider text-white">Project link:</span>
                            {project.projectUrl && (
                                <Link className="inline-block overflow-hidden" href={project.projectUrl} target="_blank" rel="noopener noreferrer">
                                    <span className="block relative text-transparent before:content-[attr(data-text)] before:absolute before:top-0 before:left-0 before:opacity-100 before:text-white before:transition-all before:ease-out before:duration-200 hover:before:-top-full hover:before:opacity-0 after:content-[attr(data-text)] after:absolute after:top-full after:left-0 after:opacity-0 after:text-white after:transition-all after:ease-out after:duration-200 hover:after:top-0 hover:after:opacity-100" data-text={project.projectUrl}>{project.projectUrl}</span>
                                </Link>
                            )}
                        </div>
                        {/* box 4: Github link */}
                        <div className="z-[1] p-8 space-y-1.5 bg-darkBg rounded-lg relative overflow-hidden before:content-[''] before:absolute before:-z-[1] before:left-0 before:top-0 before:w-full before:h-full before:bg-themeGradient before:opacity-0 hover:before:opacity-10 before:transition-all before:ease-linear before:duration-100 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-themeGradient">
                            <span className="block font-outfit font-medium uppercase text-sm tracking-wider text-white">Github:</span>
                            {project.githubUrl && (
                                <Link className="inline-block overflow-hidden" href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                                    <span className="block relative text-transparent before:content-[attr(data-text)] before:absolute before:top-0 before:left-0 before:opacity-100 before:text-white before:transition-all before:ease-out before:duration-200 hover:before:-top-full hover:before:opacity-0 after:content-[attr(data-text)] after:absolute after:top-full after:left-0 after:opacity-0 after:text-white after:transition-all after:ease-out after:duration-200 hover:after:top-0 hover:after:opacity-100" data-text={project.githubUrl}>{project.githubUrl}</span>
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            {/* Project Image */}
            <div className="px-5 lg:px-10">
                <div className="bg-darkBg rounded-2xl overflow-hidden py-20">
                    <div className="container mx-auto max-w-[1320px] px-5">
                        <div className="md:mx-auto md:w-3/4 lg:w-2/3">
                            <Image className="rounded-lg" src={project.imageUrl} alt={project.title} width={630} height={393} loading="lazy" />
                        </div>
                    </div>
                </div>
            </div>
        </GalleryWrapper>
    );
}
