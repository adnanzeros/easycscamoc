import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';

export const metadata: Metadata = {
  title: 'easycsca',
  description: 'CSCA Exam Preparation Platform',
};

function Navbar() {
  return (
    <header className="navbar">
      <nav className="navbar-container">
        {/* Mobile Menu Toggle */}
        <input
          type="checkbox"
          id="mobile-menu-toggle"
          className="mobile-menu-toggle"
        />

        <label
          htmlFor="mobile-menu-toggle"
          className="mobile-menu-button"
          aria-label="Toggle navigation menu"
        >
          <span></span>
          <span></span>
          <span></span>
        </label>

        {/* Logo */}
        <Link href="/" className="navbar-logo">
          easycsca
        </Link>

        {/* Desktop Navigation */}
        <div className="desktop-navigation">
          <Link href="/">Home</Link>

          <Link href="/about">About EasyCSCA</Link>

          {/* Schedule */}
          <Link href="/schedule">Schedule</Link>

          {/* Mock Test */}
          <Link href="/mock-test" className="desktop-mock-test-button">
            CSCA Mock Test
          </Link>
        </div>

        {/* Mobile Mock Test Button */}
        <Link href="/mock-test" className="mobile-mock-test-button">
          CSCA Mock Test
        </Link>
      </nav>

      {/* Mobile Navigation */}
      <div className="mobile-navigation">
        <Link href="/">Home</Link>

        <Link href="/about">About EasyCSCA</Link>

        {/* Schedule */}
        <Link href="/schedule">Schedule</Link>
      </div>
    </header>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Footer Logo */}
        <div className="footer-brand">
          <Link href="/" className="footer-logo">
            easycsca
          </Link>

          <p>CSCA Exam Preparation Platform</p>
        </div>

        {/* Footer Links */}
        <div className="footer-links">
          <Link href="/about">About</Link>

          <Link href="/contact">Contact Us</Link>
        </div>

        {/* Copyright */}
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} easycsca. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <main>{children}</main>

        {/* Footer */}
        <Footer />
      </body>
    </html>
  );
}
