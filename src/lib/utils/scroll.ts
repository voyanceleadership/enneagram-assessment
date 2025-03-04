// src/lib/utils/scroll.ts
'use client';

/**
 * ScrollUtils
 * 
 * A simplified utility module for handling basic scrolling behavior
 * with minimal DOM manipulation and no global registry.
 */

// Standard offset values used across the application
export const SCROLL_OFFSETS = {
  // Default navbar height
  NAVBAR: 64,
  
  // Standard section padding
  SECTION_PADDING: 16,
  
  // Tabs height (approx)
  TABS: 56,
  
  // Additional spacing for visual comfort
  EXTRA_PADDING: 24,
};

/**
 * ScrollToOptions interface for scrolling configuration
 */
export interface ScrollToOptions {
  // ID of the element to scroll to
  id: string;
  
  // Additional offset to apply (combined with base offset)
  additionalOffset?: number;
  
  // Whether to include tabs height in the offset calculation
  includeTabs?: boolean;
  
  // Behavior of the scroll operation
  behavior?: ScrollBehavior;
  
  // Delay before scrolling (useful for waiting for DOM updates)
  delay?: number;
}

/**
 * Scroll to an element by ID with consistent offset handling
 */
export function scrollToElement({
  id,
  additionalOffset = 0,
  includeTabs = false,
  behavior = 'smooth',
  delay = 10,
}: ScrollToOptions): void {
  // Wrap in setTimeout to ensure DOM is ready, especially after state updates
  setTimeout(() => {
    // Find the target element
    const element = document.getElementById(id);
    if (!element) {
      console.warn(`Element with ID ${id} not found for scrolling`);
      return;
    }
    
    // Calculate the base offset
    let offset = SCROLL_OFFSETS.NAVBAR + SCROLL_OFFSETS.SECTION_PADDING;
    
    // Add tabs height if needed
    if (includeTabs) {
      offset += SCROLL_OFFSETS.TABS;
    }
    
    // Add any additional custom offset
    offset += additionalOffset;
    
    // Calculate the position
    const elementPosition = element.getBoundingClientRect().top;
    const offsetPosition = elementPosition + window.pageYOffset - offset;
    
    // Execute the scroll
    window.scrollTo({
      top: offsetPosition,
      behavior,
    });
  }, delay);
}

/**
 * A simple implementation of scroll tracking that just uses IntersectionObserver
 * to track which elements are visible
 */
export function setupScrollTracking(
  callback: (activeSection: string | null) => void
): () => void {
  if (typeof window === 'undefined' || !window.IntersectionObserver) {
    return () => {};
  }
  
  const anchors = document.querySelectorAll('[id^="anchor-"]');
  let observer: IntersectionObserver;
  
  // Use IntersectionObserver to track which elements are in view
  const options = {
    rootMargin: '-10% 0px -80% 0px', // Bias toward elements near the top
    threshold: 0
  };
  
  observer = new IntersectionObserver((entries) => {
    // Only consider entries that are intersecting
    const intersecting = entries.filter(entry => entry.isIntersecting);
    
    if (intersecting.length > 0) {
      // Sort by how close they are to the top
      intersecting.sort((a, b) => {
        const aTop = a.boundingClientRect.top;
        const bTop = b.boundingClientRect.top;
        return Math.abs(aTop) - Math.abs(bTop);
      });
      
      // Get the ID of the closest element
      const activeId = intersecting[0].target.id;
      callback(activeId);
    }
  }, options);
  
  // Observe all anchor elements
  anchors.forEach(anchor => {
    observer.observe(anchor);
  });
  
  // Return a cleanup function
  return () => {
    if (observer) {
      observer.disconnect();
    }
  };
}