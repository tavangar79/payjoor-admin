# Graph Report - admin  (2026-10-30)

## Corpus Check
- 42 files · ~18,633 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 320 nodes · 982 edges · 11 communities
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `d14cca2e`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_App.tsx|App.tsx]]
- [[_COMMUNITY_compilerOptions|compilerOptions]]
- [[_COMMUNITY_components.json|components.json]]
- [[_COMMUNITY_package.json|package.json]]
- [[_COMMUNITY_devDependencies|devDependencies]]
- [[_COMMUNITY_dependencies|dependencies]]
- [[_COMMUNITY_admin|admin/]]
- [[_COMMUNITY_api.ts|api.ts]]
- [[_COMMUNITY_utils.ts|utils.ts]]
- [[_COMMUNITY_Jobs.tsx|Jobs.tsx]]

## God Nodes (most connected - your core abstractions)
1. `cn()` - 96 edges
2. `get()` - 24 edges
3. `useToast()` - 20 edges
4. `useAsync()` - 20 edges
5. `num()` - 19 edges
6. `Button()` - 17 edges
7. `fmtDateTime()` - 16 edges
8. `fmtAgo()` - 14 edges
9. `qs()` - 13 edges
10. `errorMessage()` - 13 edges

## Surprising Connections (you probably didn't know these)
- `NavList()` --calls--> `cn()`  [EXTRACTED]
  admin/src/components/layout/AppLayout.tsx → admin/src/lib/utils.ts
- `SelectLabel()` --calls--> `cn()`  [EXTRACTED]
  admin/src/components/ui/select.tsx → admin/src/lib/utils.ts
- `SelectSeparator()` --calls--> `cn()`  [EXTRACTED]
  admin/src/components/ui/select.tsx → admin/src/lib/utils.ts
- `SelectScrollUpButton()` --calls--> `cn()`  [EXTRACTED]
  admin/src/components/ui/select.tsx → admin/src/lib/utils.ts
- `SelectScrollDownButton()` --calls--> `cn()`  [EXTRACTED]
  admin/src/components/ui/select.tsx → admin/src/lib/utils.ts

## Import Cycles
- None detected.

## Communities (11 total, 0 thin omitted)

### Community 0 - "App.tsx"
Cohesion: 0.14
Nodes (33): App(), Ltr(), useToast(), get(), qs(), fmtAgo(), fmtDate(), fmtDateTime() (+25 more)

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
Nodes (39): Alert(), ConfirmDialog(), AlertDialog(), AlertDialogAction(), AlertDialogCancel(), AlertDialogContent(), AlertDialogDescription(), AlertDialogFooter() (+31 more)

### Community 5 - "dependencies"
Cohesion: 0.06
Nodes (43): Segmented(), COUNT_LABELS, dateOnly, dateTime, DIRECTION_LABELS, DIRECTION_TONE, ERROR_LABELS, faNumber (+35 more)

### Community 7 - "admin/"
Cohesion: 0.40
Nodes (4): admin/, Commands, graphify, Rules

### Community 8 - "api.ts"
Cohesion: 0.10
Nodes (23): AccountBox(), AppLayout(), NAV, NavList(), Toast, ToastApi, ToastContext, ToastProvider() (+15 more)

### Community 9 - "utils.ts"
Cohesion: 0.17
Nodes (27): EmptyState(), ErrorState(), Field(), Handle(), LoadingRows(), PageHeader(), Pagination(), Panel() (+19 more)

### Community 11 - "Jobs.tsx"
Cohesion: 0.09
Nodes (27): normalizeHandle(), TagInput(), Badge(), badgeVariants, Select(), SelectContent(), SelectItem(), SelectLabel() (+19 more)

## Knowledge Gaps
- **84 isolated node(s):** `$schema`, `style`, `rsc`, `tsx`, `config` (+79 more)
  These have ≤1 connection - possible missing edges or undocumented components.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `cn()` connect `devDependencies` to `App.tsx`, `dependencies`, `api.ts`, `utils.ts`, `Jobs.tsx`?**
  _High betweenness centrality (0.188) - this node is a cross-community bridge._
- **Why does `get()` connect `App.tsx` to `api.ts`, `utils.ts`, `Jobs.tsx`, `dependencies`?**
  _High betweenness centrality (0.011) - this node is a cross-community bridge._
- **Why does `useToast()` connect `App.tsx` to `api.ts`, `utils.ts`, `Jobs.tsx`, `dependencies`?**
  _High betweenness centrality (0.009) - this node is a cross-community bridge._
- **What connects `$schema`, `style`, `rsc` to the rest of the system?**
  _84 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `App.tsx` be split into smaller, more focused modules?**
  _Cohesion score 0.13813813813813813 - nodes in this community are weakly interconnected._
- **Should `compilerOptions` be split into smaller, more focused modules?**
  _Cohesion score 0.125 - nodes in this community are weakly interconnected._
- **Should `components.json` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._