// src/components/assessment/analysis/types.ts
import { ReactNode } from 'react';

export interface Theme {
  colors: {
    primary: string;
    background: string;
    text: string;
    accent1: string;
    accent2: string;
    accent3: string;
    accent4: string;
  };
  fonts: {
    heading: string;
    body: string;
  };
  fontWeights: {
    regular: number;
    medium: number;
    semibold: number;
    bold: number;
  };
  letterSpacing: {
    heading: string;
    body: string;
  };
}

export interface StyleUtils {
  headingStyles: {
    fontFamily: string;
    letterSpacing: string;
    fontWeight: number;
  };
  bodyStyles: {
    fontFamily: string;
    letterSpacing: string;
    fontWeight: number;
  };
}

export interface AnalysisSection {
  title: string;
  icon: ReactNode;
  content: string;
}

export interface SectionProps {
  theme: Theme;
  styleUtils: StyleUtils;
  content: string;
}

export interface RelatedSectionProps {
  theme: Theme;
  styleUtils: StyleUtils;
  wingContent: string;
  lineContent: string;
}