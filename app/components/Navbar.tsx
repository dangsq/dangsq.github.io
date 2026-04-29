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
    <nav className="border-b border-[var(--border-color)] bg-[var(--bg-primary)]">
      <div className="container">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="group">
            <div className="flex flex-col">
              <span className="text-xl font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">
                Shengqi Dang
              </span>
              <span className="text-sm text-[var(--text-secondary)]">
                党圣奇
              </span>
            </div>
          </Link>

          {/* Navigation Links */}
          <div className="flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-sm font-medium transition-colors relative py-2 ${
                  pathname === item.href
                    ? 'text-[var(--accent-primary)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {item.name}
                {pathname === item.href && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent-primary)]"></span>
                )}
              </Link>
            ))}
          </div>

          {/* Contact */}
          <div className="hidden lg:flex items-center">
            <a 
              href="mailto:dangsq123@163.com" 
              className="text-sm text-[var(--text-secondary)] hover:text-[var(--accent-primary)] transition-colors"
            >
              Contact
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}

