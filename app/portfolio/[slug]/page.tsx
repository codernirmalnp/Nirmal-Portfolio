// This file has been removed as part of the patch to delete the [slug] dynamic route.
import { portfolioData } from '@/lib/siteData';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { getPortfolioProjectSEO } from '@/lib/seoData';
import { Metadata } from 'next';
import GalleryWrapper from '@/components/GalleryWrapper';
import Link from 'next/link';

export async function generateMetadata({ params, }: { params: { slug: string } }): Promise<Metadata> {
    const slug = params.slug
    const project = portfolioData.projects.find(p => p.slug === slug);

    if (!project) {
        return {
            title: 'Project Not Found',
            description: 'The requested blog project could not be found'
        };
    }

    const seo = getPortfolioProjectSEO(slug, project.title, project.description);

    return {
        title: seo.title,
        description: seo.description,
        keywords: seo.keywords,
        openGraph: {
            title: seo.title,
            description: seo.description,
            type: 'article',
        },
        twitter: {
            card: 'summary_large_image',
            title: seo.title,
            description: seo.description,
        },
    };
}

export default async function PortfolioProject({ params, }: { params: { slug: string } }) {
    const slug = params.slug
    const project = portfolioData.projects.find(p => p.slug === slug);

    if (!project) {
        notFound();
    }

    // Find the index of the current project
    const currentProjectIndex = portfolioData.projects.findIndex(p => p.slug === slug);

    // Determine previous and next projects
    const prevProject = currentProjectIndex > 0 ? portfolioData.projects[currentProjectIndex - 1] : null;
    const nextProject = currentProjectIndex < portfolioData.projects.length - 1 ? portfolioData.projects[currentProjectIndex + 1] : null;

    const getLastWord = (str: string) => {
        const words = str.split(' ');
        return words[words.length - 1];
    };

    // Get the last word from project.title
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
                        {/* box 1 */}
                        <div className="z-[1] p-8 space-y-1.5 bg-darkBg rounded-lg relative overflow-hidden before:content-[''] before:absolute before:-z-[1] before:left-0 before:top-0 before:w-full before:h-full before:bg-themeGradient before:opacity-0 hover:before:opacity-10 before:transition-all before:ease-linear before:duration-100 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-themeGradient">
                            <span className="block font-outfit font-medium uppercase text-sm tracking-wider text-white">Services:</span>
                            <ul className="space-x-3 text-white/70">
                                {project.services.map((item, index) => (
                                    <li key={index} className="list-none inline-block">
                                        {item.name}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* box 2 */}
                        <div className="z-[1] p-8 space-y-1.5 bg-darkBg rounded-lg relative overflow-hidden before:content-[''] before:absolute before:-z-[1] before:left-0 before:top-0 before:w-full before:h-full before:bg-themeGradient before:opacity-0 hover:before:opacity-10 before:transition-all before:ease-linear before:duration-100 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-themeGradient">
                            <span className="block font-outfit font-medium uppercase text-sm tracking-wider text-white">Client:</span>
                            <p className="text-white/70">{project.client}</p>
                        </div>
                        {/* box 3 */}
                        <div className="z-[1] p-8 space-y-1.5 bg-darkBg rounded-lg relative overflow-hidden before:content-[''] before:absolute before:-z-[1] before:left-0 before:top-0 before:w-full before:h-full before:bg-themeGradient before:opacity-0 hover:before:opacity-10 before:transition-all before:ease-linear before:duration-100 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-themeGradient">
                            <span className="block font-outfit font-medium uppercase text-sm tracking-wider text-white">Project link:</span>
                            <Link className="inline-block overflow-hidden" href={project.projectLink.url}>
                                <span className="block relative text-transparent before:content-[attr(data-text)] before:absolute before:top-0 before:left-0 before:opacity-100 before:text-white before:transition-all before:ease-out before:duration-200 hover:before:-top-full hover:before:opacity-0 after:content-[attr(data-text)] after:absolute after:top-full after:left-0 after:opacity-0 after:text-white after:transition-all after:ease-out after:duration-200 hover:after:top-0 hover:after:opacity-100" data-text={project.projectLink.title}>{project.projectLink.title}</span>
                            </Link>
                        </div>
                        {/* box 4 */}
                        <div className="z-[1] p-8 space-y-1.5 bg-darkBg rounded-lg relative overflow-hidden before:content-[''] before:absolute before:-z-[1] before:left-0 before:top-0 before:w-full before:h-full before:bg-themeGradient before:opacity-0 hover:before:opacity-10 before:transition-all before:ease-linear before:duration-100 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-full after:h-[2px] after:bg-themeGradient">
                            <span className="block font-outfit font-medium uppercase text-sm tracking-wider text-white">Duration:</span>
                            <p className="text-white/70">{project.duration}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Project Details */}
            <div className="px-5 lg:px-10">
                <div className="bg-darkBg rounded-2xl overflow-hidden py-20">
                    <div className="container mx-auto max-w-[1320px] px-5">

                        <div className="md:mx-auto md:w-3/4 lg:w-2/3">
                            <div dangerouslySetInnerHTML={{ __html: project.content }} className="text-white/70" />
                        </div>

                        <div className="mt-6 lg:mt-12">
                            <Image className="rounded-lg" src={project.wideImage} alt={project.title} loading="lazy" placeholder="blur" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-12 mt-6 lg:mt-12">
                            {/* Lightbox Image */}
                            {project.imagesLightbox && (
                                <div className="overflow-hidden rounded-lg">
                                    <a href={project.imagesLightbox.image.src} className="glightbox group block relative before:content-[''] before:z-[1] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-themeGradient before:opacity-0 hover:before:opacity-10 before:transition-all before:ease-linear before:duration-100">
                                        <Image src={project.imagesLightbox.image} alt={project.imagesLightbox.alt} loading="lazy" placeholder="blur" width={1280} height={500} className="group-hover:scale-105 transition ease-custom duration-500" />
                                        <div className="inline-flex justify-center items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60px] h-[60px] rounded-full bg-black/20 backdrop-blur text-white" >
                                            <i className="bi bi-arrows-fullscreen"></i>
                                        </div>
                                    </a>
                                </div>
                            )}

                            {/* Lightbox Video */}
                            {project.video && (
                                <div className="overflow-hidden rounded-lg">
                                    <a href={project.video.url} data-gallery="video" className="glightbox group block relative before:content-[''] before:z-[1] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-themeGradient before:opacity-0 hover:before:opacity-10 before:transition-all before:ease-linear before:duration-100">
                                        <Image src={project.video.thumbnail} alt={project.title} loading="lazy" placeholder="blur" width={1280} height={500} className="group-hover:scale-105 transition ease-custom duration-500" />
                                        <div className="inline-flex justify-center items-center absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60px] h-[60px] rounded-full bg-black/20 backdrop-blur text-white text-lg" >
                                            <i className="bi bi-play-fill"></i>
                                        </div>
                                    </a>
                                </div>
                            )}
                        </div>

                        {/* Prev/Next Buttons */}
                        <div className="flex justify-between mt-12">
                            {/* Prev */}
                            {prevProject ? (
                                <Link
                                    href={`/portfolio/${prevProject.slug}`}
                                    className="inline-block relative z-[1] group overflow-hidden bg-white/15 px-7 py-3 rounded-3xl font-outfit font-medium uppercase text-sm tracking-wider text-white before:content-[''] before:absolute before:-z-[1] before:left-0 before:top-0 before:w-full before:h-full before:bg-themeGradient before:opacity-0 hover:before:opacity-20 before:transition-all before:ease-linear before:duration-100"
                                >
                                    <span className="block relative text-transparent before:content-[attr(data-text)] before:absolute before:top-0 before:left-0 before:opacity-100 before:text-white before:transition-all before:ease-out before:duration-200 group-hover:before:-top-full group-hover:before:opacity-0 after:content-[attr(data-text)] after:absolute after:top-full after:left-0 after:opacity-0 after:text-white after:transition-all after:ease-out after:duration-200 group-hover:after:top-0 group-hover:after:opacity-100" data-text="Prev Project">Prev Project</span>
                                </Link>
                            ) : (
                                <div className="opacity-50 pointer-events-none inline-block relative z-[1] group overflow-hidden bg-white/15 px-7 py-3 rounded-3xl font-outfit font-medium uppercase text-sm tracking-wider text-white before:content-[''] before:absolute before:-z-[1] before:left-0 before:top-0 before:w-full before:h-full before:bg-themeGradient before:opacity-0 hover:before:opacity-20 before:transition-all before:ease-linear before:duration-100">
                                    <span className="block relative text-transparent before:content-[attr(data-text)] before:absolute before:top-0 before:left-0 before:opacity-100 before:text-white before:transition-all before:ease-out before:duration-200 group-hover:before:-top-full group-hover:before:opacity-0 after:content-[attr(data-text)] after:absolute after:top-full after:left-0 after:opacity-0 after:text-white after:transition-all after:ease-out after:duration-200 group-hover:after:top-0 group-hover:after:opacity-100" data-text="No Previous Project">No Previous Project</span>
                                </div>
                            )}

                            {/* Next */}
                            {nextProject ? (
                                <Link
                                    href={`/portfolio/${nextProject.slug}`}
                                    className="inline-block relative z-[1] group overflow-hidden bg-white/15 px-7 py-3 rounded-3xl font-outfit font-medium uppercase text-sm tracking-wider text-white before:content-[''] before:absolute before:-z-[1] before:left-0 before:top-0 before:w-full before:h-full before:bg-themeGradient before:opacity-0 hover:before:opacity-20 before:transition-all before:ease-linear before:duration-100"
                                >
                                    <span className="block relative text-transparent before:content-[attr(data-text)] before:absolute before:top-0 before:left-0 before:opacity-100 before:text-white before:transition-all before:ease-out before:duration-200 group-hover:before:-top-full group-hover:before:opacity-0 after:content-[attr(data-text)] after:absolute after:top-full after:left-0 after:opacity-0 after:text-white after:transition-all after:ease-out after:duration-200 group-hover:after:top-0 group-hover:after:opacity-100" data-text="Next Project">Next Project</span>
                                </Link>
                            ) : (
                                <div className="opacity-50 pointer-events-none inline-block relative z-[1] group overflow-hidden bg-white/15 px-7 py-3 rounded-3xl font-outfit font-medium uppercase text-sm tracking-wider text-white before:content-[''] before:absolute before:-z-[1] before:left-0 before:top-0 before:w-full before:h-full before:bg-themeGradient before:opacity-0 hover:before:opacity-20 before:transition-all before:ease-linear before:duration-100">
                                    <span className="block relative text-transparent before:content-[attr(data-text)] before:absolute before:top-0 before:left-0 before:opacity-100 before:text-white before:transition-all before:ease-out before:duration-200 group-hover:before:-top-full group-hover:before:opacity-0 after:content-[attr(data-text)] after:absolute after:top-full after:left-0 after:opacity-0 after:text-white after:transition-all after:ease-out after:duration-200 group-hover:after:top-0 group-hover:after:opacity-100" data-text="No Next Project">No Next Project</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </GalleryWrapper>
    );
}
