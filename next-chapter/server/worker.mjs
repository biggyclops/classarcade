import {api} from './api.mjs';
export default {async fetch(request,env){
 const url=new URL(request.url);
 if(url.pathname.startsWith('/api/next-chapter'))return api(request,env);
 if(env.ASSETS)return env.ASSETS.fetch(request);
 return fetch('https://biggyclops.github.io/classarcade'+url.pathname+url.search,{redirect:'follow'});
}};
