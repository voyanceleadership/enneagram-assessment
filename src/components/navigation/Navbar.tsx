// src/components/navigation/Navbar.tsx
import { FC } from 'react'
import Link from 'next/link'
import { theme, styleUtils } from '@/styles/theme'

const Navbar: FC = () => {
  return (
    <nav 
      className="fixed top-0 left-0 right-0 bg-white shadow-sm z-50"
      style={{ borderBottom: `1px solid ${theme.colors.accent3}15` }}
    >
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          {/* Logo/Brand */}
          <Link 
            href="/" 
            className="transition-opacity hover:opacity-90"
            style={{ 
              ...styleUtils.headingStyles,
              color: theme.colors.primary,
              fontSize: '1.25rem'
            }}
          >
            Enneacademy
          </Link>

          {/* Navigation Links */}
          <div 
            className="flex space-x-8"
            style={styleUtils.bodyStyles}
          >
            <Link 
              href="/assessment" 
              className="transition-colors hover:opacity-80"
              style={{ color: theme.colors.text }}
            >
              Enneagram Assessment
            </Link>
            <Link 
              href="/courses" 
              className="transition-colors hover:opacity-80"
              style={{ color: theme.colors.text }}
            >
              eCourses
            </Link>
            <Link 
              href="/store" 
              className="transition-colors hover:opacity-80"
              style={{ color: theme.colors.text }}
            >
              Store
            </Link>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar