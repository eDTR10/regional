# Build Optimization Guide

## Problem
Large chunks (>500 KB) after minification causing slow initial page load.

## Solutions Implemented

### 1. Manual Chunk Configuration (✅ Already Done)
Updated `vite.config.ts` with `manualChunks` to split code into logical groups:
- **vendor-react**: React core libraries
- **vendor-ui**: PDF rendering library
- **vendor-utils**: Utilities and alerts
- **vendor-face-api**: Face recognition library
- **biometric**: Biometric features
- **admin-dashboard**: Admin dashboard
- **attendance-reports**: Attendance reporting
- **activity-reports**: Activity reporting

### 2. Dynamic Imports (Recommended for Routes)
Use React lazy loading for route-based code splitting:

```tsx
// Instead of:
import FaceRecMain from './screens/user/biometric/FaceMain';

// Use:
const FaceRecMain = lazy(() => import('./screens/user/biometric/FaceMain'));
```

Add Suspense wrapper:
```tsx
<Suspense fallback={<div>Loading...</div>}>
  <FaceRecMain userObject={userObject} />
</Suspense>
```

### 3. Component-Level Code Splitting
For large components, use dynamic imports:

```tsx
const ActivityReport = lazy(() => import('./screens/user/activity-record/activityReport'));
const PrintButton = lazy(() => import('./components/printDTR/PrintDTR'));
```

## How to Run Optimized Build

```bash
# Build with optimization
npm run build

# Or deploy (includes build)
npm run deploy
```

## Expected Results
- Smaller initial bundle size
- Faster initial page load
- Chunks load on-demand as users navigate
- Better caching of unchanged chunks

## Testing Build Size
```bash
# After npm run build, check dist folder:
# dist/assets/ will contain separate .js files for each chunk
```

## Additional Optimization Tips

1. **Lazy load heavy libraries**:
   ```tsx
   const PDFViewer = lazy(() => import('@react-pdf/renderer'));
   ```

2. **Use React DevTools Profiler** to identify slow components

3. **Monitor chunk sizes**:
   ```bash
   npm install -g vite-plugin-compression
   ```

4. **Consider removing unused dependencies** in package.json

## Chunk Size Targets
- Entry chunk: < 500 KB
- Individual chunks: < 250 KB
- Vendor chunks: < 500 KB

## References
- [Vite Code Splitting](https://vitejs.dev/guide/features.html#code-splitting)
- [Rollup Manual Chunks](https://rollupjs.org/configuration-options/#output-manualchunks)
- [React Lazy Loading](https://react.dev/reference/react/lazy)
