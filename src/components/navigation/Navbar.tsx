'use client';

/**
 * Navbar Component
 * 
 * A responsive navigation bar component that handles both global navigation and context-specific content.
 * 
 * Features:
 * - Dropdown menus for primary navigation sections
 * - Dynamic center content that can display page-specific information
 * - Type-safe handling of Enneagram type information
 * - Responsive design with mobile considerations
 * 
 * Usage:
 * ```tsx
 * // For type pages:
 * <Navbar centerContent={<TypeTitle number="1" name="The Reformer" />} />
 * 
 * // For regular pages:
 * <Navbar centerContent={<PageTitle>About the Enneagram</PageTitle>} />
 * ```
 * 
 * Props:
 * - centerContent?: React.ReactNode - Optional content to display in the center of the navbar
 */

import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronDown, Settings } from 'lucide-react';
import Link from 'next/link';
import { theme, styleUtils } from '@/styles/theme';

// Type definitions for the Enneagram types
type EnneagramNumber = '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

const TYPE_NAMES: Record<EnneagramNumber, string> = {
  '1': 'Type 1: The Reformer',
  '2': 'Type 2: The Helper',
  '3': 'Type 3: The Achiever',
  '4': 'Type 4: The Individualist',
  '5': 'Type 5: The Investigator',
  '6': 'Type 6: The Loyalist',
  '7': 'Type 7: The Enthusiast',
  '8': 'Type 8: The Challenger',
  '9': 'Type 9: The Peacemaker'
};

// Navigation menu structure
interface NavMenuItem {
  label: string;
  href?: string;
  items?: NavMenuItem[];
}

// Main navigation structure
const navigationMenu: NavMenuItem[] = [
  {
    label: "My Dashboard",
    items: [
      { label: "My Profile", href: "/assessment/profile" },
      { label: "Assessment Results", href: "/assessment/results" }
    ]
  },
  {
    label: "Learn More",
    items: [
      { label: "About the Enneagram", href: "/enneagram/guide/about" },
      { label: "Interpreting Your Results", href: "/enneagram/guide/interpreting-results" },
      {
        label: "Type Descriptions",
        items: Object.entries(TYPE_NAMES).map(([num, name]) => ({
          label: `Type ${num}`,
          href: `/enneagram/types/type${num}`
        }))
      },
      { label: "Compare Types", href: "/enneagram/compare" }
    ]
  }
];

// Props interface for the DropdownMenu component
interface DropdownMenuProps {
  item: NavMenuItem;
  isOpen: boolean;
  onToggle: () => void;
  onClose: () => void;
}

/**
 * DropdownMenu Component
 * Handles individual dropdown menus in the navigation bar
 */
const DropdownMenu: React.FC<DropdownMenuProps> = ({ 
  item, 
  isOpen, 
  onToggle, 
  onClose 
}) => {
  const [subMenuOpen, setSubMenuOpen] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const subMenuRef = useRef<HTMLDivElement>(null);

  // Handle clicks outside the dropdown to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
        setSubMenuOpen(null);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <div className="relative" ref={dropdownRef}>
      <Button
        variant="ghost"
        className="flex items-center gap-1 text-primary hover:text-primary/80 hover:bg-primary/5"
        onClick={(e) => {
          e.stopPropagation();
          onToggle();
        }}
      >
        {item.label}
        <ChevronDown 
          className={`h-4 w-4 transition-transform duration-300 ease-in-out ${
            isOpen ? 'rotate-180' : ''
          }`} 
        />
      </Button>
      
      <div 
        className={`absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
        style={{ transformOrigin: 'top' }}
      >
        <div className="py-2">
          {item.items?.map((subItem, index) => (
            <div key={index}>
              {subItem.items ? (
                // Nested menu items
                <div>
                  <button
                    className="w-full px-4 py-2 text-left hover:bg-gray-50 flex items-center justify-between"
                    onClick={() => setSubMenuOpen(subMenuOpen === subItem.label ? null : subItem.label)}
                  >
                    {subItem.label}
                    <ChevronDown 
                      className={`h-4 w-4 transition-transform duration-300 ease-in-out ${
                        subMenuOpen === subItem.label ? 'rotate-180' : ''
                      }`} 
                    />
                  </button>
                  <div 
                    ref={subMenuRef}
                    className="overflow-hidden transition-all duration-300 ease-in-out"
                    style={{
                      maxHeight: subMenuOpen === subItem.label ? `${subItem.items.length * 40}px` : '0',
                      opacity: subMenuOpen === subItem.label ? 1 : 0
                    }}
                  >
                    <div className="bg-gray-50 py-1">
                      {subItem.items.map((nestedItem, idx) => (
                        <Link
                          key={idx}
                          href={nestedItem.href || '#'}
                          className="block px-8 py-2 hover:bg-gray-100 transition-colors duration-200"
                          onClick={() => onClose()}
                        >
                          <span className="text-sm">
                            {TYPE_NAMES[(idx + 1).toString() as EnneagramNumber]}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                // Regular menu items
                <Link
                  href={subItem.href || '#'}
                  className="block px-4 py-2 hover:bg-gray-50 transition-colors duration-200"
                  onClick={() => onClose()}
                >
                  {subItem.label}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Props interface for the Navbar component
interface NavbarProps {
  centerContent?: React.ReactNode;
}

/**
 * Main Navbar component
 */
const Navbar: React.FC<NavbarProps> = ({ centerContent }) => {
  const [openMenu, setOpenMenu] = useState<string | null>(null);

  return (
    <nav className="fixed top-0 left-0 right-0 bg-white border-b z-50" style={{ borderColor: `${theme.colors.text}10` }}>
      <div className="w-full px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left section */}
          <div className="flex-1 flex justify-start">
            <DropdownMenu
              item={navigationMenu[0]}
              isOpen={openMenu === navigationMenu[0].label}
              onToggle={() => setOpenMenu(openMenu === navigationMenu[0].label ? null : navigationMenu[0].label)}
              onClose={() => setOpenMenu(null)}
            />
          </div>

          {/* Center section */}
          <div className="flex-1 flex justify-center">
            {centerContent}
          </div>

          {/* Right section */}
          <div className="flex-1 flex justify-end">
            <div className="flex items-center gap-6">
              <DropdownMenu
                item={navigationMenu[1]}
                isOpen={openMenu === navigationMenu[1].label}
                onToggle={() => setOpenMenu(openMenu === navigationMenu[1].label ? null : navigationMenu[1].label)}
                onClose={() => setOpenMenu(null)}
              />
              
              <Button
                variant="ghost"
                className="text-primary hover:text-primary/80 hover:bg-primary/5"
                asChild
              >
                <Link href="/settings" className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  <span>Settings & Help</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;