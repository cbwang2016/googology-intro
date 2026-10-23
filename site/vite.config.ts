import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// GitHub Actions supplies these automatically, including when built from a fork.
const owner = process.env.GITHUB_REPOSITORY_OWNER
const repo = process.env.GITHUB_REPOSITORY?.split('/')[1]
const repositoryUrl = owner && repo
  ? `https://github.com/${owner}/${repo}`
  : 'https://github.com/torvalds/linux'

// base './' keeps the built site portable (GitHub Pages subpath or local preview).
export default defineConfig({
  base: './',
  plugins: [react()],
  define: {
    'import.meta.env.VITE_GITHUB_REPOSITORY_URL': JSON.stringify(repositoryUrl),
  },
})
