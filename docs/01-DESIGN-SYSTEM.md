# Task Scheduler - Design System & Analysis

This document provides a comprehensive breakdown of the design system used throughout the application.

## Table of Contents

1. [Current Architecture](#1-current-architecture)
2. [Design System & Color Palette](#2-design-system--color-palette)
3. [Existing Pages Layout Patterns](#3-existing-pages-layout-patterns)
4. [Navbar Design & Branding](#4-navbar-design--branding)
5. [Authentication Flow](#5-authentication-flow)
6. [Visual Patterns & Components](#6-visual-patterns--components)
7. [Visual Theme & Tone](#7-visual-theme--tone)
8. [Key Design Patterns](#8-key-design-patterns-to-replicate)

---

## 1. Current Architecture

### App Structure

```
Root Application
├── ThemeProvider (next-themes, dark mode support)
├── Navbar (glassmorphic, sticky header)
├── Main Content Area
│   ├── max-w-6xl container
│   ├── Linear gradient background
│   └── Route outlet
└── Service Worker (FCM notifications)
```

### Routes & Protection

- **/** Home - Now shows Landing Page for unauthenticated users, task form for authenticated
- **/login** - Public (no middleware)
- **/register** - Public (no middleware)
- **/tasks** - Protected (authMiddleware)
- **/task/:taskId** - Protected (authMiddleware)
- **/dashboard** - Protected (authMiddleware)
- **/calendar** - Protected (authMiddleware)
- **/insights** - Protected (authMiddleware)

---

## 2. Design System & Color Palette

### Color Scheme (OKLch Color Space)

#### Light Mode

```
Primary:     oklch(0.3084 0.1285 300.5672)  → Deep Purple/Magenta
Secondary:   oklch(0.6898 0.1843 39.8518)   → Warm Orange/Gold
Accent:      oklch(0.9691 0.0161 293.7558)  → Light Purple (backgrounds)
Destructive: oklch(0.6368 0.2078 25.3313)   → Red/Orange
Background:  oklch(0.9903 0.0058 59.6542)   → Off-white
Foreground:  oklch(0.2161 0.0061 56.0434)   → Dark Charcoal
Muted:       oklch(0.9699 0.0013 106.4238)  → Light Gray
Border:      oklch(0.9232 0.0026 48.7171)   → Subtle Gray
```

#### Dark Mode

```
Primary:     oklch(0.6056 0.2189 292.7172)  → Bright Purple/Magenta
Secondary:   oklch(0.7073 0.1817 40.3193)   → Bright Orange
Background:  oklch(0.1985 0.0446 303.5739)  → Deep Purple/Navy
Foreground:  oklch(0.9789 0.0013 106.4235)  → Off-white
Card:        oklch(0.2417 0.0574 302.311)   → Slightly lighter than background
```

#### Chart Colors (supporting palette)

- Chart-1: Deep Purple (primary)
- Chart-2: Orange (secondary)
- Chart-3: Bright Lime Green
- Chart-4: Bright Red
- Chart-5: Vibrant Purple

### Typography

- **Font Family**: Geist (primary), Geist Mono (monospace)
- **System Fallback**: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto
- **Font Smoothing**: Antialiased on all platforms

---

## 3. Existing Pages Layout Patterns

### Layout Foundation

- **Container**: `max-w-6xl mx-auto` (consistent max width)
- **Padding**: `px-4 py-4` (responsive)
- **Background**: Linear gradient from background to muted/20
- **Root**: `ThemeProvider` → `Navbar` → `main` → Routes

### Navigation Bar Pattern

- **Style**: Glassmorphism (backdrop blur + semi-transparent background)
- **Height**: h-14 (56px)
- **Brand**: Left-aligned "Task Scheduler" (text-lg font-semibold tracking-tight)
- **Nav Items** (desktop only when user exists):
  - Dashboard
  - Tasks
  - Insights
  - Calendar
- **Active State**: Font weight increases to medium (font-medium)
- **Inactive State**: Muted foreground color
- **Mobile**: Hamburger menu, nav items hidden
- **Always Present**: Theme toggle button (sun/moon icon)
- **Hidden on**: /login, /register pages (shows `AuthNavbar` instead)

### Dashboard Pattern (`src/components/dashboard/dashboard.tsx`)

- **Section Structure**:
  - Top stats row with StatCards (grid layout)
  - Next 2-3 widgets: Active Task + Next Task
  - Timeline of tasks for today
  - Quick add button with modal

- **StatCard Component**:
  - Icon + value + label
  - Accent color background (small rounded background)
  - Uses monospace font for numbers
  - Grid/flex layout: icon (left) + text (right)

- **TaskCard Component**:
  - Left border accent (blue for scheduled, red for missed, green for completed)
  - Hover effect: shadow lift + slight transform (-translate-y-1)
  - Actions: Complete button, Delete button
  - Status indication: opacity/grayscale for completed
  - Clickable to navigate to detail page

### Authentication Pages (login.tsx, register.tsx)

- **Layout**: Centered card on full-screen
- **Structure**:
  - `AuthNavbar` at top (simpler navbar)
  - Main centering flex with px-4 py-8
  - Card: max-w-md with shadow-xl border
  - Content spacing: space-y-4
  - Error alerts with destructive variant

---

## 4. Navbar Design & Branding

### Visual Identity

- **Brand Name**: "Task Scheduler"
- **Styling**: text-lg font-semibold tracking-tight
- **Design**: Minimalist typographic branding

### Navbar Behavior

```
Authenticated Users:
  Left: "Task Scheduler" logo
  Center: Nav links (Dashboard, Tasks, Insights, Calendar) - desktop only
  Right: Theme toggle + Logout button + mobile menu toggle

Unauthenticated Users:
  Left: "Task Scheduler" logo
  Right: Theme toggle + signin/signup links

Auth Pages (/login, /register):
  AuthNavbar: Logo + Theme toggle only
```

### Navigation Items (when authenticated)

- Dashboard: `/dashboard`
- Tasks: `/tasks`
- Insights: `/insights`
- Calendar: `/calendar`

---

## 5. Authentication Flow

### Current Flow for Unauthenticated Users

1. **Visit any route** → check authentication
2. **If unauthenticated on protected route** → redirected to "/login"
3. **On "/" route** → Shows LandingPage (no redirect needed)
4. **"/" after login** → Shows task creation form

### Current Problem SOLVED

- ✅ Landing page now exists for unauthenticated users
- ✅ Users see value proposition before logging in
- ✅ Hero section and features showcase implemented
- ✅ Clear CTAs encouraging signup

---

## 6. Visual Patterns & Components

### Button Variants

- **Default**: Primary color background
- **Variant: "ghost"**: Transparent/minimal
- **Sizes**: sm, md (default), lg, icon

### Card Component

- Border + rounded corners (radius: 1rem / 16px)
- Subtle shadow
- Light background in light mode, darker in dark mode
- Used for: TaskCard, StatCard, forms

### Spacing System

- **Base unit**: 0.25rem (via --spacing CSS variable)
- **Common gaps**: gap-2, gap-3, gap-4, gap-6
- **Common paddings**: p-3, p-4, p-8

### Icons

- **Library**: Lucide React (v0.561.0)
- **Usage**: Check, Trash2, Plus, Menu, X, Loader, Calendar, Zap, Flame, etc.
- **Sizing**: 14px to 18px for action buttons
- **Styling**: Color-coded (green for success, red for delete, etc.)

### Status Indicators

- **Left border accent** on TaskCard:
  - Blue (scheduled): border-l-blue-500/80
  - Red (missed): border-l-red-500/80
  - Green (completed): border-l-green-500/80

---

## 7. Visual Theme & Tone

### Current Aesthetic

- **Style**: Modern, Clean, Minimal
- **Mood**: Professional, Productivity-focused
- **Personality**: Tech-forward, No-nonsense
- **Key Features**:
  - Glassmorphism effects (backdrop blur)
  - Subtle gradients (background to muted)
  - Dark mode support (system preference aware)
  - Icons-first design (Lucide)
  - Monospace fonts for numerical data
  - Color-coded status (blue/orange/green/red)

### Visual Hierarchy

1. **Typography**: Emphasis via font-weight (semibold, medium, bold)
2. **Color**: Primary purple for CTAs, muted for secondary actions
3. **Space**: Gaps and padding create breathing room
4. **Icons**: Visual shortcuts for quick scanning
5. **Motion**: Hover effects (shadow, transform), transitions, animations

### Responsive Design

- **Mobile-first approach**:
  - hidden md:flex (desktop nav)
  - md:hidden (mobile menu)
  - Hamburger menu on mobile
  - Max-width containers (max-w-6xl)
  - Flexible padding (px-4)

---

## 8. Key Design Patterns To Replicate

See [02-DESIGN-PATTERNS-REFERENCE.md](./02-DESIGN-PATTERNS-REFERENCE.md) for detailed code examples and copy-paste snippets.

### Pattern 1: Centered Card Layout

Used in: Login, Register pages
Application: Full-screen forms, modals

### Pattern 2: Navbar with Link Navigation

Creates responsive navigation with active state indication

### Pattern 3: Stat Grid

Displays metrics with icons, values, and labels

### Pattern 4: Status-Coded Cards

Interactive cards with status indicators and hover effects

### Pattern 5: Theme Toggle

System preference detection with smooth transitions

### Pattern 6: Form Layout

Structured forms with validation and error display
