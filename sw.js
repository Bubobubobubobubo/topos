if(!self.define){let s,e={};const l=(l,o)=>(l=new URL(l+".js",o).href,e[l]||new Promise((e=>{if("document"in self){const s=document.createElement("script");s.src=l,s.onload=e,document.head.appendChild(s)}else s=l,importScripts(l),e()})).then((()=>{let s=e[l];if(!s)throw new Error(`Module ${l} didn’t register its module`);return s})));self.define=(o,n)=>{const i=s||("document"in self?document.currentScript.src:"")||location.href;if(e[i])return;let r={};const u=s=>l(s,i),a={module:{uri:i},exports:r,require:u};e[i]=Promise.all(o.map((s=>a[s]||u(s)))).then((s=>(n(...s),r)))}}define(["./workbox-80358384"],(function(s){"use strict";self.skipWaiting(),s.clientsClaim(),s.precacheAndRoute([{url:"assets/apple-touch-icon-77f1cce1.png",revision:null},{url:"assets/ComicMono-742af5ad.woff",revision:null},{url:"assets/ComicMono-bed2c2b5.woff2",revision:null},{url:"assets/ComicMono-Bold-2350c6c1.woff",revision:null},{url:"assets/favicon-695249ea.svg",revision:null},{url:"assets/favicon-8d604eb4.ico",revision:null},{url:"assets/IBMPlexMono-Bold-3152ee89.woff2",revision:null},{url:"assets/IBMPlexMono-Bold-6bb3fd98.woff",revision:null},{url:"assets/IBMPlexMono-BoldItalic-5cd662b9.woff",revision:null},{url:"assets/IBMPlexMono-BoldItalic-6f4d360c.woff2",revision:null},{url:"assets/IBMPlexMono-Italic-30cb963d.woff2",revision:null},{url:"assets/IBMPlexMono-Italic-fc3301da.woff",revision:null},{url:"assets/IBMPlexMono-Regular-06ba2f2e.woff",revision:null},{url:"assets/IBMPlexMono-Regular-82ad22f5.woff2",revision:null},{url:"assets/index-99ae9b1f.js.gz",revision:null},{url:"assets/index-e5dc6b43.css",revision:null},{url:"assets/JetBrainsMono-Bold-c503cc5e.woff2",revision:null},{url:"assets/JetBrainsMono-Regular-a9cb1cd8.woff2",revision:null},{url:"assets/jgs_vecto-e7fb4a88.woff2",revision:null},{url:"assets/jgs5-0e03e537.woff2",revision:null},{url:"assets/jgs5-9f26a38a.woff",revision:null},{url:"assets/jgs7-a69a9a5d.woff2",revision:null},{url:"assets/jgs7-d3f51478.woff",revision:null},{url:"assets/jgs9-0c41ef37.woff",revision:null},{url:"assets/jgs9-dc75d6ab.woff2",revision:null},{url:"assets/many_universes-d74e86dc.svg",revision:null},{url:"assets/pulses-30df7a48.svg",revision:null},{url:"assets/safari-pinned-tab-61a1253d.svg",revision:null},{url:"assets/Steps-Mono-aff9e933.woff2",revision:null},{url:"assets/Steps-Mono-Thin-b82a0d7e.woff2",revision:null},{url:"assets/times-1426387b.svg",revision:null},{url:"assets/topos_arch-db355d32.svg",revision:null},{url:"assets/topos_frog-e8ab87d1.svg",revision:null},{url:"assets/TransportProcessor-d5d50b30.js",revision:null},{url:"assets/TransportProcessor-d5d50b30.js.gz",revision:null},{url:"assets/workbox-window.prod.es5-a7b12eab.js",revision:null},{url:"assets/workbox-window.prod.es5-a7b12eab.js.gz",revision:null},{url:"index.html",revision:"6a01fffc1d9e6ace925d0c7df6cd94f3"},{url:"manifest.webmanifest",revision:"57ee5fb60f9f17e5897fa9d47daea92a"}],{}),s.registerRoute(new s.NavigationRoute(s.createHandlerBoundToURL("index.html"))),s.registerRoute((({url:s})=>[/^https:\/\/raw\.githubusercontent\.com\/.*/i,/^https:\/\/shabda\.ndre\.gr\/.*/i].some((e=>e.test(s)))),new s.CacheFirst({cacheName:"external-samples",plugins:[new s.ExpirationPlugin({maxEntries:5e3,maxAgeSeconds:2592e3}),new s.CacheableResponsePlugin({statuses:[0,200]})]}),"GET")}));
