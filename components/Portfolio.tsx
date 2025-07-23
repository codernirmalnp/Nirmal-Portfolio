"use client"

import React, { useRef, useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import Link from 'next/link';
// import { portfolioData } from '@/lib/siteData';
import { useState } from 'react';
import { FaSpinner } from 'react-icons/fa';
import { Swiper as SwiperType } from 'swiper';
import { NavigationOptions } from 'swiper/types';

interface PortfolioProps {
  projects: any[];
}

const Portfolio: React.FC<PortfolioProps> = ({ projects }) => {
    const prevRef = useRef<HTMLButtonElement | null>(null);
    const nextRef = useRef<HTMLButtonElement | null>(null);
    const sliderRef = useRef<SwiperType | null>(null);

    const updateNavigation = (swiper: SwiperType) => {
        if (swiper.params.navigation && typeof swiper.params.navigation !== 'boolean') {
            const navigation = swiper.params.navigation as NavigationOptions;

            if (prevRef.current && nextRef.current) {
                navigation.prevEl = prevRef.current;
                navigation.nextEl = nextRef.current;
                swiper.navigation.update();
            }
        }
    };

    useEffect(() => {
        if (sliderRef.current) {
            updateNavigation(sliderRef.current);
        }
    }, []);

    return (
        <div id="portfolio" className="px-5 lg:px-10">
            <div className="bg-darkBg rounded-2xl overflow-hidden py-20">
                <div className="container mx-auto max-w-[1320px] px-5">
                    <div className="md:w-4/5 lg:w-3/4 md:mx-auto">
                        <h6 className="pl-[20px] relative font-outfit font-medium text-sm uppercase tracking-wider text-white/40 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[12px] before:h-[12px] before:rounded-full before:border-2 before:border-white/30">Portfolio</h6>
                        <h2 className="font-outfit font-medium text-4xl md:text-5xl lg:text-6xl text-white mt-2">Latest <span className="bg-themeGradient bg-clip-text text-transparent">Works</span></h2>
                        <p className="leading-[1.75] text-white/70 mt-3">Explore our latest projects and case studies.</p>
                        {/* Slider Nav */}
                        <div className="space-x-1 mt-6">
                            <button className="swiper-portfolio-prev inline-block group w-[50px] h-[50px] rounded-full cursor-pointer bg-white/15 text-white relative z-[1] overflow-hidden before:content-[''] before:absolute before:-z-[1] before:left-0 before:top-0 before:w-full before:h-full before:bg-themeGradient before:opacity-0 hover:before:opacity-20 before:transition-all before:ease-linear before:duration-100 cursor-link" onClick={() => sliderRef.current?.slidePrev()} aria-label="Prev Slide">
                                <i className="bi bi-arrow-left absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all ease-out duration-200 group-hover:top-0 group-hover:invisible group-hover:opacity-0"></i>
                                <i className="bi bi-arrow-left absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all ease-out duration-200 invisible opacity-0 group-hover:top-1/2 group-hover:visible group-hover:opacity-100"></i>
                            </button>
                            <button className="swiper-portfolio-next inline-block group w-[50px] h-[50px] rounded-full cursor-pointer bg-white/15 text-white relative z-[1] overflow-hidden before:content-[''] before:absolute before:-z-[1] before:left-0 before:top-0 before:w-full before:h-full before:bg-themeGradient before:opacity-0 hover:before:opacity-20 before:transition-all before:ease-linear before:duration-100 cursor-link" onClick={() => sliderRef.current?.slideNext()} aria-label="Next Slide">
                                <i className="bi bi-arrow-right absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all ease-out duration-200 group-hover:top-0 group-hover:invisible group-hover:opacity-0"></i>
                                <i className="bi bi-arrow-right absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all ease-out duration-200 invisible opacity-0 group-hover:top-1/2 group-hover:visible group-hover:opacity-100"></i>
                            </button>
                        </div>
                        {/* end Slider Nav */}
                    </div>
                    <Swiper
                            onSwiper={(swiper) => {
                                sliderRef.current = swiper;
                                swiper.on('init', () => {
                                    updateNavigation(swiper);
                                });
                            }}
                            slidesPerView={1}
                            spaceBetween={30}
                            breakpoints={{
                                640: {
                                    slidesPerView: 1,
                                    spaceBetween: 30,
                                },
                                768: {
                                    slidesPerView: 2,
                                    spaceBetween: 30,
                                },
                                1024: {
                                    slidesPerView: 2,
                                    spaceBetween: 50,
                                },
                            }}
                            autoplay={{
                                delay: 2500,
                                disableOnInteraction: false,
                            }}
                            className="swiper portfolio-slider overflow-visible mt-6 xl:mt-14 swiper-initialized swiper-horizontal swiper-backface-hidden"
                        >
                            {projects.map((project, idx) => (
                                <SwiperSlide key={idx}>
                                    <div className="group/portfolio-box">
                                        {/* Image */}
                                        <div className="overflow-hidden relative rounded-2xl">
                                            <Link
                                                href={`portfolio/${project.slug}`}
                                                className="group block relative before:content-[''] before:z-[1] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-themeGradient before:opacity-0 hover:before:opacity-10 before:transition-all before:ease-linear before:duration-100"
                                            >
                                                <Image
                                                    src={project.imageUrl}
                                                    alt={project.title}
                                                    width={600}
                                                    height={400}
                                                    className="group-hover:scale-105 transition ease-custom duration-500"
                                                />
                                            </Link>
                                        </div>
                                        <div className="pt-6">
                                            {/* Categories */}
                                            <ul className="text-white font-outfit font-medium uppercase text-sm tracking-wider">
                                                {project.tags?.map((category: any, index: number) => (
                                                    <li
                                                        key={index}
                                                        className={index === 0 ? "list-none inline-block leading-none pr-[4px]" : "list-none inline-block leading-none relative pl-[14px] pr-[4px] before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[5px] before:h-[5px] before:rounded-md before:bg-white/80"}
                                                    >
                                                        <Link className="inline-block overflow-hidden" href={`portfolio/${project.slug}`}>
                                                            <span className="block relative text-transparent before:content-[attr(data-text)] before:absolute before:top-0 before:left-0 before:opacity-100 before:text-white before:transition-all before:ease-out before:duration-200 hover:before:-top-full hover:before:opacity-0 after:content-[attr(data-text)] after:absolute after:top-full after:left-0 after:opacity-0 after:text-white after:transition-all after:ease-out after:duration-200 hover:after:top-0 hover:after:opacity-100" data-text={category.name}>{category.name}</span>
                                                        </Link>
                                                    </li>
                                                ))}
                                            </ul>
                                            {/* Caption */}
                                            <div className="mt-2">
                                                <h2 className="relative font-outfit font-medium text-3xl">
                                                    <Link className="text-white group-hover/portfolio-box:pl-[44px] transition-all ease-out duration-200" href={`portfolio/${project.slug}`}>
                                                        <span className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 opacity-0 group-hover/portfolio-box:opacity-100 group-hover/portfolio-box:-translate-x-0 transition duration-100">
                                                            <i className="bi bi-arrow-right"></i>
                                                        </span>
                                                        {project.title}
                                                    </Link>
                                                </h2>
                                            </div>
                                        </div>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                </div>
            </div>
        </div>
    );
}

export default Portfolio;
