# NEXA AI Landing Page

## Overview

NEXA AI is a modern, futuristic landing page for an AI assistant service. The project features a responsive design with advanced animations, glassmorphism effects, and interactive elements. Built with vanilla HTML, CSS, and JavaScript, it showcases a premium AI brand with smooth scrolling, parallax effects, and mobile-responsive navigation.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
The application follows a modular frontend structure with separation of concerns:

- **Static HTML Structure**: Single-page application with semantic HTML5 markup
- **CSS Architecture**: Organized into three main stylesheets for maintainability:
  - `main.css`: Core variables, base styles, and layout systems
  - `components.css`: Reusable UI components and navigation
  - `animations.css`: Keyframe animations and motion effects
- **JavaScript Modules**: Separated into functional modules:
  - `main.js`: Core functionality, DOM manipulation, and event handling
  - `animations.js`: Advanced animation controller with intersection observers

### Design System
- **CSS Custom Properties**: Centralized design tokens for colors, spacing, typography, and transitions
- **Responsive Design**: Mobile-first approach with flexible grid systems
- **Glassmorphism**: Modern UI trend with backdrop filters and transparent elements
- **Animation Strategy**: Performance-conscious animations with reduced motion preferences

### Component Structure
- **Navigation**: Fixed header with mobile hamburger menu
- **Hero Section**: Primary landing area with gradient text effects
- **Interactive Elements**: Hover states, tilt effects, and scroll-triggered animations
- **Accessibility**: Semantic markup and motion preference detection

### Performance Optimizations
- **Intersection Observer API**: Efficient scroll-based animations
- **CSS Variables**: Dynamic theming and consistent design tokens
- **Modular JavaScript**: Lazy loading and conditional animation execution
- **Reduced Motion Support**: Respects user accessibility preferences

## External Dependencies

### CDN Resources
- **Google Fonts**: Inter font family for typography
- **Feather Icons**: Icon library for UI elements (CDN version 4.29.0)

### Browser APIs
- **Intersection Observer API**: For scroll-triggered animations and lazy loading
- **Media Queries API**: For reduced motion preference detection
- **Backdrop Filter**: For glassmorphism effects (with webkit fallback)

### Third-party Integrations
- **Font Loading**: Google Fonts with display=swap optimization
- **Icon System**: Feather Icons for consistent iconography

The project is designed as a self-contained landing page with minimal external dependencies, focusing on modern web standards and progressive enhancement.