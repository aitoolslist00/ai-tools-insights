import { renderers } from './renderers.mjs';
import { c as createExports, s as serverEntrypointModule } from './chunks/_@astrojs-ssr-adapter_XmJD7udr.mjs';
import { manifest } from './manifest_Bn9MZY4P.mjs';

const serverIslandMap = new Map();;

const _page0 = () => import('./pages/_image.astro.mjs');
const _page1 = () => import('./pages/404.astro.mjs');
const _page2 = () => import('./pages/about.astro.mjs');
const _page3 = () => import('./pages/admin/articles/preview/_id_.astro.mjs');
const _page4 = () => import('./pages/admin/articles/_id_.astro.mjs');
const _page5 = () => import('./pages/admin/articles.astro.mjs');
const _page6 = () => import('./pages/admin/auto-generate.astro.mjs');
const _page7 = () => import('./pages/admin/content-optimizer.astro.mjs');
const _page8 = () => import('./pages/admin/login.astro.mjs');
const _page9 = () => import('./pages/admin/migrate-data.astro.mjs');
const _page10 = () => import('./pages/admin/settings.astro.mjs');
const _page11 = () => import('./pages/admin/tools/new.astro.mjs');
const _page12 = () => import('./pages/admin/tools/preview/_id_.astro.mjs');
const _page13 = () => import('./pages/admin/tools/_id_.astro.mjs');
const _page14 = () => import('./pages/admin/tools.astro.mjs');
const _page15 = () => import('./pages/admin/tools-auto-generate.astro.mjs');
const _page16 = () => import('./pages/admin/tools-optimizer.astro.mjs');
const _page17 = () => import('./pages/admin.astro.mjs');
const _page18 = () => import('./pages/ai-tools/_slug_.astro.mjs');
const _page19 = () => import('./pages/ai-tools.astro.mjs');
const _page20 = () => import('./pages/api/admin/migrate-data.astro.mjs');
const _page21 = () => import('./pages/api/articles/regenerate-all-images.astro.mjs');
const _page22 = () => import('./pages/api/articles/regenerate-images.astro.mjs');
const _page23 = () => import('./pages/api/articles/_id_.astro.mjs');
const _page24 = () => import('./pages/api/auth/login.astro.mjs');
const _page25 = () => import('./pages/api/auth/logout.astro.mjs');
const _page26 = () => import('./pages/api/content/auto-generate.astro.mjs');
const _page27 = () => import('./pages/api/content/optimize.astro.mjs');
const _page28 = () => import('./pages/api/content/publish.astro.mjs');
const _page29 = () => import('./pages/api/settings/check-together-key.astro.mjs');
const _page30 = () => import('./pages/api/settings/save.astro.mjs');
const _page31 = () => import('./pages/api/tools/auto-generate.astro.mjs');
const _page32 = () => import('./pages/api/tools/optimize.astro.mjs');
const _page33 = () => import('./pages/api/tools/_id_.astro.mjs');
const _page34 = () => import('./pages/api/tools.astro.mjs');
const _page35 = () => import('./pages/blog/_slug_.astro.mjs');
const _page36 = () => import('./pages/blog.astro.mjs');
const _page37 = () => import('./pages/compare.astro.mjs');
const _page38 = () => import('./pages/contact.astro.mjs');
const _page39 = () => import('./pages/disclaimer.astro.mjs');
const _page40 = () => import('./pages/privacy.astro.mjs');
const _page41 = () => import('./pages/robots.txt.astro.mjs');
const _page42 = () => import('./pages/sitemap-0.xml.astro.mjs');
const _page43 = () => import('./pages/sitemap-articles.xml.astro.mjs');
const _page44 = () => import('./pages/sitemap-index.xml.astro.mjs');
const _page45 = () => import('./pages/sitemap-tools.xml.astro.mjs');
const _page46 = () => import('./pages/terms.astro.mjs');
const _page47 = () => import('./pages/index.astro.mjs');
const pageMap = new Map([
    ["node_modules/astro/dist/assets/endpoint/generic.js", _page0],
    ["src/pages/404.astro", _page1],
    ["src/pages/about.astro", _page2],
    ["src/pages/admin/articles/preview/[id].astro", _page3],
    ["src/pages/admin/articles/[id].astro", _page4],
    ["src/pages/admin/articles/index.astro", _page5],
    ["src/pages/admin/auto-generate.astro", _page6],
    ["src/pages/admin/content-optimizer.astro", _page7],
    ["src/pages/admin/login.astro", _page8],
    ["src/pages/admin/migrate-data.astro", _page9],
    ["src/pages/admin/settings.astro", _page10],
    ["src/pages/admin/tools/new.astro", _page11],
    ["src/pages/admin/tools/preview/[id].astro", _page12],
    ["src/pages/admin/tools/[id].astro", _page13],
    ["src/pages/admin/tools/index.astro", _page14],
    ["src/pages/admin/tools-auto-generate.astro", _page15],
    ["src/pages/admin/tools-optimizer.astro", _page16],
    ["src/pages/admin/index.astro", _page17],
    ["src/pages/ai-tools/[slug].astro", _page18],
    ["src/pages/ai-tools/index.astro", _page19],
    ["src/pages/api/admin/migrate-data.ts", _page20],
    ["src/pages/api/articles/regenerate-all-images.ts", _page21],
    ["src/pages/api/articles/regenerate-images.ts", _page22],
    ["src/pages/api/articles/[id].ts", _page23],
    ["src/pages/api/auth/login.ts", _page24],
    ["src/pages/api/auth/logout.ts", _page25],
    ["src/pages/api/content/auto-generate.ts", _page26],
    ["src/pages/api/content/optimize.ts", _page27],
    ["src/pages/api/content/publish.ts", _page28],
    ["src/pages/api/settings/check-together-key.ts", _page29],
    ["src/pages/api/settings/save.ts", _page30],
    ["src/pages/api/tools/auto-generate.ts", _page31],
    ["src/pages/api/tools/optimize.ts", _page32],
    ["src/pages/api/tools/[id].ts", _page33],
    ["src/pages/api/tools.ts", _page34],
    ["src/pages/blog/[slug].astro", _page35],
    ["src/pages/blog/index.astro", _page36],
    ["src/pages/compare.astro", _page37],
    ["src/pages/contact.astro", _page38],
    ["src/pages/disclaimer.astro", _page39],
    ["src/pages/privacy.astro", _page40],
    ["src/pages/robots.txt.ts", _page41],
    ["src/pages/sitemap-0.xml.ts", _page42],
    ["src/pages/sitemap-articles.xml.ts", _page43],
    ["src/pages/sitemap-index.xml.ts", _page44],
    ["src/pages/sitemap-tools.xml.ts", _page45],
    ["src/pages/terms.astro", _page46],
    ["src/pages/index.astro", _page47]
]);

const _manifest = Object.assign(manifest, {
    pageMap,
    serverIslandMap,
    renderers,
    actions: () => import('./noop-entrypoint.mjs'),
    middleware: () => import('./_noop-middleware.mjs')
});
const _args = {
    "middlewareSecret": "14b31d4e-64ff-4319-8e1d-2730acdf0ad1",
    "skewProtection": false
};
const _exports = createExports(_manifest, _args);
const __astrojsSsrVirtualEntry = _exports.default;
const _start = 'start';
if (Object.prototype.hasOwnProperty.call(serverEntrypointModule, _start)) ;

export { __astrojsSsrVirtualEntry as default, pageMap };
