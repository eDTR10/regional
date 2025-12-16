import path from "path"
import react from "@vitejs/plugin-react-swc"
import { defineConfig } from "vite"

export default defineConfig({
        // REPO-NAME
  base: "/regional",
  plugins: [react()],
  server: {
    host: '0.0.0.0', // IP address, 0.0.0.0 makes it accessible on your local network
    port: 3001, // specify the port you want here
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize chunk size warnings
    chunkSizeWarningLimit: 1000, // Increase warning limit to 1MB (optional)
    rollupOptions: {
      output: {
        // Manual chunk configuration for better code splitting
        manualChunks: {
          // Vendor chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@react-pdf/renderer'],
          'vendor-utils': ['sweetalert2', 'axios'],
          'vendor-face-api': ['face-api.js'],
          
          // Feature-specific chunks
          'biometric': [
            './src/screens/user/biometric/FaceMain.tsx',
          ],
          'admin-dashboard': [
            './src/screens/admin/dashboard/dashboard-body/DashboardAnalogClock.tsx',
            './src/screens/admin/dashboard/dashboard-body/DashboardBody.tsx',
          ],
          'attendance-reports': [
            './src/screens/admin/attendanceReport/table/ReportTable.tsx',
            './src/screens/user/attendance-record/table/ReportTable.tsx',
          ],
          'activity-reports': [
            './src/screens/user/activity-record/activityReport.tsx',
          ],
        },
      },
    },
  },
})

