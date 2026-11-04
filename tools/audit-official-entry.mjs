import {readFile,readdir} from 'node:fs/promises';
import {resolve} from 'node:path';
const root=process.cwd(),forbidden=['fixture-preview','Carregar exemplos fictícios','Abrir prévia local Human L0 (fixture)'];
for(const path of ['examples/demo-pack.json','examples/demo-random-tables.json','examples/demo-level-zero.json','examples/demo-level-one.json','examples/demo-magic.json','examples/demo-spell-session.json']) {
  const value=JSON.parse(await readFile(resolve(root,path),'utf8'));if(value.packId)forbidden.push(value.packId);
}
const fixture=JSON.parse(await readFile(resolve(root,'curation/examples/human-l0-mechanics.synthetic.json'),'utf8'));
for(const pack of fixture.packs)forbidden.push(pack.packId);
let checked=0;
async function visit(dir) {
  for(const entry of await readdir(dir,{withFileTypes:true})) {
    const path=resolve(dir,entry.name);if(entry.isDirectory())await visit(path);
    else if(/\.(js|json|html)$/.test(entry.name)) {const code=await readFile(path,'utf8');if(forbidden.some(text=>code.includes(text)))throw new Error('Official build contains legacy demonstration data; publication blocked.');checked++;}
  }
}
await visit(resolve(root,'dist'));if(!checked)throw new Error('Official build missing.');
console.log(`Official entry audit: ${checked} client artifact(s), no demo/fixture data.`);
