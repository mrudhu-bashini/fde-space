import { defineConfig } from 'tsup';

export default defineConfig({
    entry: ['src/index.ts'],
    format: ['cjs', 'esm'],
    dts: true,
    splitting: false,
    sourcemap: true,
    clean: true,
    external: [
        'react',
        'react-dom',
        'firebase',
        'zustand',
        'react-router-dom',
        'lucide-react',
        'recharts',
        'react-hot-toast'
    ],
    treeshake: true,
});
