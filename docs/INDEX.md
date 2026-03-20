# Task Scheduler - Documentation Index

This folder contains all project documentation organized by topic.

## 📚 Documentation Structure

### Getting Started

- [README.md](../README.md) - Main project overview and architecture

### Design System & Patterns

- [01-DESIGN-SYSTEM.md](./01-DESIGN-SYSTEM.md) - Complete design system analysis (colors, typography, patterns)
- [02-DESIGN-PATTERNS-REFERENCE.md](./02-DESIGN-PATTERNS-REFERENCE.md) - Reusable components and patterns with code snippets
- [03-COMPONENT-INVENTORY.md](./03-COMPONENT-INVENTORY.md) - Current page layouts and component usage

### Development Reference

- [04-DEVELOPMENT-GUIDE.md](./04-DEVELOPMENT-GUIDE.md) - Recommendations and development guidelines
- [LEGACY-CODE-CLEANUP.md](./LEGACY-CODE-CLEANUP.md) - List of deprecated/unused code and cleanup tasks

---

## 🎨 Quick Links

### Design System

- **Colors**: OKLch palette (Purple + Orange theme) - [See Design System](./01-DESIGN-SYSTEM.md#2-design-system--color-palette)
- **Typography**: Geist fonts with size hierarchy - [See Typography](./02-DESIGN-PATTERNS-REFERENCE.md#typography)
- **Spacing**: Tailwind gap/padding system - [See Spacing Guide](./02-DESIGN-PATTERNS-REFERENCE.md#spacing--sizing-guide)

### Component Patterns

- **Centered Card Layout** - Auth pages layout - [View Pattern](./02-DESIGN-PATTERNS-REFERENCE.md#pattern-1-full-screen-centered-card)
- **Glassmorphic Navbar** - Header with backdrop blur - [View Pattern](./02-DESIGN-PATTERNS-REFERENCE.md#pattern-3-navbar-structure)
- **Stat Grid** - Metrics display - [View Pattern](./02-DESIGN-PATTERNS-REFERENCE.md#pattern-4-statmetric-card-grid)
- **Status-Coded Cards** - Interactive task cards - [View Pattern](./02-DESIGN-PATTERNS-REFERENCE.md#pattern-5-interactive-card-with-hover-state)

### Key Files

- **Route Protection**: `/src/middleware/auth.ts` - Authentication middleware
- **Auth Setup**: `/src/lib/auth-server.ts` - Better Auth configuration
- **Theme Provider**: `/src/integrations/next-themes/theme-provider.tsx` - Dark mode setup
- **Skeleton Loaders**: `/src/components/Skeletons/` - Loading state components

---

## 📝 Document Descriptions

| Document                            | Purpose                                                                               | Audience                              |
| ----------------------------------- | ------------------------------------------------------------------------------------- | ------------------------------------- |
| **01-DESIGN-SYSTEM.md**             | Complete breakdown of colors, typography, and design patterns used throughout the app | Designers, Front-end developers       |
| **02-DESIGN-PATTERNS-REFERENCE.md** | Reusable code patterns, component snippets, and quick-reference guide                 | Developers implementing features      |
| **03-COMPONENT-INVENTORY.md**       | Detailed list of which components are used in which pages                             | Project maintainers, new team members |
| **04-DEVELOPMENT-GUIDE.md**         | Recommendations, best practices, and next steps for development                       | All developers                        |
| **LEGACY-CODE-CLEANUP.md**          | Identified unused code, demo files, and cleanup tasks with priority                   | Project leads, QA team                |

---

## ✅ Recent Improvements

- ✅ Landing page created and integrated (`LandingPage.tsx`)
- ✅ All authenticated routes protected with middleware
- ✅ Skeleton loaders added for async pages
- ✅ Design system organized and documented
- ✅ Authentication navbar added to login/register pages

---

## 🚀 Next Steps

See [LEGACY-CODE-CLEANUP.md](./LEGACY-CODE-CLEANUP.md) for:

1. **Priority 1** items to remove immediately
2. **Priority 2** cleanup tasks
3. **Priority 3** optional improvements

---

_Last updated: March 2026_
