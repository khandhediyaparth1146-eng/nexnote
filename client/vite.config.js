import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        chunkSizeWarningLimit: 2000,
        rollupOptions: {
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules')) {
                        if (id.includes('lucide-react')) return 'icons';
                        if (id.includes('framer-motion')) return 'animations';
                        return 'vendor';
                    }
                }
            }
        }
    }
})
