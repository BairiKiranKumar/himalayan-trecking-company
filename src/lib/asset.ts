/** Public files resolved against Vite's base, so the site works at "/" locally and under "/<repo>/" on GitHub Pages. */
export const asset = (path: string) => import.meta.env.BASE_URL + path;
