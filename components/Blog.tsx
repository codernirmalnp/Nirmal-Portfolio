"use client"

import React, { useEffect, useRef, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Swiper as SwiperType } from 'swiper';
import { NavigationOptions } from 'swiper/types';
import { Pagination } from 'swiper/modules';
import 'swiper/css/pagination';
import { FaSpinner } from 'react-icons/fa';

const PAGE_SIZE = 6;


import type { BlogPost } from '@/types/custom';

interface BlogProps {
  blogs?: BlogPost[];
}

const Blog: React.FC<BlogProps> = ({ blogs: initialBlogs = [] }) => {
    const prevRef = useRef(null);
    const nextRef = useRef(null);
    const sliderRef = useRef<SwiperType | null>(null);
    const [blogs, setBlogs] = useState<BlogPost[]>(initialBlogs);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);

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

    const fetchMoreBlogs = async () => {
        if (loading) return;
        setLoading(true);
        const host = typeof window !== 'undefined'
          ? window.location.origin
          : process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';
        try {
            const res = await fetch(`${host}/api/blogs?page=${page + 1}&limit=${PAGE_SIZE}`);
            const data = await res.json();
            if (data.blogs && data.blogs.length > 0) {
                setBlogs(prev => [...prev, ...data.blogs]);
                setPage(prev => prev + 1);
                if (data.blogs.length < PAGE_SIZE) setHasMore(false);
            } else {
                setHasMore(false);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div id="blog" className="px-5 lg:px-10">
            <div className="bg-darkBg rounded-2xl overflow-hidden py-20">
                <div className="container mx-auto max-w-[1320px] px-5">
                    <div className="md:w-4/5 lg:w-3/4 md:mx-auto">
                        <h6 className="pl-[20px] relative font-outfit font-medium text-sm uppercase tracking-wider text-white/40 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[12px] before:h-[12px] before:rounded-full before:border-2 before:border-white/30">Blogs</h6>
                        <h2 className="font-outfit font-medium text-4xl md:text-5xl lg:text-6xl text-white mt-2">Latest <span className="bg-themeGradient bg-clip-text text-transparent">Blogs</span></h2>
                        <p className="leading-[1.75] text-white/70 mt-3">Read the latest articles and insights from our team.</p>
                        {/* Slider Nav */}
                        <div className="space-x-1 mt-6">
                            <button className="swiper-blog-prev inline-block group w-[50px] h-[50px] rounded-full cursor-pointer bg-white/15 text-white relative z-[1] overflow-hidden before:content-[''] before:absolute before:-z-[1] before:left-0 before:top-0 before:w-full before:h-full before:bg-themeGradient before:opacity-0 hover:before:opacity-20 before:transition-all before:ease-linear before:duration-100 cursor-link" onClick={() => sliderRef.current?.slidePrev()} aria-label="Prev Slide">
                                <i className="bi bi-arrow-left absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all ease-out duration-200 group-hover:top-0 group-hover:invisible group-hover:opacity-0"></i>
                                <i className="bi bi-arrow-left absolute top-full left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all ease-out duration-200 invisible opacity-0 group-hover:top-1/2 group-hover:visible group-hover:opacity-100"></i>

                            </button>
                            <button className="swiper-blog-next inline-block group w-[50px] h-[50px] rounded-full cursor-pointer bg-white/15 text-white relative z-[1] overflow-hidden before:content-[''] before:absolute before:-z-[1] before:left-0 before:top-0 before:w-full before:h-full before:bg-themeGradient before:opacity-0 hover:before:opacity-20 before:transition-all before:ease-linear before:duration-100 cursor-link" onClick={() => sliderRef.current?.slideNext()} aria-label="Next Slide">
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
                        onReachEnd={() => {
                            if (hasMore) fetchMoreBlogs();
                        }}
                        slidesPerView={1}
                        spaceBetween={30}
                        breakpoints={{
                            640: { slidesPerView: 1, spaceBetween: 30 },
                            768: { slidesPerView: 2, spaceBetween: 30 },
                            1024: { slidesPerView: 2, spaceBetween: 50 },
                        }}
                        autoplay={{ delay: 2500, disableOnInteraction: false }}
                        modules={[Pagination]}
                        pagination={{ clickable: true }}
                        className="blog-slider overflow-visible mt-6 xl:mt-14"
                    >
                        {blogs.map((item, index) => (
                            <SwiperSlide key={index}>
                                <div className="group/blog-box">
                                    <div className="overflow-hidden relative rounded-2xl">
                                        {/* Image */}
                                        <Link className="group block relative before:content-[''] before:z-[1] before:absolute before:top-0 before:left-0 before:w-full before:h-full before:bg-themeGradient before:opacity-0 hover:before:opacity-10 before:transition-all before:ease-linear before:duration-100" href={`blog/${item.slug}`}>
                                            <Image
                                                src={item.imageUrl || ''}
                                                alt={item.title}
                                                width={600}
                                                height={400}
                                                className="group-hover:scale-105 transition ease-custom duration-500"
                                            />
                                            <div className="absolute top-4 right-4 z-[1] bg-black/20 rounded-3xl px-5 py-2.5 font-outfit font-medium uppercase text-sm tracking-wider text-white">
                                                {typeof item.category === 'object' ? item.category.name : item.category}
                                            </div>
                                        </Link>
                                    </div>
                                    <div className="pt-6">
                                        <ul className="text-white font-outfit font-medium uppercase text-sm tracking-wider">
                                            <li className="list-none inline-block leading-none pr-[4px]">
                                                <span className="block relative text-transparent before:content-[attr(data-text)] before:absolute before:top-0 before:left-0 before:opacity-100 before:text-white before:transition-all before:ease-out before:duration-200 hover:before:-top-full hover:before:opacity-0 after:content-[attr(data-text)] after:absolute after:top-full after:left-0 after:opacity-0 after:text-white after:transition-all after:ease-out after:duration-200 hover:after:top-0 hover:after:opacity-100" data-text="by Nirmal">by Nirmal</span>
                                            </li>
                                            <li className="list-none inline-block leading-none relative pl-[14px] pr-[4px] before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-[5px] before:h-[5px] before:rounded-md before:bg-white/80">
                                                <Link className="inline-block overflow-hidden" href={`blog/${item.slug}`}>
                                                    <span className="block relative text-transparent before:content-[attr(data-text)] before:absolute before:top-0 before:left-0 before:opacity-100 before:text-white before:transition-all before:ease-out before:duration-200 hover:before:-top-full hover:before:opacity-0 after:content-[attr(data-text)] after:absolute after:top-full after:left-0 after:opacity-0 after:text-white after:transition-all after:ease-out after:duration-200 hover:after:top-0 hover:after:opacity-100" data-text={item.date || ''}>{item.date || ''}</span>
                                                </Link>
                                            </li>
                                        </ul>
                                        {/* <div className="text-xs text-white/50 font-opensans mt-1">Created by Nirmal</div> */}
                                        <div className="mt-2">
                                            <h2 className="relative font-outfit font-medium text-3xl">
                                                <Link className="text-white group-hover/blog-box:pl-[44px] transition-all ease-out duration-200" href={`blog/${item.slug}`}>
                                                    <span className="absolute top-1/2 left-0 -translate-y-1/2 -translate-x-1/2 opacity-0 group-hover/blog-box:opacity-100 group-hover/blog-box:-translate-x-0 transition duration-100">
                                                        <i className="bi bi-arrow-right"></i>
                                                    </span>
                                                    {item.title}
                                                </Link>
                                            </h2>
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        ))}
                        {loading && (
                            <div className="flex justify-center items-center py-4">
                                <FaSpinner className="animate-spin text-xl text-primary" />
                                <span className="ml-2">Loading more blogs...</span>
                            </div>
                        )}
                    </Swiper>
                </div>
            </div>
        </div>
    )
}

export default Blog