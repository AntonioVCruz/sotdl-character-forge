import type {Plugin} from 'vite';
import {buildOfficialLocalContext} from './curation/official-local-context';
import {buildProcedureLocalContext} from './curation/procedure-local-context';

export function isLocalOfficialRequest(address:string,host:string,origin?:string,fetchSite?:string) {
  return ['127.0.0.1','::1','::ffff:127.0.0.1'].includes(address)&&/^(localhost|127\.0\.0\.1|\[::1\])(?::\d+)?$/.test(host)
    &&fetchSite!=='cross-site'&&(!origin||origin===`http://${host}`||origin===`https://${host}`);
}

export function officialLocalPlugin(root=process.cwd()):Plugin {
  let building:ReturnType<typeof buildOfficialLocalContext>|undefined;
  let procedureBuilding:ReturnType<typeof buildProcedureLocalContext>|undefined;
  return {name:'official-core-local-only',configureServer(server){
    server.middlewares.use('/api/official/procedures',async(req,res)=>{
      if(!isLocalOfficialRequest(req.socket.remoteAddress??'',req.headers.host??'',req.headers.origin,req.headers['sec-fetch-site'] as string|undefined)){res.statusCode=403;res.end('Local access required.');return;}
      if(req.method!=='GET'||req.url&&req.url!=='/'&&!req.url.startsWith('/?')){res.statusCode=404;res.end();return;}
      res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
      try{procedureBuilding??=buildProcedureLocalContext(root);res.end(JSON.stringify(await procedureBuilding));}
      catch{res.statusCode=503;res.end(JSON.stringify({error:'Procedimentos indisponíveis: fontes ou política local fora da revisão verificada.'}));}
      finally{procedureBuilding=undefined;}
    });
    server.middlewares.use('/api/official/core',async(req,res)=>{
      const address=req.socket.remoteAddress??'',host=req.headers.host??'';
      const origin=req.headers.origin;
      if(!isLocalOfficialRequest(address,host,origin,req.headers['sec-fetch-site'] as string|undefined)){res.statusCode=403;res.end('Local access required.');return;}
      if(req.method!=='GET'||req.url&&req.url!=='/'&&!req.url.startsWith('/?')){res.statusCode=404;res.end();return;}
      res.setHeader('Content-Type','application/json; charset=utf-8');res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
      try {
        building??=buildOfficialLocalContext(root);
        const context=await building;res.end(JSON.stringify(context));
      }catch{res.statusCode=503;res.end(JSON.stringify({error:'Fontes reais indisponíveis ou fora da revisão verificada. Execute os checks locais de curadoria.'}));}
      finally{building=undefined;}
    });
  }};
}
