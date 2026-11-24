import {build} from 'esbuild';
await build({entryPoints:['next-chapter/client.jsx'],bundle:true,minify:true,format:'esm',outfile:'public/games/next-chapter/app.js',loader:{'.woff2':'file'},external:['../../fonts/*','*.webp'],define:{'process.env.NODE_ENV':'"production"'},target:['es2022']});
console.log('Built Next Chapter game.');
