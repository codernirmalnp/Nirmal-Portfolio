'use client';

import { usePathname } from 'next/navigation';
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Cursor from "@/components/Cursor";
import ScrollToTop from "@/components/ScrollToTop";

interface DashboardLayoutWrapperProps {
  children: React.ReactNode;
}

export default function DashboardLayoutWrapper({ children }: DashboardLayoutWrapperProps) {
  const pathname = usePathname();
  
  // Check if current route is dashboard or auth
  const isDashboardRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/auth');

  return (
    <>
      {/* Header - Only show for non-dashboard routes */}
      {!isDashboardRoute && <Header />}

      {children}

      {/* Footer - Only show for non-dashboard routes */}
      {!isDashboardRoute && <Footer />}

      {/* Scroll to Top - Only show for non-dashboard routes */}
      {!isDashboardRoute && <ScrollToTop />}

      {/* Cursor - Only show for non-dashboard routes */}
      {!isDashboardRoute && <Cursor />}
    </>
  );
} 