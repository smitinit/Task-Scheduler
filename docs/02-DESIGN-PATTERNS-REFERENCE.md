# Task Scheduler - Design Patterns & Component Reference

Complete guide to reusable patterns, components, and code snippets used throughout the project.

## Table of Contents

1. [Quick Color Reference](#quick-color-reference)
2. [Reusable Layout Patterns](#reusable-layout-patterns)
3. [Component Usage Patterns](#component-usage-patterns)
4. [Spacing & Sizing Guide](#spacing--sizing-guide)
5. [Typography](#typography)
6. [Icon Usage (Lucide React)](#icon-usage-lucide-react)
7. [Responsive Breakpoints](#responsive-breakpoints)
8. [Animations & Transitions](#animations--transitions)
9. [Dark Mode Implementation](#dark-mode-implementation)
10. [Form Validation Patterns](#form-validation-patterns)

---

## Quick Color Reference

### Light Mode OKLch Values

```
Primary:        oklch(0.3084 0.1285 300.5672)  → Deep Purple
Secondary:      oklch(0.6898 0.1843 39.8518)   → Orange/Gold
Accent:         oklch(0.9691 0.0161 293.7558)  → Light Purple
Destructive:    oklch(0.6368 0.2078 25.3313)   → Red
Foreground:     oklch(0.2161 0.0061 56.0434)   → Dark
Background:     oklch(0.9903 0.0058 59.6542)   → Off-white
Muted:          oklch(0.9699 0.0013 106.4238)  → Light Gray
Border:         oklch(0.9232 0.0026 48.7171)   → Gray
```

### Dark Mode OKLch Values

```
Primary:        oklch(0.6056 0.2189 292.7172)  → Bright Purple
Secondary:      oklch(0.7073 0.1817 40.3193)   → Bright Orange
Background:     oklch(0.1985 0.0446 303.5739)  → Deep Purple/Navy
Foreground:     oklch(0.9789 0.0013 106.4235)  → Off-white
```

### Semantic Colors (Tailwind classes)

- **Blue**: Task scheduled - `border-l-blue-500/80`
- **Red**: Task missed - `border-l-red-500/80`
- **Green**: Task completed - `border-l-green-500/80`
- **Yellow**: Warnings/conflicts - `border-yellow-600`, `text-yellow-800/80`

---

## Reusable Layout Patterns

### Pattern 1: Full-Screen Centered Card

**Used in**: Login, Register, Auth pages  
**Purpose**: Center form content on full screen

```jsx
<div className="min-h-screen flex flex-col">
  {/* Header/Navbar */}
  <AuthNavbar />

  {/* Content */}
  <div className="flex-1 flex items-center justify-center px-4 py-8">
    <Card className="w-full max-w-md shadow-xl border">
      {/* Card content */}
    </Card>
  </div>
</div>
```

---

### Pattern 2: Main Content Layout

**Used in**: Dashboard, tasks, insights, calendar pages  
**Purpose**: Consistent page container with gradient background

```jsx
<main className="mx-auto max-w-6xl px-4 py-8 bg-linear-to-b from-background to-muted/20">
  {/* Page content with linear gradient background */}
</main>
```

---

### Pattern 3: Navbar Structure

**Used in**: Main navigation bar (Navbar.tsx)  
**Purpose**: Responsive header with glassmorphism effect

```jsx
<header className="w-full border-b bg-background/80 backdrop-blur supports-backdrop-filter:bg-background/60">
  <div className="mx-auto max-w-6xl px-4">
    <div className="flex h-14 items-center justify-between">
      {/* LEFT: Logo/Brand */}
      <Link to="/" className="text-lg font-semibold tracking-tight">
        Task Scheduler
      </Link>

      {/* CENTER: Nav items (desktop only) */}
      <nav className="hidden md:flex items-center gap-6">
        <NavLink to="/dashboard">Dashboard</NavLink>
        <NavLink to="/tasks">Tasks</NavLink>
        <NavLink to="/insights">Insights</NavLink>
        <NavLink to="/calendar">Calendar</NavLink>
      </nav>

      {/* RIGHT: Theme toggle + User actions */}
      <div className="flex items-center gap-2">
        <ThemeToggle />
        {user && <LogoutButton />}
      </div>
    </div>
  </div>
</header>
```

**Glassmorphism Effects**:

- `bg-background/80` - 80% opacity background
- `backdrop-blur` - Blur background
- `supports-backdrop-filter:bg-background/60` - Fallback opacity

---

### Pattern 4: Stat/Metric Card Grid

**Used in**: Dashboard statistics  
**Purpose**: Display KPIs with icons and monospace numbers

```jsx
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
  {stats.map((stat) => (
    <div
      key={stat.label}
      className="rounded-lg border bg-card p-4 flex items-center gap-3"
    >
      <div
        className={`w-9 h-9 rounded-md flex items-center justify-center ${stat.accent}`}
      >
        <stat.Icon className="w-4 h-4" />
      </div>
      <div>
        <p className="text-2xl font-mono font-bold tabular-nums">
          {stat.value}
        </p>
        <p className="text-xs text-muted-foreground">{stat.label}</p>
      </div>
    </div>
  ))}
</div>
```

**Key Features**:

- Icon in colored background (`bg-blue-500/10 text-blue-600`)
- Monospace font (`font-mono font-bold`)
- Muted label (`text-xs text-muted-foreground`)

---

### Pattern 5: Interactive Card with Hover State

**Used in**: TaskCard component  
**Purpose**: Clickable cards with visual feedback

```jsx
<Card
  className={cn(
    'cursor-pointer transition-all duration-200 ease-out',
    'hover:shadow-lg hover:-translate-y-1',
    'border-l-[3px]',
    status === 'scheduled' && 'border-l-blue-500/80',
    status === 'completed' && 'grayscale-20 opacity-60',
  )}
>
  <CardContent className="p-3 space-y-2">
    {/* Content */}
    <div className="flex items-start justify-between">
      <h3 className="font-medium text-sm line-clamp-2">{title}</h3>
      <div className="flex gap-2">{/* Action buttons */}</div>
    </div>
  </CardContent>
</Card>
```

**Effects**:

- Lift on hover: `-translate-y-1 shadow-lg`
- Status indicator: Left border color
- Disabled state: `grayscale-20 opacity-60`

---

### Pattern 6: Form Layout

**Used in**: Task creation, task editing  
**Purpose**: Structured form with validation

```jsx
<form onSubmit={handleSubmit} className="space-y-6">
  <div className="space-y-2">
    <Label>Field Name</Label>
    <Input placeholder="..." {...register('field')} />
    {errors.field && (
      <p className="text-sm text-red-500">{errors.field.message}</p>
    )}
  </div>

  {/* Multiple fields with same spacing */}

  <div className="flex justify-end gap-3">
    <Button type="button" variant="outline">
      Cancel
    </Button>
    <Button type="submit">Submit</Button>
  </div>
</form>
```

**Spacing**:

- `space-y-6` for section separation
- `space-y-2` for label + input groups

---

## Component Usage Patterns

### Button Variants

```jsx
// Primary action
<Button type="submit">Add Task</Button>

// Secondary action
<Button variant="outline">Cancel</Button>

// Ghost (minimal)
<Button variant="ghost" size="icon">
  <Icon />
</Button>

// Disabled state with loading
<Button disabled={isLoading}>
  {isLoading && <Loader className="animate-spin h-4 w-4 mr-2" />}
  {isLoading ? 'Loading...' : 'Submit'}
</Button>
```

---

### Input with Error State

```jsx
;<Input
  className={errors.field ? 'border-red-500 focus-visible:ring-red-500' : ''}
  {...register('field')}
/>
{
  errors.field && (
    <p className="text-sm text-red-500 transition-all duration-200">
      {errors.field.message}
    </p>
  )
}
```

---

### Alert Component

```jsx
// Destructive (error)
<Alert variant="destructive">
  <AlertDescription>Error message</AlertDescription>
</Alert>

// Warning (custom styling)
<div className="p-3 rounded-md border border-yellow-600 text-yellow-800 dark:border-yellow-200 dark:text-yellow-500 text-sm">
  {/* Content */}
</div>
```

---

### Tabs Component

```jsx
<Tabs defaultValue="quick">
  <TabsList>
    <TabsTrigger value="quick">Quick</TabsTrigger>
    <TabsTrigger value="advanced">Advanced</TabsTrigger>
  </TabsList>

  <TabsContent value="quick" className="space-y-6 mt-6">
    {/* Quick add content */}
  </TabsContent>

  <TabsContent value="advanced" className="space-y-6 mt-6">
    {/* Advanced form content */}
  </TabsContent>
</Tabs>
```

---

## Spacing & Sizing Guide

### Gaps (margin between elements)

```
gap-2 = 0.5rem (8px)      → Tight spacing (icon + label)
gap-3 = 0.75rem (12px)    → Default spacing
gap-4 = 1rem (16px)       → Section spacing
gap-6 = 1.5rem (24px)     → Large spacing
```

### Padding

```
p-3 = 0.75rem (12px)      → Card content
p-4 = 1rem (16px)         → Large content area
p-8 = 2rem (32px)         → Page sections
px-4 = 1rem horizontal    → Default container padding
py-8 = 2rem vertical      → Page top/bottom padding
```

### Heights

```
h-9  = 36px               → Icon buttons
h-14 = 56px               → Navbar height
min-h-screen              → Full viewport height
```

### Width

```
w-4, w-5, w-6             → Icon sizes
max-w-md = 28rem (448px)  → Form/card width
max-w-6xl = 64rem (1024px) → Page container
```

---

## Typography

### Font Families

- **Primary**: Geist (sans-serif)
- **Mono**: Geist Mono (for numbers/code)

### Common Sizes & Styles

```jsx
// Hero heading
<h1 className="text-5xl font-semibold tracking-tight">Heading</h1>

// Page title
<h2 className="text-2xl font-semibold">Title</h2>

// Card/section heading
<h3 className="text-lg font-semibold">Card Title</h3>

// Body text
<p className="text-sm text-foreground">Body text</p>

// Muted text
<p className="text-xs text-muted-foreground">Secondary</p>

// Numeric (monospace)
<p className="text-2xl font-mono font-bold tabular-nums">123</p>

// Metadata
<p className="text-xs text-muted-foreground">label</p>
```

### Text Truncation

```jsx
// Single line
<p className="truncate">{text}</p>

// Multiple lines (2 lines max)
<p className="line-clamp-2">{text}</p>

// Strikethrough
<p className="line-through">{text}</p>
```

---

## Icon Usage (Lucide React)

### Common Icons

```jsx
import {
  Plus, // Add action
  Check, // Completed/success
  Trash2, // Delete
  Calendar, // Calendar/date
  Clock, // Time
  Menu, // Mobile menu
  X, // Close
  Loader, // Loading spinner
  Eye,
  EyeOff, // Password toggle
  Moon,
  Sun, // Theme toggle
  ArrowRight, // Navigation
  Zap, // Energy/focus
  Flame, // Streaks/consistency
  AlertCircle, // Alert
  TriangleAlert, // Warning
} from 'lucide-react'
```

### Icon Sizing

```jsx
size={14}                 // Action buttons
size={18}                 // Navigation
size={24}                 // Hero/feature icons
className="w-4 h-4"       // Consistent sizing
className="animate-spin"  // Loading state
```

---

## Responsive Breakpoints

### Tailwind Breakpoints

```
Default (mobile)       → 0px
sm:  640px
md:  768px             ← Main breakpoint (nav items appear)
lg:  1024px
xl:  1280px
2xl: 1536px
```

### Common Patterns

```jsx
// Desktop navigation
<nav className="hidden md:flex items-center gap-6">
  {/* Shows on md+ */}
</nav>

// Mobile menu
<div className="md:hidden">
  {/* Shows only on mobile */}
</div>

// Responsive grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
```

---

## Animations & Transitions

### Built-in Animations

```jsx
// Spinner
className = 'animate-spin'

// Fade in/out
className = 'transition-all duration-200'

// Transform
className = 'hover:shadow-lg hover:-translate-y-1'

// Color transition
className = 'transition-colors hover:text-foreground'
```

### Duration Classes

```
duration-200   ← Default (used in component hovers)
duration-300
duration-500   ← Subtle delays
```

---

## Dark Mode Implementation

### How It Works

- **Class-based**: Add `dark` class to `<html>`
- **Theme Provider**: Uses `next-themes` via `ThemeProvider`
- **Detection**: System preference aware (`enableSystem=true`)
- **Specificity**: CSS variables switch based on class

### Dark Mode Color Application

```jsx
// Automatically applied via CSS variables
// Light mode: --primary = oklch(0.3084...)
// Dark mode: --primary = oklch(0.6056...)

// In JSX, just use semantic colors
<div className="bg-background text-foreground">
  {/* Automatically switches in dark mode */}
</div>
```

### Dark Mode Specific Styling

```jsx
<div
  className="
  border-yellow-600 
  text-yellow-800 
  dark:border-yellow-200 
  dark:text-yellow-500
"
>
  {/* Light: yellow-600/800, Dark: yellow-200/500 */}
</div>
```

---

## Form Validation Patterns

### Error Display

```jsx
{
  errors.field && (
    <p className="text-sm text-red-500 transition-all duration-200">
      {errors.field.message}
    </p>
  )
}
```

### Input Styling

```jsx
<Input
  className={errors.field ? 'border-red-500 focus-visible:ring-red-500' : ''}
  {...register('field')}
/>
```

### Root Form Error

```jsx
{
  errors.root && (
    <div className="p-3 rounded-md bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-200 text-sm">
      {errors.root.message}
    </div>
  )
}
```

---

## Quick Copy-Paste Snippets

### StatCard Accent Colors

```
bg-blue-500/10 text-blue-600          (Blue)
bg-orange-500/10 text-orange-600      (Orange)
bg-green-500/10 text-green-600        (Green)
bg-purple-500/10 text-purple-600      (Purple)
bg-red-500/10 text-red-600            (Red)
```

### Link Styling

```jsx
<Link
  to="/path"
  activeProps={{ className: 'text-foreground font-medium' }}
  inactiveProps={{ className: 'text-muted-foreground' }}
  className="text-sm transition-colors hover:text-foreground"
>
  Label
</Link>
```
