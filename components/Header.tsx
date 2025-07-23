"use client"

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { headerData } from '@/lib/siteData';

const Header = () => {
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
    const menuRef = useRef<HTMLDivElement | null>(null);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                closeMenu();
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="z-10 fixed top-0 left-0 w-full py-5">
            <div className="container mx-auto max-w-[1600px] px-5 md:px-10">
                <div className="flex justify-between relative">
                    {/* Header Logo */}
                    <div className="text-3xl font-outfit font-medium text-white">
                        <Link href="/">{headerData.logo}</Link>
                    </div>
                    {/* Header Nav */}
                    <div>
                        <ul className="flex space-x-2">
                            <li className="list-none inline-block">
                                <Link className="inline-block relative z-[1] overflow-hidden group px-5 py-2.5 pr-[34px] backdrop-blur bg-white/15 text-white font-outfit rounded-3xl uppercase text-sm font-medium tracking-wider before:content-[''] before:absolute before:-z-[1] before:left-0 before:top-0 before:w-full before:h-full before:bg-themeGradient before:opacity-0 hover:before:opacity-20 before:transition-all before:ease-linear before:duration-100 after:content-[''] after:absolute after:top-1/2 after:right-[20px] after:-translate-y-1/2 after:bg-white after:w-[5px] after:h-[5px] after:rounded-full after:transition-all after:duration-[60ms] hover:after:opacity-40 hover:after:scale-[2.7]" href="/#contact">
                                    <span className="block relative text-transparent before:content-[attr(data-text)] before:absolute before:top-0 before:left-0 before:opacity-100 before:text-white before:transition-all before:ease-out before:duration-200 group-hover:before:-top-full group-hover:before:opacity-0 after:content-[attr(data-text)] after:absolute after:top-full after:left-0 after:opacity-0 after:text-white after:transition-all after:ease-out after:duration-200 group-hover:after:top-0 group-hover:after:opacity-100" data-text="Let's Talk">Let&apos;s Talk</span>
                                </Link>
                            </li>
                            <li className="list-none inline-block">
                                {/* Nav Menu Toggle */}
                                <button type="button" onClick={toggleMenu} className="inline-block relative z-[1] overflow-hidden cursor-pointer group px-5 py-2.5 pr-[34px] bg-white text-black font-outfit rounded-3xl uppercase text-sm font-medium tracking-wider after:content-[''] after:absolute after:top-1/2 after:right-[20px] after:-translate-y-1/2 after:bg-black after:w-[5px] after:h-[5px] after:rounded-full after:transition-all after:duration-[60ms] hover:after:opacity-40 hover:after:scale-[2.7] cursor-link">
                                    <span className="block relative text-transparent before:content-[attr(data-text)] before:absolute before:top-0 before:left-0 before:opacity-100 before:text-black before:transition-all before:ease-out before:duration-200 group-hover:before:-top-full group-hover:before:opacity-0 after:content-[attr(data-text)] after:absolute after:top-full after:left-0 after:opacity-0 after:text-black after:transition-all after:ease-out after:duration-200 group-hover:after:top-0 group-hover:after:opacity-100" data-text="Menu">Menu</span>
                                </button>
                            </li>
                        </ul>
                    </div>
                    {/* Nav Menu Box */}
                    <nav ref={menuRef} className={`nav-box absolute overflow-hidden invisible opacity-0 translate-y-[5px] top-[60px] right-0 bg-white/10 px-7 py-6 min-w-[250px] rounded-lg font-outfit text-xl backdrop-blur transition-all ease-linear duration-100 before:content-[''] before:absolute before:-z-[1] before:left-0 before:top-0 before:w-full before:h-full before:bg-themeGradient before:opacity-30 ${isMenuOpen ? 'show' : ''}`}>
                        <ul className="space-y-[10px]">
                            {headerData.navlinks.map((item, idx) => (
                                <li key={idx} className="list-none">
                                    <Link
                                        href={item.url}
                                        className="text-white block relative hover:pl-[26px] transition-all ease-out duration-300 group"
                                    >
                                        <i className="bi bi-arrow-right absolute top-1/2 left-0 -translate-y-1/2 opacity-0 invisible transition-all ease-linear duration-100 group-hover:opacity-100 group-hover:visible"></i>
                                        {item.title}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Header;
