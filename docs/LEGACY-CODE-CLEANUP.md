# Legacy Code Cleanup - Task & Inventory

Complete inventory of deprecated, unused, and unnecessary code in the project. Organized by priority.

---

## 🔴 PRIORITY 1: Remove Immediately

These items are technical debt that should be removed as they:

- Clutter the codebase
- Consume resources unnecessarily
- May cause confusion for new team members
- Have no active use

### 1.1 Delete Entire `/src/routes/demo/` Directory

**Location**: `src/routes/demo/`

**Files to delete**:

- `api.tq-todos.ts` - TanStack Query demo API with mock todo data
- `drizzle.txt` - Demo Drizzle ORM route examples
- `route.txt` - Demo main route layout (contains broken reference to missing `DemoHeader`)
- `tanstack-query.txt` - TanStack Query demo component

**Why**:

- Demo code, not part of production
- Already gitignored in `.gitignore`
- Contains broken import (`DemoHeader` component doesn't exist)
- Serves no purpose for development

**Action**:

```bash
rm -rf src/routes/demo/
```

---

### 1.2 Remove Commented-Out useEffect (Auto-scroll)

**Location**: `src/routes/index.tsx`, lines 218-220

**Code to delete**:

```typescript
// useEffect(() => {
//   window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' })
// }, [])
```

**Why**:

- Commented-out code that's been obsolete
- Clutters readable component code
- Version control preserves history if needed

**Action**: Delete these 3 lines from the file

---

### 1.3 Remove Console.log Debug Statements

**Location**: `src/routes/api/sync-task-status.ts`

**Statements to remove**:

```typescript
console.log('Success:', response.successCount)
console.log('Failure:', response.failureCount)
```

**Why**:

- Debug logging not appropriate for production
- Should use proper logging framework instead
- Exposes internal logic in browser console

**Action**:

- Replace with proper logging (e.g., `logger.info()`)
- Or remove entirely if not needed for monitoring

---

## 🟠 PRIORITY 2: Clean Up

These items should be removed to reduce bundle size and maintenance overhead.

### 2.1 Delete Unused UI Components

**Components**:

#### Badge Component

- **Location**: `src/components/ui/badge.tsx`
- **Imports**: 0 (unused across entire project)
- **Why**: Exported from shadcn/ui but never used
- **Action**: Delete the file

#### Checkbox Component

- **Location**: `src/components/ui/checkbox.tsx`
- **Imports**: 0 (referenced in code comment only, never actually used)
- **Why**: Placeholder component that was planned but not implemented
- **Note**: Referenced in `TaskDetailSkeleton.tsx` as a TODO comment
- **Action**: Delete the file, remove comment reference

---

### 2.2 Review Minimally Used Components

These components are used only 1-2 times. Consider consolidation:

| Component     | Uses | Location                   | Recommendation            |
| ------------- | ---- | -------------------------- | ------------------------- |
| Dropdown-menu | 1    | Likely profile menu        | ✅ Keep (needed for UI)   |
| Tabs          | 2    | index.tsx, calendar.tsx    | ✅ Keep (common pattern)  |
| Textarea      | 2    | Form components            | ✅ Keep (form input)      |
| Dialog        | 2    | Calendar, Dashboard modals | ✅ Keep (modal pattern)   |
| Alert         | 2    | Error contexts             | ✅ Keep (status messages) |

**Action**: No changes needed - these are all essential

---

### 2.3 Verify Build Configuration Files

#### `.cta.json` (Root)

- **Purpose**: Project initialization config from "create tanstack app"
- **Status**: Build artifact/generator config
- **Action**: Check if still needed by build pipeline
- **Recommendation**: Likely safe to delete if build works without it

#### `.prettierignore`

- **Purpose**: Prettier formatter ignore rules
- **Status**: Check if file exists and has content
- **Action**: Review against `.gitignore` - may be redundant

---

## 🟡 PRIORITY 3: Optional Improvements

These are optional optimizations for later phases.

### 3.1 Move Design Analysis Markdown Files (ALREADY DONE ✅)

**Status**: COMPLETED ✅

All design documentation has been moved to `/docs/`:

- `docs/INDEX.md` - Navigation hub
- `docs/01-DESIGN-SYSTEM.md` - Design system details
- `docs/02-DESIGN-PATTERNS-REFERENCE.md` - Component patterns
- `docs/03-COMPONENT-INVENTORY.md` - Component usage map
- `docs/04-DEVELOPMENT-GUIDE.md` - Development guidelines

Original files at root are no longer needed and can be reviewed for removal once team confirms organization is working.

---

### 3.2 Implement Proper Logging Framework

Currently using `console.log()` in API routes (removed in Priority 1).

**Recommendation**: Implement before production

- Consider: `pino`, `winston`, or `bunyan`
- Configure log levels (debug, info, warn, error)
- Add request/response logging middleware

---

### 3.3 Code Quality Improvements

#### Remove Unused Imports

Some files may have imports that are no longer used. Run:

```bash
npx eslint --fix src/
```

#### Add Missing Error Handling

Review API routes for unhandled promise rejections

#### Consolidate Utility Functions

Some utility functions are repeated across files (e.g., time formatting)

---

### 3.4 Verify Public Assets Necessity

| File                       | Purpose                | Status    | Action                     |
| -------------------------- | ---------------------- | --------- | -------------------------- |
| `robots.txt`               | SEO crawler directives | Check     | Verify needed for crawlers |
| `manifest.json`            | PWA manifest           | ✅ Needed | Keep (PWA support)         |
| `firebase-messaging-sw.js` | FCM Service Worker     | ✅ Needed | Keep (notifications)       |

---

## 📊 Cleanup Summary

### Files to Delete

```
src/routes/demo/                    (entire folder, 4 files)
src/components/ui/badge.tsx         (unused component)
src/components/ui/checkbox.tsx      (unused component)
```

### Lines to Remove

```
src/routes/index.tsx (lines 218-220) - commented useEffect
src/routes/api/sync-task-status.ts - 2 console.log statements
```

### Files to Review

```
.cta.json                           (verify if still needed)
.prettierignore                     (check for redundancy)
robots.txt                          (verify necessity)
```

### Already Completed

```
✅ Design documentation moved to /docs/
✅ Landing page integrated
✅ Route protection implemented
✅ Skeleton loaders added
```

---

## 🚀 Cleanup Checklist

- [ ] Delete `/src/routes/demo/` directory
- [ ] Remove commented useEffect from `index.tsx`
- [ ] Remove console.log statements from sync-task-status.ts
- [ ] Delete `badge.tsx` UI component
- [ ] Delete `checkbox.tsx` UI component
- [ ] Review `.cta.json` - delete if unneeded
- [ ] Review `.prettierignore` - delete if redundant
- [ ] Run `npx eslint --fix src/` to clean up imports
- [ ] Verify `robots.txt` necessity
- [ ] Test build after deletions
- [ ] Commit changes with message "chore: remove legacy code and unused components"

---

## 📝 Version Control Notes

After cleanup, the commit history will still contain all deleted code for reference. These deletions only affect the current codebase.

---

## 🔄 Next Phase

After cleanup is complete:

1. Review bundle size reduction
2. Verify no regressions in tests
3. Update team documentation
4. Consider archiving any design analysis documents in project wiki
