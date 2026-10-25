import { defineConfig } from 'vite';

export default defineConfig({
  base: '/',
  plugins: [{
    name: 'github-pages-nojekyll',
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: '.nojekyll', source: '' });
    },
  }],
});
