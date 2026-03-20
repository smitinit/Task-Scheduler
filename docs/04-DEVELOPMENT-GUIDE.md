# Development Guide & Recommendations

Best practices, conventions, and development guidelines for the Task Scheduler project.

## Table of Contents

1. [Project Setup](#project-setup)
2. [Code Conventions](#code-conventions)
3. [Development Workflow](#development-workflow)
4. [Key Technologies](#key-technologies)
5. [Common Tasks](#common-tasks)
6. [Debugging Guide](#debugging-guide)
7. [Performance Tips](#performance-tips)
8. [Testing Considerations](#testing-considerations)

---

## Project Setup

### Prerequisites

- Node.js 18+
- npm or yarn
- Git

### Initial Setup

```bash
# Clone repository
git clone [repo]
cd task-schedular

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your credentials

# Set up database
npm run db:migrate

# Start development server
npm run dev
```

### Development Server

```bash
npm run dev
# Runs on http://localhost:5173
```

### Build for Production

```bash
npm run build
npm run preview  # Preview production build
```

---

## Code Conventions

### File Organization

#### Route Files (`src/routes/`)

- **Naming**: kebab-case for files (e.g., `task-detail.tsx`, `task.$taskId.tsx`)
- **Structure**:
  - Imports at top (group by source)
  - Route config (createFileRoute)
  - Utilities/helpers
  - Component at bottom
  - Export Route

#### Component Files (`src/components/`)

- **Naming**: PascalCase for component files
- **Examples**: `TaskCard.tsx`, `DashboardSkeleton.tsx`, `AuthNavbar.tsx`
- **Structure**:
  - Import statements
  - Component function (named export)
  - Styles (Tailwind classes in className)
  - Export statement
- **Sub-folders**: Organize by feature/page
  - `src/components/Task/` - Task-related components
  - `src/components/dashboard/` - Dashboard components
  - `src/components/insights/` - Insights components
  - `src/components/Skeletons/` - Loading skeletons
  - `src/components/ui/` - shadcn/ui components

#### Action Files (`src/action/`)

- **Naming**: kebab-case
- **Purpose**: Server-side functions for data fetching/mutations
- **Pattern**: `createServerFn().handler(async () => {})`
- **Examples**: `create-update-task.ts`, `get-task-by-id.ts`

#### Hook Files (`src/hooks/`)

- **Naming**: camelCase starting with "use"
- **Purpose**: Client-side hooks for state management
- **Pattern**: Use TanStack Query for async state
- **Examples**: `useUser.tsx`, `useTasksByStatus.ts`

### Name Styling

#### Components

- **Components**: PascalCase (`TaskCard`, `Dashboard`, `LandingPage`)
- **Pages/Routes**: PascalCase usually, files are kebab-case

#### Variables/Functions

- **Functions**: camelCase (`formatTaskDuration`, `sendNotification`)
- **Constants**: SCREAMING_SNAKE_CASE (`MAX_TASK_DURATION`, `API_TIMEOUT`)
- **Booleans**: Start with verb (`isLoading`, `hasError`, `canDelete`)

#### CSS Classes

- **Tailwind**: Use predefined classes, avoid custom CSS when possible
- **Variables**: Use design system tokens from theme

### Import Organization

```javascript
// 1. React/Framework imports
import { useEffect } from 'react'
import { createFileRoute } from '@tanstack/react-router'

// 2. External packages (alphabetical)
import { format, addMinutes } from 'date-fns'
import { eq, and } from 'drizzle-orm'

// 3. Internal imports (absolute paths with @/)
import { TaskFormSkeleton } from '@/components/Skeletons/TaskFormSkeleton'
import { Button } from '@/components/ui/button'
import { useUser } from '@/hooks/useUser'
import { createOrUpdateTodo } from '@/action/create-update-task'
```

---

## Development Workflow

### Feature Branch Workflow

```bash
# 1. Create feature branch
git checkout -b feature/task-name

# 2. Make changes and commit
git add .
git commit -m "feat: description of changes"

# 3. Push to remote
git push origin feature/task-name

# 4. Create pull request
# (on GitHub)

# 5. Merge after review
git checkout main
git merge feature/task-name
git push origin main
```

### Commit Message Format

Use conventional commits:

```
feat:  new feature
fix:   bug fix
docs:  documentation
style: formatting/style changes
refactor: code restructuring
perf:  performance improvements
test:  test additions
chore: build/dependency updates
```

Examples:

```bash
git commit -m "feat: add email notifications"
git commit -m "fix: resolve task overlap detection bug"
git commit -m "docs: update design system"
git commit -m "chore: remove legacy demo routes"
```

### Code Review Checklist

Before submitting PR:

- [ ] Code follows naming conventions
- [ ] No console.log or debug code left
- [ ] Imports organized properly
- [ ] Tailwind classes preferred over custom CSS
- [ ] No commented-out code blocks
- [ ] Error handling implemented
- [ ] Types properly defined (TypeScript)
- [ ] Components use proper key props (if in loops)

---

## Key Technologies

### TanStack Start/React Router 7

- **Purpose**: Full-stack framework with server actions
- **Key**: Route protection via middleware
- **Skeleton Loading**: `pendingComponent` on async routes
- **Docs**: https://tanstack.com/start/v1

### Better Auth

- **Purpose**: Authentication system
- **Key**: Drizzle adapter for database integration
- **Usage**: `getCurrentSession()` for checking auth
- **Config**: `src/lib/auth-server.ts`

### Drizzle ORM

- **Purpose**: Type-safe database queries
- **Database**: PostgreSQL with Neon serverless driver
- **Schema**: `src/db/schema.ts` (unified tables + relations)
- **Migrations**: `src/drizzle/` folder
- **Key Point**: Separate `schema` (all tables) from `authSchema` (auth only)

### TanStack Query

- **Purpose**: Server state management
- **Usage**: `useQuery` for fetching, mutations for updates
- **Provider**: Wrapper in root config
- **Key**: Handles caching, invalidation, background refetching

### next-themes

- **Purpose**: Dark mode support
- **Usage**: `ThemeProvider` wraps app, `ThemeToggle` switches theme
- **Detection**: System preference aware
- **CSS**: Dark mode uses CSS variables that switch automatically

### Tailwind CSS

- **Purpose**: Utility-first styling
- **Config**: `tailwind.config.ts`
- **Tokens**: OKLch colors, custom spacing
- **Dark Mode**: Class-based (`dark:` prefix)
- **Best Practice**: Avoid custom CSS, use Tailwind classes

### shadcn/ui

- **Purpose**: Pre-built accessible components
- **Location**: `src/components/ui/`
- **Usage**: Import and use directly, customize with Tailwind
- **Philosophy**: Copy-paste components, not npm install

### Firebase Cloud Messaging (FCM)

- **Purpose**: Push notifications
- **Service Worker**: `public/firebase-messaging-sw.js`
- **Setup**: `src/components/FCMInitilizer.ts`
- **Usage**: Register tokens, receive messages

---

## Common Tasks

### Adding a New Page

1. **Create route file** in `src/routes/`:

```typescript
// src/routes/new-page.tsx
import { createFileRoute } from '@tanstack/react-router'
import { NewPageSkeleton } from '@/components/Skeletons/NewPageSkeleton'

export const Route = createFileRoute('/new-page')({
  beforeLoad: async () => {
    const { user } = await getCurrentSession()
    return { user }
  },
  component: NewPage,
  pendingComponent: NewPageSkeleton,
})

function NewPage() {
  return <div>{/* Page content */}</div>
}
```

2. **Create skeleton** if async data loading:

```typescript
// src/components/Skeletons/NewPageSkeleton.tsx
import { Skeleton } from '@/components/ui/skeleton'
import { Card } from '@/components/ui/card'

export function NewPageSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <Card className="p-4">
        <Skeleton className="h-64" />
      </Card>
    </div>
  )
}
```

3. **Protect route** if needed:

```typescript
// Add middleware in route config
server: {
  middleware: [authMiddleware]
}
```

### Adding a New Component

1. **Create component file** with proper naming
2. **Follow structure**: imports → component → exports
3. **Use Tailwind** for styling
4. **Document** props with TypeScript types
5. **Export from index** if in a feature folder

---

### Creating a Server Action

```typescript
// src/action/my-action.ts
import { createServerFn } from '@tanstack/react-start'
import { getCurrentSession } from '@/lib/sessions'

export const myAction = createServerFn({
  method: 'POST', // GET or POST
})
  .validator((data: MyData) => {
    // Validate input
    return data
  })
  .handler(async (data) => {
    const { user } = await getCurrentSession()
    if (!user) throw new Error('Unauthorized')

    // Do something
    return result
  })
```

### Using Server Actions in Components

```typescript
// In component
const { mutate, isPending } = useMutation({
  mutationFn: myAction,
  onSuccess: () => {
    // Handle success
    queryClient.invalidateQueries()
  },
})

// On user action
<Button
  onClick={() => mutate(data)}
  disabled={isPending}
>
  {isPending ? 'Loading...' : 'Submit'}
</Button>
```

---

## Debugging Guide

### Enable Debug Logs

```typescript
// In route or component
import { debug } from '@tanstack/react-router'
debug()
```

### Check Authentication State

```typescript
// In browser console
const response = await fetch('/api/auth')
const session = await response.json()
console.log(session)
```

### Database Queries

Use Drizzle Studio:

```bash
npx drizzle-kit studio
# Opens studio at http://local.drizzle.studio
```

### Build Issues

**Vite build errors**:

```bash
npm run build -- --debug
```

**Module resolution**:

- Check `tsconfig.json` paths
- Verify import paths use `@/` prefix correctly
- Clear `.next` or `dist/` cache

### Common Errors

**"Unauthorized" on protected route**:

- Check session is properly set in localStorage
- Verify `getCurrentSession()` is called
- Check auth middleware is applied

**Component not rendering**:

- Check `pendingComponent` is exported
- Verify route component is exported
- Check for TypeScript errors

---

## Performance Tips

### Optimize Re-renders

- Use `useMemo()` for expensive calculations
- Use `useCallback()` for stable function references
- Memoize components with `React.memo()` if needed

### Query Optimization

- Set appropriate `staleTime` in TanStack Query
- Use `refetchOnWindowFocus: false` if not needed
- Implement pagination for large lists

### Image Optimization

- Use Next.js Image or WebP when possible
- Optimize SVG icons (Lucide React already does this)
- Load images lazily with intersection observer

### Bundle Size

- Code-split routes automatically
- Tree-shake unused imports
- Check bundle size: `npm run build-stats`

### Database

- Add indexes on frequently queried columns
- Use database query optimization
- Implement connection pooling (Neon handles this)

---

## Testing Considerations

### Unit Tests

```bash
npm run test
```

Consider testing:

- Utility functions (formatting, calculations)
- Component rendering with different props
- Form validation logic

### Integration Tests

- Test authentication flow
- Test task creation → display
- Test data mutations and refetches

### E2E Tests

Consider Playwright or Cypress for:

- Full user workflows
- Cross-browser testing
- Performance monitoring

---

## Resources

### Documentation

- [TanStack Start](https://tanstack.com/start/v1)
- [Drizzle ORM](https://orm.drizzle.team/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Better Auth](https://www.better-auth.com/)

### Design System

See `/docs/` folder for:

- `01-DESIGN-SYSTEM.md` - Colors, typography, patterns
- `02-DESIGN-PATTERNS-REFERENCE.md` - Component code examples
- `03-COMPONENT-INVENTORY.md` - Component usage map

### Internal Guides

- [LEGACY-CODE-CLEANUP.md](./LEGACY-CODE-CLEANUP.md) - Cleanup tasks
- [README.md](../README.md) - Project overview
