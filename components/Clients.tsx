"use client"

import React from 'react'
import { Swiper, SwiperSlide } from 'swiper/react';
import Image from 'next/image';
import Link from 'next/link';
import { clientsData } from '@/lib/siteData';

const Clients = () => {
    return (
        <div className="clients-slider pb-24 xl:pb-28 swiper-initialized swiper-horizontal swiper-backface-hidden">
            <Swiper
                slidesPerView={2}
                spaceBetween={24}
                breakpoints={{
                    // when window width is >= 640px
                    640: {
                        slidesPerView: 3,
                        spaceBetween: 24,
                    },
                    // when window width is >= 768px
                    768: {
                        slidesPerView: 4,
                        spaceBetween: 30,
                    },
                    // when window width is >= 1024px
                    1024: {
                        slidesPerView: 5,
                        spaceBetween: 50,
                    },
                }}
                autoplay={{
                    delay: 2500,
                    disableOnInteraction: false,
                }}
                className="swiper"
            >
                {clientsData.clients.map((client, index) => (
                    <SwiperSlide key={index}>
                        <div className="opacity-65 hover:opacity-100 transition ease-out duration-100">
                            <Link href={client.url}>
                                <Image src={client.logo} alt="Client Logo" placeholder="blur" />
                            </Link>
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    )
}

export default Clients