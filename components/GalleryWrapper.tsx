"use client";

import { useEffect, ReactNode } from 'react';
import GLightbox from 'glightbox';

interface GalleryWrapperProps {
    children: ReactNode;
}

function GalleryWrapper({ children }: GalleryWrapperProps) {
    useEffect(() => {
        const lightbox = GLightbox({
            selector: '.glightbox',
            touchNavigation: true,
            loop: true,
            autoplayVideos: true,
        });

        return () => {
            lightbox.destroy();
        };
    }, []);

    return <>{children}</>;
}

export default GalleryWrapper;
