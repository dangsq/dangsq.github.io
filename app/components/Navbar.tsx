'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const pathname = usePathname();

  const navItems = [
    { name: 'About', href: '/' },
    { name: 'Publications', href: '/publications' },
    { name: 'Projects', href: '/projects' },
  ];

  return (
    <nav className="nav-fixed">
      <div className="container">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <span className="text-2xl">🦋</span>
            <span className="font-semibold text-lg">Shengqi Dang</span>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  pathname === item.href
                    ? 'bg-[var(--accent-light)] text-[var(--accent-primary)]'
                    : 'text-[var(--text-secondary)] hover:bg-[var(--bg-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div className="hidden md:flex items-center space-x-4 text-sm text-[var(--text-secondary)]">
            <a href="mailto:dangsq123@163.com" className="hover:text-[var(--accent-primary)]">
              Email
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
