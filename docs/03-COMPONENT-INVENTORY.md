# Component Inventory & Page Structure

Reference guide showing which components are used on each page and overall architecture.

## Table of Contents

1. [Route Structure](#route-structure)
2. [Page Layouts](#page-layouts)
3. [Component Usage Matrix](#component-usage-matrix)
4. [Shared Components](#shared-components)
5. [UI Component Usage](#ui-component-usage)

---

## Route Structure

### Public Routes (No Authentication Required)

#### `/` - Home (Landing Page & Task Form)

- **Component**: `HomePageContent` (wrapper)
  - Shows `LandingPage` for unauthenticated users
  - Shows `TaskFormPage` for authenticated users
- **Loader**: `getTasksForForm()` (only for authenticated)
- **Pending**: `TaskFormSkeleton`

#### `/login` - Login Page

- **Component**: Login form with validation
- **Layout**: Centered card with `AuthNavbar`
- **Features**: Email/password inputs, error alerts, link to register

#### `/register` - Registration Page

- **Component**: Register form with validation
- **Layout**: Centered card with `AuthNavbar`
- **Features**: Name/email/password inputs, error alerts, link to login

---

### Protected Routes (Authentication Required)

#### `/tasks` - Task List

- **Component**: Task listing interface
- **Protection**: `authMiddleware`
- **Loader**: `getTasks()`
- **Pending**: `TasksSkeleton`
- **Features**: Filter by status, search, quick add

#### `/task/:taskId` - Task Detail

- **Component**: Single task detail view
- **Protection**: `authMiddleware`
- **Loader**: `getTaskById()`
- **Pending**: `TaskDetailSkeleton`
- **Features**: Edit task, mark complete, delete, view timeline

#### `/dashboard` - Dashboard

- **Component**: `dashboard.tsx` (main dashboard)
- **Protection**: `authMiddleware`
- **Loader**: Aggregates stats and recent tasks
- **Pending**: `DashboardSkeleton`
- **Sub-components**:
  - `StatCard` - KPI displays
  - `ActiveTaskWidget` - Current task info
  - `NextTaskWidget` - Upcoming task
  - `TimelineItem` - Task timeline
  - `QuickAddModal` - Quick task creation

#### `/insights` - Analytics

- **Component**: `insights/index.tsx`
- **Protection**: `authMiddleware`
- **Loader**: Calculate statistics
- **Pending**: `InsightsSkeleton`
- **Sub-components**:
  - `MetricCard` - Stat display
  - `HourDistributionChart` - Time distribution
  - `WeeklyCompletionChart` - Weekly trends
  - `ConsistencyHeatmap` - Consistency matrix
  - `InsightCallout` - Highlights/insights

#### `/calendar` - Calendar View

- **Component**: `calendar.tsx`
- **Protection**: `authMiddleware`
- **Loader**: Calendar events
- **Pending**: `CalendarSkeleton`
- **Features**: Month view, event details, day selection
- **Library**: `react-big-calendar`

---

## Page Layouts

### Layout Hierarchy

```
<Root>
  ├── ThemeProvider (Dark mode support)
  ├── Navbar (Main navigation)
  │   ├── Logo/Brand
  │   ├── Nav Links (Desktop only)
  │   ├── Theme Toggle
  │   └── User Actions (Logout)
  └── <main>
      └── max-w-6xl mx-auto px-4 py-8
          └── Page Outlet
```

### Layout Types

#### Type 1: Centered Card Layout

**Used in**: `/login`, `/register`

```
┌─────────────────────────────────────┐
│          AuthNavbar                  │
├─────────────────────────────────────┤
│                                      │
│          ┌──────────────────┐       │
│          │   Form Card      │       │
│          │   (max-w-md)     │       │
│          └──────────────────┘       │
│                                      │
└─────────────────────────────────────┘
```

#### Type 2: Full-Width Content Layout

**Used in**: `/tasks`, `/dashboard`, `/insights`, `/calendar`

```
┌─────────────────────────────────────┐
│          Navbar                      │
├────────────────────────────────────┤
│  ┌──────────────────────────────┐  │
│  │   Page Content               │  │
│  │   (max-w-6xl container)      │  │
│  │   - Header                   │  │
│  │   - Sidebar (if present)     │  │
│  │   - Main Content             │  │
│  └──────────────────────────────┘  │
└─────────────────────────────────────┘
```

#### Type 3: Landing Page Layout

**Used in**: `/` (for unauthenticated users)

```
┌─────────────────────────────────────┐
│      Landing Navbar                  │
│   (with signin/signup links)         │
├─────────────────────────────────────┤
│                                      │
│   • Hero Section (gradient)          │
│   • Features Grid (6 cards)          │
│   • How It Works (4 steps)           │
│   • Stats Section (metrics)          │
│   • CTA Section (gradient bg)        │
│   • Footer (multi-column)            │
│                                      │
└─────────────────────────────────────┘
```

---

## Component Usage Matrix

### Core Layout Components

| Component     | Location                         | Uses                 | Frequency | Purpose                       |
| ------------- | -------------------------------- | -------------------- | --------- | ----------------------------- |
| `Navbar`      | `src/components/Navbar.tsx`      | All protected routes | 1         | Main navigation header        |
| `AuthNavbar`  | `src/components/AuthNavbar.tsx`  | /login, /register    | 2         | Auth page navbar (simplified) |
| `LandingPage` | `src/components/LandingPage.tsx` | / (unauthenticated)  | 1         | Landing/marketing page        |
| `ThemeToggle` | `src/components/ThemeToggle.tsx` | Navbar, AuthNavbar   | 2+        | Dark mode switcher            |

### Page-Specific Components

| Component  | Location                                 | Route        | Purpose                |
| ---------- | ---------------------------------------- | ------------ | ---------------------- |
| Dashboard  | `src/components/dashboard/dashboard.tsx` | `/dashboard` | Main dashboard view    |
| TasksList  | `src/routes/tasks.tsx`                   | `/tasks`     | Task list with filters |
| TaskDetail | `src/routes/task.$taskId.tsx`            | `/task/:id`  | Single task view       |
| Insights   | `src/components/insights/index.tsx`      | `/insights`  | Analytics dashboard    |
| Calendar   | `src/routes/calendar.tsx`                | `/calendar`  | Calendar view          |

### Dashboard Sub-Components

| Component          | Location                                        | Purpose               |
| ------------------ | ----------------------------------------------- | --------------------- |
| `StatCard`         | `src/components/dashboard/StatCard.tsx`         | Display KPI with icon |
| `ActiveTaskWidget` | `src/components/dashboard/ActiveTaskWidget.tsx` | Show current task     |
| `NextTaskWidget`   | `src/components/dashboard/NextTaskWidget.tsx`   | Show upcoming task    |
| `TimelineItem`     | `src/components/dashboard/TimelineItem.tsx`     | Timeline entry        |
| `QuickAddModal`    | `src/components/dashboard/QuickAddModal.tsx`    | Quick task creation   |

### Task Components

| Component     | Location                              | Purpose               |
| ------------- | ------------------------------------- | --------------------- |
| `TaskCard`    | `src/components/Task/TaskCard.tsx`    | Displayable task item |
| `TaskSection` | `src/components/Task/TaskSection.tsx` | Group of tasks        |
| `TasksHeader` | `src/components/Task/TasksHeader.tsx` | Tasks page header     |
| `TaskStats`   | `src/components/Task/TaskStats.tsx`   | Task statistics       |
| `EmptyState`  | `src/components/Task/EmptyState.tsx`  | No tasks message      |

### Insights Sub-Components

| Component               | Location                                            | Purpose               |
| ----------------------- | --------------------------------------------------- | --------------------- |
| `MetricCard`            | `src/components/insights/MetricCard.tsx`            | Stat display card     |
| `HourDistributionChart` | `src/components/insights/HourDistributionChart.tsx` | Hourly distribution   |
| `WeeklyCompletionChart` | `src/components/insights/WeeklyCompletionChart.tsx` | Weekly trends         |
| `ConsistencyHeatmap`    | `src/components/insights/ConsistencyHeatmap.tsx`    | Heatmap visualization |
| `InsightCallout`        | `src/components/insights/InsightCallout.tsx`        | Highlighted insight   |
| `SectionHeader`         | `src/components/insights/SectionHeader.tsx`         | Section title         |

### Skeleton/Loading Components

| Component            | Location                                          | Page         | Purpose                     |
| -------------------- | ------------------------------------------------- | ------------ | --------------------------- |
| `TaskFormSkeleton`   | `src/components/Skeletons/TaskFormSkeleton.tsx`   | `/`          | Loading state for form      |
| `TasksSkeleton`      | `src/components/Skeletons/TasksSkeleton.tsx`      | `/tasks`     | Loading state for list      |
| `TaskDetailSkeleton` | `src/components/Skeletons/TaskDetailSkeleton.tsx` | `/task/:id`  | Loading state for detail    |
| `DashboardSkeleton`  | `src/components/Skeletons/DashboardSkeleton.tsx`  | `/dashboard` | Loading state for dashboard |
| `InsightsSkeleton`   | `src/components/Skeletons/InsightsSkeleton.tsx`   | `/insights`  | Loading state for insights  |
| `CalendarSkeleton`   | `src/components/Skeletons/CalendarSkeleton.tsx`   | `/calendar`  | Loading state for calendar  |

### UI Components (shadcn/ui)

| Component             | Status        | Uses | Purpose               |
| --------------------- | ------------- | ---- | --------------------- |
| `Button`              | ✅ Active     | 15+  | Primary action button |
| `Input`               | ✅ Active     | 10+  | Text input fields     |
| `Label`               | ✅ Active     | 8+   | Form labels           |
| `Card`, `CardContent` | ✅ Active     | 20+  | Container/card layout |
| `Tabs`                | ✅ Active     | 2    | Tab interface         |
| `Textarea`            | ✅ Active     | 2    | Multiline text input  |
| `Switch`              | ✅ Active     | 1+   | Toggle controls       |
| `Alert`               | ✅ Active     | 2+   | Alert messages        |
| `Skeleton`            | ✅ Active     | 6    | Loading placeholders  |
| `Dialog`              | ✅ Active     | 2+   | Modal dialogs         |
| `Dropdown-menu`       | ✅ Active     | 1+   | Dropdown menus        |
| `Chart`               | ✅ Active     | 2+   | Chart containers      |
| `Badge`               | ❌ **Unused** | 0    | _Legacy_              |
| `Checkbox`            | ❌ **Unused** | 0    | _Legacy_              |

---

## Shared Components

### Global Boundary Components

| Component             | Location                                 | Purpose                |
| --------------------- | ---------------------------------------- | ---------------------- |
| `GlobalErrorBoundary` | `src/components/GlobalErrorBoundary.tsx` | Error boundary wrapper |
| `GlobalNotFound`      | `src/components/GlobalNotFound.tsx`      | 404 page               |

### Utility Components

| Component       | Location                          | Purpose                  |
| --------------- | --------------------------------- | ------------------------ |
| `LogoutButton`  | `src/components/LogoutButton.tsx` | User logout action       |
| `FCMInitilizer` | `src/components/FCMInitilizer.ts` | Firebase messaging setup |

---

## UI Component Usage

### Most Used Components (in order)

1. **Button** - CTAs, form submission, navigation
2. **Card** - Content containers throughout app
3. **Input** - Form fields, search, filters
4. **Label** - Form labels
5. **Skeleton** - Loading states
6. **Tabs** - Form sections, page navigation
7. **Alert** - Error and status messages
8. **Dialog** - Modals for quick actions
9. **Textarea** - Long form text input
10. **Switch** - Toggle options

### Rarely Used Components

- **Dropdown-menu** - Profile/action menus (1 usage)
- **Checkbox** - _Not actually used_ (0 active usages)
- **Badge** - _Not used_ (0 active usages)

---

## Database Layers

### Action Files (Server Functions)

Located in `src/action/`:

- `auth.ts` - Authentication actions
- `get-user.ts` - Fetch user data
- `get-task.ts` - Fetch tasks (list)
- `get-task-by-id.ts` - Fetch single task
- `get-tasks-for-form.ts` - Fetch tasks for form
- `create-update-task.ts` - Create/update task
- `delete-task.ts` - Delete task
- `complete-task.ts` - Mark task complete

### Hooks (Client State)

Located in `src/hooks/`:

- `useUser.tsx` - Get current user
- `useTasksByStatus.ts` - Tasks filtered by status
- `usePollOnVisible.ts` - Poll data when visible

---

## Architecture Notes

### Route Protection Flow

```
Request to protected route
    ↓
authMiddleware checks getCurrentSession()
    ↓
    ├─ If user: Continue
    │   ↓
    │   Render page with skeleton
    │   Load async data
    │   Replace skeleton with content
    │
    └─ If no user: Redirect to /login
```

### Data Flow

```
UI Component
    ↓
useQuery() / Server Action
    ↓
Action file (src/action/)
    ↓
Database layer (Drizzle ORM)
    ↓
PostgreSQL
```

### Theme System

```
ThemeProvider (next-themes)
    ↓ (system preference / user selection)
    ↓
Theme toggle in Navbar
    ↓
CSS variables updated
    ↓
All components inherit dark mode automatically
```
