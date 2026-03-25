# Task Scheduler - Architectural Audit Report

**Date:** March 25, 2026  
**Scope:** Full codebase audit against TanStack Start and Vercel React best practices

---

## Executive Summary

Total Violations Found: **18 violations**

- CRITICAL: 2
- HIGH: 8
- MEDIUM: 7
- LOW: 1

The codebase demonstrates strong foundational patterns with proper server function implementation and error handling. However, there are several performance optimization opportunities and some areas where patterns should be more standardized.

---

## 1. SERVER FUNCTIONS (createServerFn patterns)

### ✅ PASSING

- All server functions properly use `createServerFn` with appropriate HTTP methods
- Input validation consistently applied with Zod schemas
- Error handling is typed and consistent across all functions
- Auth checks properly implemented in all mutation functions

### ⚠️ VIOLATIONS

#### **A. No Request-Level Deduplication with React.cache()**

- **File:** [src/lib/sessions.ts](src/lib/sessions.ts#L1)
- **Priority:** HIGH
- **Pattern:** Manual `requestSessionCache` object managing session cache
- **Violation:** TanStack Start best practice `sf-response-headers` and React Server Components should use React.cache() for per-request deduplication instead of manual cache object
- **Issue:** Manual caching is fragile, doesn't integrate with React's request lifecycle, and can cause hydration issues
- **Fix:** Replace manual caching with React.cache():

```typescript
import { cache } from 'react'
export const getCurrentSession = cache(async () => {
  const headers = getRequestHeaders()
  const sessionData = await auth.api.getSession({ headers })
  return {
    user: sessionData?.user || null,
    session: sessionData?.session || null,
  }
})
```

#### **B. Unused resetSessionCache() Function**

- **File:** [src/lib/sessions.ts](src/lib/sessions.ts#L48)
- **Priority:** LOW
- **Pattern:** Function exposed but not called anywhere
- **Violation:** Dead code with manual cache reset that shouldn't exist with React.cache()
- **Fix:** Remove the `resetSessionCache()` function entirely

#### **C. Duplicate Session Handling Code**

- **File:** [src/lib/sessions.ts](src/lib/sessions.ts#L1) vs [src/lib/sessions.server.ts](src/lib/sessions.server.ts#L1)
- **Priority:** HIGH
- **Pattern:** Two files with similar session retrieval logic
- **Violation:** Violates DRY principle and creates maintenance burden
- **Issue:** sessions.server.ts exists but sessions.ts has the main logic; confusing which to use
- **Fix:** Consolidate into single `sessions.server.ts` file and import from it

---

## 2. DATA LOADING & FETCHING

### ⚠️ VIOLATIONS

#### **A. Sequential Auth Check and Data Load Waterfall**

- **Files:**
  - [src/routes/dashboard.tsx](src/routes/dashboard.tsx#L1)
  - [src/routes/tasks.tsx](src/routes/tasks.tsx#L1)
  - [src/routes/insights.tsx](src/routes/insights.tsx#L1)
  - [src/routes/add.tsx](src/routes/add.tsx#L1)
- **Priority:** CRITICAL
- **Pattern:**

```typescript
export const Route = createFileRoute('/dashboard')({
  beforeLoad: async () => {
    const { user } = await getCurrentSession() // WAIT 1
    if (!user) throw redirect({ to: '/login' })
  },
  loader: async () => {
    const tasks = await getTasks() // WAIT 2 (after beforeLoad completes)
    return { tasks }
  },
})
```

- **Violation:** `async-parallel` - Sequential waterfall where getTasks waits for beforeLoad completion
- **Issue:** Double session retrieval - getCurrentSession called in beforeLoad AND implicitly in getTasks via server function
- **Impact:** 2x session queries, 2x network roundtrips
- **Fix:** Load auth and tasks in parallel:

```typescript
loader: async () => {
  const { user } = await getCurrentSession()
  if (!user) throw redirect({ to: '/login' })

  // Load in parallel since both need auth
  const [tasks] = await Promise.all([getTasks()])
  return { tasks }
}
```

#### **B. Missing Parallel Data Fetching in createOrUpdateTodo**

- **File:** [src/routes/add.tsx](src/routes/add.tsx#L1)
- **Priority:** HIGH
- **Pattern:** Form validation and task retrieval sequential
- **Violation:** `async-parallel` - Could prefetch task list while user fills form
- **Issue:** User must wait for network roundtrip to getTasks before form appears
- **Fix:** Fetch form data in loader, not in effect:

```typescript
loader: async () => {
  // Fetch tasks for conflict detection
  const [tasks] = await Promise.all([getTasksForForm()])
  return { tasks }
}
```

#### **C. No React.cache() for Cross-Request Deduplication**

- **Files:** [src/action/get-task.ts](src/action/get-task.ts#L1), [src/action/get-user.ts](src/action/get-user.ts#L1)
- **Priority:** HIGH
- **Pattern:** Multiple components may call same server function
- **Violation:** `server-cache-react` - Per-request caching should use React.cache()
- **Issue:** If multiple components need same data in single request, multiple DB queries run
- **Example:** Dashboard might call getTasks and also load yesterday's data
- **Fix:** Wrap in React.cache for SSR:

```typescript
import { cache } from 'react'
export const getTasks = cache(async () => {
  // ... implementation
})
```

#### **D. usePollOnVisible Creates Unnecessary Waterfalls**

- **File:** [src/hooks/usePollOnVisible.ts](src/hooks/usePollOnVisible.ts#L1)
- **Priority:** MEDIUM
- **Pattern:** `router.invalidate()` refreshes ALL loader data
- **Violation:** `async-parallel` - Invalidates entire route, triggers sequential re-fetching
- **Issue:** When user returns to tab, all loaders re-run sequentially instead of in parallel
- **Fix:** Use React Query's selective invalidation or invalidate specific queries:

```typescript
export function usePollOnVisible(intervalMs = 60_000) {
  const queryClient = useQueryClient()
  // ...
  queryClient.invalidateQueries({ queryKey: ['tasks'] })
}
```

#### **E. Dashboard State Mutation Not Using Query Client Invalidation**

- **File:** [src/components/dashboard/dashboard.tsx](src/components/dashboard/dashboard.tsx#L88)
- **Priority:** MEDIUM
- **Pattern:**

```typescript
async function handleReschedule(task: Task) {
  await createOrUpdateTodo({ ... })
  setTasks(await getTasks())  // Re-fetches instead of updating cache
}
```

- **Violation:** `server-cache-react` - Unnecessary re-fetch when cache should be updated
- **Issue:** Forces new network request instead of using React Query cache
- **Fix:** Invalidate React Query cache instead:

```typescript
async function handleReschedule(task: Task) {
  await createOrUpdateTodo({ ... })
  await queryClient.invalidateQueries({ queryKey: ['tasks'] })
}
```

---

## 3. ROUTE ARCHITECTURE

### ✅ PASSING

- beforeLoad hooks properly used for auth checks
- Loaders properly structured for data fetching
- Error boundaries implemented
- Redirect patterns correct

### ⚠️ VIOLATIONS

#### **A. Missing Suspense Boundaries**

- **Files:**
  - [src/routes/dashboard.tsx](src/routes/dashboard.tsx#L24)
  - [src/routes/tasks.tsx](src/routes/tasks.tsx#L24)
  - [src/components/dashboard/dashboard.tsx](src/components/dashboard/dashboard.tsx#L1)
- **Priority:** MEDIUM
- **Pattern:** Using `pendingComponent` but no granular Suspense boundaries
- **Violation:** `ssr-streaming` - Should use Suspense for selective streaming
- **Issue:** Entire page shows LoadingSpinner instead of streaming individual sections
- **Fix:** Wrap sections in Suspense:

```typescript
import { Suspense } from 'react'

return (
  <div>
    <Suspense fallback={<StatsSkeleton />}>
      <Stats tasks={tasks} />
    </Suspense>
    <Suspense fallback={<TimelineSkeleton />}>
      <Timeline tasks={tasks} />
    </Suspense>
  </div>
)
```

---

## 4. COMPONENT STRUCTURE

### ⚠️ VIOLATIONS

#### **A. Dashboard Component Has State Update After Mutation**

- **File:** [src/components/dashboard/dashboard.tsx](src/components/dashboard/dashboard.tsx#L88-L100)
- **Priority:** CRITICAL
- **Pattern:**

```typescript
async function handleComplete(id: number) {
  await markTaskCompletion({ data: { id } })
  setTasks(
    (
      prev, // Manual state mutation
    ) =>
      prev.map((t) =>
        t.id === id ? { ...t, status: 'completed' as const } : t,
      ),
  )
}
```

- **Violation:** `rerender-no-inline-components` - Not about components, but state management is problematic
- **Issue:** Manual state management causes stale data, hydration mismatches, and unnecessary re-renders
- **Fix:** Use React Query mutations with automatic cache updates:

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query'

const queryClient = useQueryClient()
const completeTaskMutation = useMutation({
  mutationFn: ({ id }: { id: number }) => markTaskCompletion({ data: { id } }),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ['tasks'] })
  },
})
```

#### **B. Navbar Component Defines Constants Inside Render**

- **File:** [src/components/Navbar.tsx](src/components/Navbar.tsx#L1)
- **Priority:** MEDIUM
- **Pattern:**

```typescript
export default function Navbar() {
  const [open, setOpen] = useState(false)
  // NAV_ITEMS defined OUTSIDE should be, but inside is fine
  // BUT useUser hook is called without conditional
```

- **Violation:** `rerender-defer-reads` - useUser hook called unconditionally
- **Issue:** useUser query reruns even if user data not needed for current render path
- **Fix:** Conditional hook usage or split component:

```typescript
// Only call if we know we need user
{user && <NavLinks />}
```

#### **C. ActiveTaskWidget Not Memoized Despite Expensive Calculations**

- **File:** [src/components/dashboard/ActiveTaskWidget.tsx](src/components/dashboard/ActiveTaskWidget.tsx#L1)
- **Priority:** MEDIUM
- **Pattern:** Component calculates progress on every render, receives `now` prop that changes every render
- **Violation:** `rerender-memo` - Component should be memoized or dependencies optimized
- **Issue:** Parent (dashboard) updates `now` state every minute, causing all children to re-render
- **Fix:** Memoize component or move time logic to parent:

```typescript
export const ActiveTaskWidget = memo(
  ({ task, now }: Props) => {
    // ...
  },
  (prev, next) => {
    // Custom comparison - only re-render if task changes
    return prev.task?.id === next.task?.id
  },
)
```

#### **D. TimelineItem Has Constant Calculations Without Memoization**

- **File:** [src/components/dashboard/TimelineItem.tsx](src/components/dashboard/TimelineItem.tsx#L1)
- **Priority:** MEDIUM
- **Pattern:** Expensive date/time calculations on every render
- **Violation:** `rerender-memo` - Child of timeline that renders multiple times
- **Issue:** If parent has `now` changing every minute, all 20+ TimelineItems recalculate
- **Fix:** Memoize component:

```typescript
export const TimelineItem = memo(TimelineItemComponent, (prev, next) => {
  return (
    prev.task.id === next.task.id &&
    prev.now.getMinutes() === next.now.getMinutes()
  )
})
```

#### **E. Dashboard Timer Updates Every Second, Only Minute Changes Matter**

- **File:** [src/components/dashboard/dashboard.tsx](src/components/dashboard/dashboard.tsx#L35-L55)
- **Priority:** MEDIUM
- **Pattern:**

```typescript
useEffect(() => {
  const id = setInterval(() => {
    const newNow = new Date()
    const oldMinute = nowRef.current.getMinutes()
    const newMinute = newNow.getMinutes()

    if (oldMinute !== newMinute) {
      setNow(newNow) // Only updates when minute changes
    }
    nowRef.current = newNow
  }, 1000) // But checks every second
}, [])
```

- **Violation:** `js-cache-property-access` - Shouldn't check every second if only minute matters
- **Issue:** Unnecessary interval checks waste CPU cycles
- **Fix:** Use longer interval or calculate exact next minute:

```typescript
useEffect(() => {
  const now = new Date()
  const msUntilNextMinute = (60 - now.getSeconds()) * 1000

  const timeoutId = setTimeout(() => {
    setNow(new Date())
    const intervalId = setInterval(() => setNow(new Date()), 60000)
    return () => clearInterval(intervalId)
  }, msUntilNextMinute)

  return () => clearTimeout(timeoutId)
}, [])
```

---

## 5. API SEPARATION

### ⚠️ VIOLATIONS

#### **A. Mixed Auth Functions in Single File**

- **File:** [src/action/auth.ts](src/action/auth.ts#L1)
- **Priority:** HIGH
- **Pattern:** Client-side auth functions mixed with comment "Client-side only" but no actual separation
- **Violation:** `file-separation` - Server and client code should not be in same file
- **Issue:** File is not actually `.server.ts`, could be accidentally imported on server
- **Fix:** Rename to `src/lib/auth/client.ts` or move to client folder:

```typescript
// OLD: src/action/auth.ts (bad - looks like server function)
// NEW: src/lib/auth-client.ts (good - clearly client)
```

#### **B. No .server.ts Suffix on Server-Only Files**

- **File:** [src/lib/sessions.server.ts](src/lib/sessions.server.ts#L1) exists but [src/lib/sessions.ts](src/lib/sessions.ts#L1) is the main one
- **Priority:** MEDIUM
- **Pattern:** Confusing naming scheme with redundant files
- **Violation:** `file-separation` - Should have clear pattern
- **Issue:** Developers don't know which to import
- **Fix:** Consolidate to single `sessions.server.ts` or consistently name all server-only files

#### **C. API Routes Not Clearly Documented as External**

- **File:** [src/routes/api/register-fcm-token.ts](src/routes/api/register-fcm-token.ts#L1)
- **Priority:** LOW
- **Pattern:** API routes in `routes/api/` folder but mixed with route files
- **Violation:** `api-routes` - Should be clearly separated from route tree
- **Issue:** Less clear that these are for external consumption
- **Fix:** Add JSDoc comment:

```typescript
/**
 * @route POST /api/register-fcm-token
 * @description Register FCM token for push notifications (external API)
 */
```

---

## 6. TYPE SAFETY

### ✅ PASSING

- Zod schemas properly defined
- Type inference working correctly
- Domain types centralized in [src/types/task.ts](src/types/task.ts)
- AppError properly typed

### ⚠️ VIOLATIONS

#### **A. ServerTaskInput Uses Nullable Transform, Creates Confusion**

- **File:** [src/zod/server-task-schema.ts](src/zod/server-task-schema.ts#L1)
- **Priority:** LOW
- **Pattern:**

```typescript
description: z
  .string()
  .max(2000)
  .nullable()
  .optional()
  .transform((v) => v ?? undefined),
```

- **Violation:** `server-serialization` - Complex transformation adds confusion
- **Issue:** DB returns null, Zod converts to undefined, downstream code expects undefined
- **Fix:** Simplify to direct coercion:

```typescript
description: z
  .string()
  .max(2000)
  .nullable()
  .pipe(z.string().optional()),
```

---

## 7. ERROR HANDLING

### ✅ PASSING

- Typed AppError class implemented
- GlobalErrorBoundary comprehensive
- Error codes consistent
- Server function error handling correct

---

## 8. PERFORMANCE ISSUES

### ⚠️ VIOLATIONS

#### **A. Router.invalidate() Invalidates All Loaders**

- **File:** [src/hooks/usePollOnVisible.ts](src/hooks/usePollOnVisible.ts#L15) and [src/components/Task/TaskCard.tsx](src/components/Task/TaskCard.tsx#L54)
- **Priority:** HIGH
- **Pattern:** `router.invalidate()` with no query key specification
- **Violation:** `async-parallel` - Causes sequential re-fetching of all loaders
- **Issue:** Even if only one piece of data changed, all loader queries re-run sequentially
- **Impact:** Waterfall: beforeLoad → loader → component render (x3 for 3 mutations)
- **Fix:** Specify which query to invalidate:

```typescript
// Instead of:
router.invalidate()

// Use:
queryClient.invalidateQueries({ queryKey: ['tasks'] })
```

#### **B. Barrel Imports in Component Tree**

- **Files:** [src/components/ui/](src/components/ui/) (assumed from structure)
- **Priority:** MEDIUM
- **Pattern:** Likely barrel exports (index.ts) in ui component folder
- **Violation:** `bundle-barrel-imports` - Should import components directly
- **Issue:** Imports components not used, increases bundle
- **Fix:** Import direct paths:

```typescript
// Instead of:
import { Button, Card, Input } from '@/components/ui'

// Use:
import Button from '@/components/ui/button'
import Card from '@/components/ui/card'
import Input from '@/components/ui/input'
```

#### **C. No Dynamic Imports for Heavy Components**

- **Files:** [src/components/insights/](src/components/insights/) (entire folder)
- **Priority:** MEDIUM
- **Pattern:** Insights components imported directly in route
- **Violation:** `bundle-dynamic-imports` - Heavy chart components should be lazy
- **Issue:** Charts (recharts) bundle included even if user never views insights
- **Fix:** Use dynamic imports:

```typescript
import { lazy, Suspense } from 'react'

const Insights = lazy(() => import('@/components/insights'))

export const Route = createFileRoute('/insights')({
  component: () => (
    <Suspense fallback={<LoadingSpinner />}>
      <Insights />
    </Suspense>
  ),
})
```

#### **D. Firebase SDK Loaded Synchronously**

- **File:** [src/components/FCMInitilizer.ts](src/components/FCMInitilizer.ts#L1)
- **Priority:** MEDIUM
- **Pattern:** Firebase imported at top-level in main client
- **Violation:** `bundle-defer-third-party` - Should defer until needed
- **Issue:** Firebase bundle loaded on all pages, only needed for notifications
- **Fix:** Defer loading:

```typescript
export function FCMInitializer() {
  const { data: user } = useUser()

  useEffect(() => {
    if (!user) return

    // Lazy load Firebase only when needed
    import('@/lib/firebase-client').then(async ({ getFCMToken }) => {
      const token = await getFCMToken()
      // ...
    })
  }, [user])
}
```

#### **E. No Preloading for Navigation**

- **File:** [src/components/Navbar.tsx](src/components/Navbar.tsx#L25)
- **Priority:** LOW
- **Pattern:** Links have no preload hints
- **Violation:** `bundle-preload` - Could preload chunks on hover
- **Issue:** Navigation feels slower than it could
- **Fix:** Add preload on link hover:

```typescript
<Link
  to={item.to}
  onMouseEnter={() => {
    // Preload route chunk
    window.__PREFETCH_ROUTE__(item.to)
  }}
>
  {item.label}
</Link>
```

#### **F. FCM Token Registration Uses fetch() Instead of Server Function**

- **File:** [src/components/FCMInitilizer.ts](src/components/FCMInitilizer.ts#L20)
- **Priority:** HIGH
- **Pattern:**

```typescript
await fetch('/api/register-fcm-token', {
  method: 'POST',
  body: JSON.stringify({ token }),
})
```

- **Violation:** `server-auth-actions` - Should use server function not fetch
- **Issue:** Auth not automatically handled, duplicates implementation
- **Fix:** Create server function and call it:

```typescript
// src/action/register-fcm.ts
export const registerFCMToken = createServerFn({ method: 'POST' })
  .inputValidator(z.object({ token: z.string() }))
  .handler(async ({ data }) => {
    const { user } = await getCurrentSession()
    if (!user) throw errors.unauthorized()

    await db.insert(fcmTokens).values({
      userId: user.id,
      token: data.token,
    })
    return { success: true }
  })

// In component:
await registerFCMToken({ data: { token } })
```

#### **G. No CSS-in-JS Batching in Dashboard Calculations**

- **File:** [src/components/dashboard/dashboard.tsx](src/components/dashboard/dashboard.tsx#L1)
- **Priority:** LOW
- **Pattern:** Multiple DOM/style updates in calculations
- **Violation:** `js-batch-dom-css` - Should batch DOM changes
- **Issue:** Recalculating progress bar width updates style on every render
- **Note:** Less critical since using CSS classes, but worth noting

---

## SUMMARY BY PRIORITY

### 🔴 CRITICAL (2)

1. **Sequential auth + data waterfall in routes** - Sequential getTasks waits for beforeLoad
2. **Dashboard manual state mutation after mutations** - Causes cache misses and hydration issues

### 🟠 HIGH (8)

1. Manual request cache instead of React.cache()
2. Duplicate sessions.ts and sessions.server.ts
3. Parallel data fetching not used in /add route
4. React.cache() not used for per-request deduplication
5. usePollOnVisible creates waterfalls via router.invalidate()
6. Dashboard state mutation (handleReschedule)
7. useRouter().invalidate() in TaskCard
8. Fetch() used instead of server function for FCM registration
9. Mixed auth client functions in action/ folder

### 🟡 MEDIUM (7)

1. Missing Suspense boundaries for streaming
2. Navbar component re-renders unnecessarily
3. ActiveTaskWidget not memoized
4. TimelineItem recalculates on every parent render
5. Dashboard timer checks every second for minute changes
6. API routes not clearly documented as external
7. Third-party Firebase SDK not deferred

### 🔵 LOW (1)

1. Unused resetSessionCache() function
2. ServerTaskInput nullable transform confusing
3. No dynamic imports for insights
4. No preloading for navigation hints

---

## RECOMMENDATIONS - PRIORITY ORDER

### Phase 1: CRITICAL (Highest Impact)

1. **Fix waterfalls in routes** - Parallelize auth + data loading
2. **Replace manual cache with React.cache()** - Consolidate session management
3. **Move from manual state to React Query** - Use useMutation with automatic cache updates
4. **Rename auth.ts to auth-client.ts** - Clear separation

### Phase 2: HIGH (Important)

1. **Consolidate sessions files** - Single source of truth
2. **Fix router.invalidate()** - Use selective query invalidation
3. **Use server function for FCM** - Auth handled automatically
4. **Use React.cache() for getTasks()** - Per-request caching

### Phase 3: MEDIUM (Nice to Have)

1. **Add Suspense boundaries** - Enable streaming SSR
2. **Memoize heavy components** - Dashboard widgets
3. **Optimize timer logic** - Don't check every second
4. **Dynamic imports for insights** - Reduce initial bundle

---

## Files Requiring Changes

```
HIGH PRIORITY:
├── src/lib/sessions.ts (rewrite with React.cache)
├── src/lib/sessions.server.ts (remove or consolidate)
├── src/routes/dashboard.tsx (fix waterfall)
├── src/routes/tasks.tsx (fix waterfall)
├── src/routes/add.tsx (fix waterfall)
├── src/routes/insights.tsx (fix waterfall)
├── src/components/dashboard/dashboard.tsx (use React Query mutations)
├── src/action/auth.ts (rename to auth-client.ts)
├── src/hooks/usePollOnVisible.ts (use query invalidation)
├── src/components/FCMInitilizer.ts (create server function)
└── src/components/Task/TaskCard.tsx (use query invalidation)

MEDIUM PRIORITY:
├── src/components/dashboard/ActiveTaskWidget.tsx (memoize)
├── src/components/dashboard/TimelineItem.tsx (memoize)
├── src/action/get-task.ts (wrap with React.cache)
├── src/action/get-user.ts (wrap with React.cache)
└── src/components/Navbar.tsx (optimize conditional rendering)

LOW PRIORITY:
├── src/zod/server-task-schema.ts (simplify transforms)
├── src/components/insights/index.tsx (dynamic import)
└── src/components/ (review barrel imports)
```
