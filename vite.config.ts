import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * Vite Configuration
 * https://vitejs.dev/config/
 *
 * Vite is a modern build tool that provides:
 * - Lightning-fast Hot Module Replacement (HMR)
 * - Optimized production builds with Rollup
 * - Native ES Module support
 */
export default defineConfig({
    plugins: [
        // React plugin enables:
        // - Fast Refresh (HMR for React components)
        // - JSX transformation
        react(),
    ],

    // Development server configuration
    server: {
        port: 5173,
        // Proxy API requests to your NestJS backend
        // This avoids CORS issues during development
        proxy: {
            '/graphql': {
                target: 'https://localhost:3000',
                changeOrigin: true,
                secure: false, // Accept self-signed certificates
            },
        },
    },

    // Preview server (for testing production build locally)
    preview: {
        port: 4173,
    },

    // Build configuration
    build: {
        // Output directory for production build
        outDir: 'dist',
        // Generate source maps for debugging
        sourcemap: true,
    },
});
