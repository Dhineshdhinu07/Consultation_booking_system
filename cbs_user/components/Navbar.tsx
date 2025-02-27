'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/components/auth-provider';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/theme-toggle';
import { FiMenu, FiX } from 'react-icons/fi';
import { usePathname } from 'next/navigation';

interface NavItem {
  label: string;
  href?: string;
  id?: string;
  isScroll: boolean;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const isHomePage = pathname === '/';

  const scrollToSection = (sectionId: string) => {
    setIsOpen(false);
    if (!isHomePage) {
      window.location.href = `/#${sectionId}`;
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const navItems: NavItem[] = [
    { label: 'Home', href: '/', isScroll: false },
    { label: 'Services', id: 'features', isScroll: true },
    { label: 'Contact', id: 'contact', isScroll: true },
    ...(user ? [
      { label: 'Dashboard', href: '/dashboard', isScroll: false },
      { label: 'Profile', href: '/profile', isScroll: false }
    ] : [])
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold bg-gradient-to-r from-[#007BFF] to-[#008080] bg-clip-text text-transparent">
              SmartConsult
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navItems.map((item) => (
              item.isScroll ? (
                <button
                  key={item.id}
                  onClick={() => item.id && scrollToSection(item.id)}
                  className="text-gray-600 dark:text-gray-300 hover:text-[#007BFF] dark:hover:text-[#007BFF] px-3 py-2 rounded-md text-sm font-medium transition-colors cursor-pointer"
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.href}
                  href={item.href || '/'}
                  className="text-gray-600 dark:text-gray-300 hover:text-[#007BFF] dark:hover:text-[#007BFF] px-3 py-2 rounded-md text-sm font-medium transition-colors"
                >
                  {item.label}
                </Link>
              )
            ))}
            {user && (
              <Link href="/booking">
                <Button className="bg-gradient-to-r from-[#007BFF] to-[#0056b3] dark:from-[#60A5FA] dark:to-[#3B82F6] text-white hover:opacity-90">
                  Book Consultation
                </Button>
              </Link>
            )}
            <ThemeToggle />
            {user ? (
              <Button
                onClick={() => logout()}
                variant="ghost"
                className="text-gray-600 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400"
              >
                Logout
              </Button>
            ) : (
              <div className="flex items-center space-x-2">
                <Link href="/login">
                  <Button variant="ghost">Sign in</Button>
                </Link>
                <Link href="/register">
                  <Button className="bg-gradient-to-r from-[#007BFF] to-[#008080] text-white hover:opacity-90">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              className="p-2"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <FiX className="h-6 w-6" />
              ) : (
                <FiMenu className="h-6 w-6" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map((item) => (
              item.isScroll ? (
                <button
                  key={item.id}
                  onClick={() => item.id && scrollToSection(item.id)}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-[#007BFF] dark:hover:text-[#007BFF] hover:bg-gray-50 dark:hover:bg-gray-900"
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  key={item.href}
                  href={item.href || '/'}
                  className="block px-3 py-2 rounded-md text-base font-medium text-gray-600 dark:text-gray-300 hover:text-[#007BFF] dark:hover:text-[#007BFF] hover:bg-gray-50 dark:hover:bg-gray-900"
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              )
            ))}
            {user && (
              <Link
                href="/booking"
                onClick={() => setIsOpen(false)}
                className="block w-full"
              >
                <Button className="w-full bg-gradient-to-r from-[#007BFF] to-[#0056b3] dark:from-[#60A5FA] dark:to-[#3B82F6] text-white hover:opacity-90">
                  Book Consultation
                </Button>
              </Link>
            )}
            {user ? (
              <Button
                onClick={() => {
                  logout();
                  setIsOpen(false);
                }}
                variant="ghost"
                className="w-full text-left px-3 py-2 text-base font-medium text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-900"
              >
                Logout
              </Button>
            ) : (
              <div className="space-y-2 p-3">
                <Link href="/login" onClick={() => setIsOpen(false)}>
                  <Button variant="ghost" className="w-full">
                    Sign in
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setIsOpen(false)}>
                  <Button className="w-full bg-gradient-to-r from-[#007BFF] to-[#008080] text-white hover:opacity-90">
                    Sign up
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
} 