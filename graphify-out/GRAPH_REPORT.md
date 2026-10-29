# Graph Report - admin  (2026-10-29)

## Corpus Check
- 41 files · ~15,362 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 303 nodes · 880 edges · 14 communities (13 shown, 1 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `21caf8af`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_App.tsx|App.tsx]]
- [[_COMMUNITY_compilerOptions|compilerOptions]]
- [[_COMMUNITY_components.json|components.json]]
- [[_COMMUNITY_package.json|package.json]]
- [[_COMMUNITY_devDependencies|devDependencies]]
- [[_COMMUNITY_dependencies|dependencies]]
- [[_COMMUNITY_ShopEdit.tsx|ShopEdit.tsx]]
- [[_COMMUNITY_admin|admin/]]
- [[_COMMUNITY_api.ts|api.ts]]
- [[_COMMUNITY_utils.ts|utils.ts]]
- [[_COMMUNITY_Jobs.tsx|Jobs.tsx]]
- [[_COMMUNITY_labels.ts|labels.ts]]
- [[_COMMUNITY_badge.tsx|badge.tsx]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 93 edges
2. `get()` - 21 edges
3. `useToast()` - 18 edges
4. `useAsync()` - 17 edges
5. `Button()` - 16 edges
6. `num()` - 15 edges
7. `fmtDateTime()` - 14 edges
8. `compilerOptions` - 13 edges
9. `errorMessage()` - 12 edges
10. `fmtAgo()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `Ltr()` --calls--> `cn()`  [EXTRACTED]
  admin/src/components/common.tsx → admin/src/lib/utils.ts
- `NavList()` --calls--> `cn()`  [EXTRACTED]
  admin/src/components/layout/AppLayout.tsx → admin/src/lib/utils.ts
- `RenameDialog()` --calls--> `useToast()`  [EXTRACTED]
  admin/src/pages/Categories.tsx → admin/src/components/toast.tsx
- `DialogOverlay()` --calls--> `cn()`  [EXTRACTED]
  admin/src/components/ui/dialog.tsx → admin/src/lib/utils.ts
- `SelectLabel()` --calls--> `cn()`  [EXTRACTED]
  admin/src/components/ui/select.tsx → admin/src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (14 total, 1 thin omitted)

### Community 0 - "App.tsx"
Cohesion: 0.19
Nodes (26): App(), Pagination(), Toast, ToastApi, ToastContext, ToastProvider(), useToast(), get() (+18 more)

### Community 1 - "compilerOptions"
Cohesion: 0.12
Nodes (15): compilerOptions, baseUrl, isolatedModules, jsx, lib, module, moduleResolution, noEmit (+7 more)

### Community 2 - "components.json"
Cohesion: 0.11
Nodes (17): aliases, components, hooks, lib, ui, utils, iconLibrary, rsc (+9 more)

### Community 3 - "package.json"
Cohesion: 0.07
Nodes (28): dependencies, class-variance-authority, clsx, @fontsource-variable/vazirmatn, lucide-react, radix-ui, react, react-dom (+20 more)

### Community 4 - "devDependencies"
Cohesion: 0.07
Nodes (37): ConfirmDialog(), TagInput(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter() (+29 more)

### Community 5 - "dependencies"
Cohesion: 0.14
Nodes (15): Contact, Direction, DIRECTIONS, OUTCOMES, Review, REVIEW_STATUSES, REVIEWER_PERMISSIONS, ReviewerSource (+7 more)

### Community 6 - "ShopEdit.tsx"
Cohesion: 0.12
Nodes (23): Alert(), EmptyState(), ErrorState(), Field(), Handle(), LoadingRows(), Ltr(), PageHeader() (+15 more)

### Community 7 - "admin/"
Cohesion: 0.40
Nodes (4): admin/, Commands, graphify, Rules

### Community 8 - "api.ts"
Cohesion: 0.09
Nodes (26): AccountBox(), AppLayout(), NAV, NavList(), api(), ApiError, del(), patch() (+18 more)

### Community 9 - "utils.ts"
Cohesion: 0.14
Nodes (20): normalizeHandle(), Dialog(), DialogContent(), DialogDescription(), DialogFooter(), DialogHeader(), DialogOverlay(), DialogTitle() (+12 more)

### Community 11 - "Jobs.tsx"
Cohesion: 0.13
Nodes (15): Select(), SelectContent(), SelectItem(), SelectLabel(), SelectScrollDownButton(), SelectScrollUpButton(), SelectSeparator(), SelectTrigger() (+7 more)

### Community 12 - "labels.ts"
Cohesion: 0.14
Nodes (13): dateOnly, dateTime, DIRECTION_LABELS, DIRECTION_TONE, ERROR_LABELS, faNumber, fmtDate(), OUTCOME_LABELS (+5 more)

## Knowledge Gaps
- **77 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+72 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **1 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `devDependencies` to `App.tsx`, `dependencies`, `ShopEdit.tsx`, `api.ts`, `utils.ts`, `Jobs.tsx`, `badge.tsx`?**
  _High betweenness centrality (0.197) - this node is a cross-community bridge._
- **Why does `get()` connect `App.tsx` to `dependencies`, `ShopEdit.tsx`, `api.ts`, `utils.ts`, `Jobs.tsx`?**
  _High betweenness centrality (0.012) - this node is a cross-community bridge._
- **Why does `Button()` connect `devDependencies` to `App.tsx`, `dependencies`, `ShopEdit.tsx`, `api.ts`, `utils.ts`, `Jobs.tsx`?**
  _High betweenness centrality (0.010) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _77 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Should `components.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.06896551724137931 - nodes in this community are weakly interconnected._