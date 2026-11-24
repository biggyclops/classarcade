import {build} from 'esbuild';
import {createHash} from 'node:crypto';
import {readFile, writeFile} from 'node:fs/promises';
await build({entryPoints:['next-chapter/client.jsx'],bundle:true,minify:true,format:'esm',outfile:'public/games/next-chapter/app.js',loader:{'.woff2':'file'},external:['../../fonts/*','*.webp'],define:{'process.env.NODE_ENV':'"production"'},target:['es2022']});
const gameDir = 'public/games/next-chapter/';
const indexPath = gameDir+'index.html';
let index = await readFile(indexPath,'utf8');
for (const name of ['app.css','app.js']) {
  const revision = createHash('sha256').update(await readFile(gameDir+name)).digest('hex').slice(0,12);
  index = index.replace(new RegExp('\\./'+name.replace('.','\\.')+'(?:\\?v=[a-f0-9]+)?(?=")'), './'+name+'?v='+revision);
}
await writeFile(indexPath,index);
console.log('Built Next Chapter game.');
