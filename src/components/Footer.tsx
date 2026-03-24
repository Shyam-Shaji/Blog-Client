'use client'

import { Github, Twitter, Linkedin, Mail } from 'lucide-react'

export function Footer() {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    'Product': [
      { name: 'Features', href: '#' },
      { name: 'Pricing', href: '#' },
      { name: 'Security', href: '#' },
      { name: 'Status', href: '#' },
    ],
    'Company': [
      { name: 'About', href: '#' },
      { name: 'Blog', href: '#' },
      { name: 'Careers', href: '#' },
      { name: 'Contact', href: '#' },
    ],
    'Resources': [
      { name: 'Documentation', href: '#' },
      { name: 'API Reference', href: '#' },
      { name: 'Community', href: '#' },
      { name: 'Support', href: '#' },
    ],
    'Legal': [
      { name: 'Privacy', href: '#' },
      { name: 'Terms', href: '#' },
      { name: 'License', href: '#' },
      { name: 'Sitemap', href: '#' },
    ],
  }

  return (
    <footer className="bg-card border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Footer Content */}
        <div className="grid md:grid-cols-5 gap-12 mb-12">
          {/* Brand */}
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/50 rounded-lg" />
              <span className="font-bold text-foreground">WriteFlow</span>
            </div>
            <p className="text-sm text-foreground/60 leading-relaxed">
              A modern blogging platform for sharing ideas, insights, and stories.
            </p>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-foreground mb-4 text-sm">{category}</h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-sm text-foreground/60 hover:text-foreground transition-colors"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-border mb-8" />

        {/* Bottom */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-8">
          <p className="text-sm text-foreground/60">
            © {currentYear} WriteFlow. All rights reserved.
          </p>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="#"
              className="p-2 hover:bg-background rounded-lg transition-colors text-foreground/60 hover:text-foreground"
              aria-label="Twitter"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="p-2 hover:bg-background rounded-lg transition-colors text-foreground/60 hover:text-foreground"
              aria-label="GitHub"
            >
              <Github className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="p-2 hover:bg-background rounded-lg transition-colors text-foreground/60 hover:text-foreground"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="#"
              className="p-2 hover:bg-background rounded-lg transition-colors text-foreground/60 hover:text-foreground"
              aria-label="Email"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}