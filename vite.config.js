import { defineConfig } from 'vite';
// import * as mdPlugin from 'vite-plugin-markdown';

export default defineConfig({
    assetsInclude: ['**/*.md'],
    // plugins: [mdPlugin(options)],
    build: {
        chunkSizeWarningLimit: 1600
    },
	  preview: {
			open: true
		}
});
