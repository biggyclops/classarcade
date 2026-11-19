import{build}from'esbuild';import{mkdir,cp,readFile,writeFile,rm}from'node:fs/promises';
await mkdir('dist/server',{recursive:true});
await mkdir('dist/client',{recursive:true});
// Vite output remains at dist/ for GitHub Pages; the Worker package also carries static assets.
const{readdir}=await import('node:fs/promises');
for(const x of await readdir('dist',{withFileTypes:true})){if(['client','server','.openai'].includes(x.name))continue;await cp('dist/'+x.name,'dist/client/'+x.name,{recursive:true});}
await build({entryPoints:['next-chapter/server/worker.mjs'],bundle:true,format:'esm',outfile:'dist/server/index.js',target:'es2022',platform:'browser'});
await mkdir('dist/.openai/drizzle/meta',{recursive:true});
await cp('drizzle','dist/.openai/drizzle',{recursive:true});
const manifest=JSON.parse(await readFile('.openai/hosting.json','utf8'));await writeFile('dist/.openai/hosting.json',JSON.stringify(manifest));
await writeFile('dist/server/wrangler.json',JSON.stringify({name:'classarcade-next-chapter',main:'index.js',compatibility_date:'2026-01-01',assets:{directory:'../client',binding:'ASSETS',run_worker_first:['/api/*']},d1_databases:[{binding:'DB',database_name:'classarcade',database_id:'00000000-0000-4000-8000-000000000000'}]}));
console.log('Built Next Chapter Worker and static assets.');
