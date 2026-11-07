import {useEffect,useRef,useState} from 'react';
import {ProcedureContextSchema,ProcedureSessionSchema,defaultProcedureConfig,type ProcedureContext,type ProcedureConfig,type ProcedureSession,type ProcedureNode} from '../../packages/character-generator/procedure-model';
import {createProcedureSession,reopenProcedure,performProcedureCommand,advanceProcedure,calculateProcedure,finalizeProcedure,type ProcedureCommand} from '../../packages/character-generator/procedure-runtime';
import {CharacterCompletionPanel} from './CharacterCompletionPanel';
import {CharacterExportPanel} from './CharacterExportPanel';
import {useCharacterWorkspace} from './useCharacterWorkspace';
import {CharacterWorkspacePanel} from './CharacterWorkspacePanel';

const STORAGE='sotdl-human-creation-session@1';
type View=Awaited<ReturnType<typeof calculateProcedure>>;
export function CreationProcedures({onDirtyChange}:{onDirtyChange?:(dirty:boolean)=>void}={}){
  const [context,setContext]=useState<ProcedureContext>(),[config,setConfig]=useState(defaultProcedureConfig),[session,setSession]=useState<ProcedureSession>(),[view,setView]=useState<View>();
  const [seed,setSeed]=useState(''),[error,setError]=useState(''),[busy,setBusy]=useState(false),lock=useRef(false);
  const [suspended,setSuspended]=useState(false);
  const workspace=useCharacterWorkspace('procedures'),[dirty,setDirty]=useState(false);
  useEffect(()=>{onDirtyChange?.(dirty);return()=>onDirtyChange?.(false);},[dirty,onDirtyChange]);
  useEffect(()=>{let live=true;void(async()=>{let existingSave:string|null=null;try{
    existingSave=localStorage.getItem(STORAGE);
    const response=await fetch('/api/official/procedures',{cache:'no-store'});
    if(!response.ok)throw new Error('Procedimentos indisponíveis. Confira as fontes reais locais.');
    const c=ProcedureContextSchema.parse(await response.json());if(!live)return;setContext(c);
    const saved=await workspace.load(STORAGE,async input=>(await reopenProcedure(c,input)).session,input=>ProcedureSessionSchema.parse(input));if(saved){const restored=await reopenProcedure(c,saved),v=await calculateProcedure(c,restored.session);if(live){setSession(restored.session);setConfig(restored.graph.state.config);setSeed(restored.session.seed);setView(v);}}
  }catch(e){if(live){setError(e instanceof Error?e.message:String(e));setSuspended(!!existingSave);}}})();return()=>{live=false;};},[]);
  async function change(action:()=>Promise<ProcedureSession>|ProcedureSession,newCharacter=false){
    if(!context||lock.current)return;lock.current=true;setBusy(true);setError('');
    try{const next=await action(),v=await calculateProcedure(context,next);if(newCharacter)workspace.stageNew();setSession(next);setView(v);setConfig(v.graph.state.config);setDirty(true);setSuspended(false);}
    catch(e){setError(e instanceof Error?e.message:String(e));}finally{lock.current=false;setBusy(false);}
  }
  async function restore(id?:string){
    if(!context||lock.current)return;lock.current=true;setBusy(true);setError('');
    try{const target=id??workspace.record?.id,state=target?await workspace.open(target,async input=>(await reopenProcedure(context,input)).session):undefined;
      if(state){const next=(await reopenProcedure(context,state)).session,v=await calculateProcedure(context,next);setSession(next);setView(v);setConfig(v.graph.state.config);setSeed(next.seed);}else{setSession(undefined);setView(undefined);}workspace.cancel();setDirty(false);
    }catch(e){setError(e instanceof Error?e.message:'Não foi possível abrir o personagem.');}finally{lock.current=false;setBusy(false);}
  }
  async function confirm(){
    if(!context||!session||lock.current)return;lock.current=true;setBusy(true);setError('');
    try{const response=await fetch('/api/official/procedures',{cache:'no-store'});if(!response.ok)throw new Error('Fontes locais indisponíveis.');
      const fresh=ProcedureContextSchema.parse(await response.json()),v=await calculateProcedure(fresh,session);
      await workspace.save(session,v.graph.state.config.name);setContext(fresh);setView(v);setDirty(false);setSuspended(false);
    }catch(e){const message=e instanceof Error?e.message:'Não foi possível salvar; a prévia foi preservada.';setError(message);if(/Fontes.*(?:mudaram|indisponíveis)/.test(message))setSuspended(true);}finally{lock.current=false;setBusy(false);}
  }
  const command=(c:ProcedureCommand)=>{if(context&&session)void change(()=>performProcedureCommand(context,session,c));};
  const update=(patch:Partial<ProcedureConfig>)=>setConfig(c=>{
    const next={...c,...patch};if(next.variant==='core')next.attributeMode='fixed';if(next.variant!=='core'||next.procedure!=='core')next.coreBenefit=null;else next.coreBenefit??='random-profession';return next;
  });
  return <main data-mode="official-procedures-local"><h1>Procedimentos de criação · Humano L0</h1>
    <p>Core e Human Development, com fontes reais verificadas. Decisões e rolagens são salvas neste navegador.</p>
    <p role="status">{busy?'Aplicando e salvando…':context?'Fontes locais verificadas.':'Conferindo fontes locais…'}</p>{error&&<p role="alert">{error}</p>}
    {suspended&&<p>Rascunho suspenso. O contexto ou o conteúdo salvo exige revisão; os dados anteriores foram preservados e a finalização está bloqueada.</p>}
    <CharacterWorkspacePanel {...workspace} dirty={dirty} busy={busy} onOpen={id=>void restore(id)} onConfirm={()=>void confirm()} onDiscard={()=>void restore()}/>
    <form onSubmit={e=>{e.preventDefault();if(context)void change(async()=>advanceProcedure(context,await createProcedureSession(context,seed,config)),true);}}><fieldset disabled={!context||busy}><legend>Escolhas de criação</legend>
      <label>Nome<input value={config.name} maxLength={200} onChange={e=>update({name:e.target.value})}/></label>
      <label>Seed<input value={seed} required maxLength={200} onChange={e=>setSeed(e.target.value)}/></label>
      <label>Variante<select value={config.variant} onChange={e=>update({variant:e.target.value as ProcedureConfig['variant']})}><option value="core">Core</option><option value="only-human">Only Human</option></select></label>
      <label>Atributos<select value={config.attributeMode} onChange={e=>update({attributeMode:e.target.value as ProcedureConfig['attributeMode']})}><option value="fixed">Fixos</option>{config.variant==='only-human'&&<option value="random">Aleatórios: 8 + d3 por atributo</option>}</select></label>
      {config.attributeMode==='fixed'&&<label>Aumento de atributo<select value={config.increase} onChange={e=>update({increase:e.target.value as ProcedureConfig['increase']})}>{['strength','agility','intellect','will'].map(a=><option key={a}>{a}</option>)}</select></label>}
      <label>Procedimento<select value={config.procedure} onChange={e=>update({procedure:e.target.value as ProcedureConfig['procedure']})}><option value="core">Core</option><option value="human-development">Human Development</option></select></label>
      <label>Tamanho-base<select value={config.size} onChange={e=>update({size:Number(e.target.value) as 0.5|1})}><option value={1}>1</option><option value={0.5}>½</option></select></label>
      <label><input type="checkbox" checked={!!config.adjustment} onChange={e=>update({adjustment:e.target.checked?{increase:'strength',decrease:'agility'}:null})}/>Transferir 1 ponto entre atributos distintos</label>
      {config.adjustment&&(['increase','decrease'] as const).map(direction=><label key={direction}>{direction==='increase'?'Aumentar':'Diminuir'}<select value={config.adjustment![direction]} onChange={e=>update({adjustment:{...config.adjustment!,[direction]:e.target.value}})}>{['strength','agility','intellect','will'].map(a=><option key={a}>{a}</option>)}</select></label>)}
      {config.variant==='core'&&config.procedure==='core'&&<label>Benefício exclusivo<select value={config.coreBenefit??''} onChange={e=>update({coreBenefit:e.target.value as ProcedureConfig['coreBenefit']})}><option value="random-profession">Profissão aleatória adicional</option><option value="speak-language">Falar outro idioma</option></select></label>}
      <label>Interesting Things<select value={config.interestingVariant} onChange={e=>update({interestingVariant:e.target.value as ProcedureConfig['interestingVariant']})}><option value="oddities">Oddities</option><option value="core">Alternativa Core</option></select></label>
      <label>Modo<select value={config.mode} onChange={e=>update({mode:e.target.value as ProcedureConfig['mode']})}><option value="manual">Manual: resolver cada etapa</option><option value="hybrid">Híbrido: rolar tabelas, escolher alternativas</option><option value="random">Aleatório: avançar opções autorizadas</option></select></label>
      <label><input type="checkbox" checked={config.allowUniformChoices} onChange={e=>update({allowUniformChoices:e.target.checked})}/>Autorizo sorteio uniforme das escolhas do aplicativo, identificado separadamente das tabelas publicadas</label>
      {config.procedure==='core'&&['age','build','appearance','personality','religion','background'].map(id=><label key={id}><input type="checkbox" checked={config.optionalCoreTables.includes(`core:human-${id}`)} onChange={e=>update({optionalCoreTables:e.target.checked?[...config.optionalCoreTables,`core:human-${id}`]:config.optionalCoreTables.filter(t=>t!==`core:human-${id}`)})}/>Tabela Core opcional: {id}</label>)}
      {config.procedure==='core'&&<label><input type="checkbox" checked={config.optionalCoreTables.includes('core:role-traits')} onChange={e=>update({optionalCoreTables:e.target.checked?[...config.optionalCoreTables,'core:role-traits']:config.optionalCoreTables.filter(t=>t!=='core:role-traits')})}/>Traços opcionais: dois positivos e um negativo, com rolagens independentes</label>}
      {(['companion','tooth-and-claw','terrible-beauty','tombs'] as const).map(id=><label key={id}><input type="checkbox" checked={config.supplements.includes(id)} onChange={e=>update({supplements:e.target.checked?[...config.supplements,id]:config.supplements.filter(t=>t!==id)})}/>Usar suplemento {id} (efeitos sem implementação permanecem pendentes)</label>)}
      <button type="submit">{session?'Criar outra sessão':'Iniciar criação'}</button>
      {session&&<button type="button" onClick={()=>command({type:'config',config})}>Aplicar alterações à sessão atual</button>}
    </fieldset></form>
    {session&&view&&<><section aria-label="Ficha em criação"><h2>{view.graph.state.config.name||'Humano sem nome'}</h2>
      {view.equipment&&!view.equipment.resolved&&<p role="alert">Resolva o equipamento em uso para calcular os atributos e características.</p>}
      {view.base?.stats&&<p>Strength {view.base.stats.strength} · Agility {view.base.stats.agility} · Intellect {view.base.stats.intellect} · Will {view.base.stats.will} · Defense {view.base.stats.defense}</p>}
      {view.base?.states&&<p>Insanity {view.base.states.insanity} · Corruption {view.base.states.corruption}</p>}
      {view.base?.stats&&<dl aria-label="Demais características e modificadores">{Object.entries(view.base.stats).filter(([key])=>!['strength','agility','intellect','will','defense'].includes(key)).map(([key,value])=><div key={key}><dt>{key.replace(/([A-Z])/g,' $1')}</dt><dd> {value}</dd></div>)}</dl>}
      {view.base?.states&&<p>Damage {view.base.states.damage}</p>}
      {view.graph.dimensions&&<p>Idade {view.graph.dimensions.age} · Altura {view.graph.dimensions.height} in · Peso {view.graph.dimensions.weight} lb · Experiências iniciais {view.graph.initialLifeCount}</p>}
      <p>Build é aplicado antes da escala etária. As experiências seguem a rolagem inicial de idade.</p>
      <CharacterCompletionPanel completion={suspended?{...view.completion,status:'draft',canFinalize:false,fullyResolved:false}:view.completion} busy={busy} finalize={()=>context&&void change(()=>finalizeProcedure(context,session))} target={key=>view.graph.byKey.has(key)?`#${encodeURIComponent(`creation-step-${key}`)}`:'#procedure-pending'}/>
      <button disabled={busy||view.graph.state.config.mode==='manual'} onClick={()=>context&&void change(()=>advanceProcedure(context,session))}>Avançar etapas automáticas</button>
      {view.graph.pending.some(p=>p.code==='restart-required')&&<button disabled={busy} onClick={()=>command({type:'restart'})}>Recomeçar após a morte, preservando o histórico</button>}
    </section>
    <section aria-label="Etapas de criação"><h2>Etapas</h2>{view.graph.nodes.filter(n=>n.kind!=='config').map(n=><CreationStep key={n.key} node={n} context={context!} busy={busy} command={command}/>)}</section>
    <section><h2>Profissões e idiomas</h2>{view.graph.professions.filter(p=>p.subject===view.graph.root).map(p=><p key={p.key}>{context?.professions.find(o=>o.id===p.optionId)?.sourceText} {p.specialization}</p>)}{view.graph.languages.filter(l=>l.subject===view.graph.root).map(l=><p key={l.key}>{l.languageId}: {l.abilities.join(', ')}</p>)}</section>
    <section><h2>Traços e consequências</h2>{view.graph.traits.map(t=><p key={t.key}>{t.name}</p>)}{view.graph.notes.map(n=><p key={n.key}>{n.text}</p>)}{view.graph.things.map(t=><div key={t.key}>{t.application.quantities.map(q=><p key={q.id}>{q.amount} · {q.unit}</p>)}{t.application.declaredWorth&&<p>Valor patrimonial preservado: {t.application.declaredWorth.amount} {t.application.declaredWorth.denomination}</p>}{t.application.deferredUseRolls.length>0&&<p>{t.application.deferredUseRolls.length} rolagem(ns) reservada(s) ao uso.</p>}</div>)}</section>
    <section><h2>Ganhos iniciais</h2><p>Dinheiro conhecido: {view.material.knownCashBits} bits. Valores patrimoniais não são somados ao dinheiro.</p>{view.inventory.map(i=><div key={i.key}><p>{i.quantity??'?'} × {i.label}</p>{i.itemId&&context?.itemDefinitions.some(d=>d.id===i.itemId&&(d.weapon||d.armor))&&<label>Usar uma unidade de {i.label}<select disabled={busy} value={view.graph.state.equipmentLoadout.find(p=>p.key===i.key)?.slot??'carried'} onChange={e=>command({type:'equipment',loadout:[...view.graph.state.equipmentLoadout.filter(p=>p.key!==i.key),...(e.target.value==='carried'?[]:[{key:i.key,instance:1,slot:e.target.value as 'worn'|'main'|'off'|'both'}])]})}><option value="carried">Guardar</option><option value="worn">Vestir</option><option value="main">Mão principal</option><option value="off">Outra mão</option><option value="both">Duas mãos</option></select></label>}</div>)}</section>
    {!!view.graph.state.equipmentLoadout.length&&<section aria-label="Equipamento em uso"><h2>Equipamento em uso</h2><ul>{view.graph.state.equipmentLoadout.map((p,index)=><li key={`${p.key}/${p.instance}/${index}`}>{view.inventory.find(i=>i.key===p.key)?.label??'Origem indisponível'} · unidade {p.instance}<button disabled={busy} onClick={()=>command({type:'equipment',loadout:view.graph.state.equipmentLoadout.filter((_,i)=>i!==index)})}>Guardar esta unidade</button></li>)}</ul></section>}
    {view.graph.relativeCandidates.map(r=><label key={r.id}><input type="checkbox" checked={view.graph.state.config.relativeDetails.includes(r.id)} onChange={e=>command({type:'config',config:{...view.graph.state.config,relativeDetails:e.target.checked?[...view.graph.state.config.relativeDetails,r.id]:view.graph.state.config.relativeDetails.filter(id=>id!==r.id)}})}/>Detalhar familiar vivo: {r.label}</label>)}
    <section id="procedure-pending" aria-label="Pendências"><h2>Pendências</h2><ul>{view.pending.map((p,i)=><li key={`${p.key}/${i}`}>{p.scope==='use'?'No uso: ':''}{p.label}</li>)}</ul></section>
    <details><summary>Histórico de decisões ({session.events.length})</summary><ol>{session.events.map(e=><li key={e.id}>{e.seq} · {e.type}{e.type==='result'?` · ${e.result.method}${'faces' in e.result?` [${e.result.faces.join(', ')}]`:''}`:''}</li>)}</ol></details></>}
    {context&&<CharacterExportPanel mode="procedures" current={session} ready={!!view?.fullyResolved&&!suspended&&!dirty&&!workspace.conflict} busy={busy} unavailableReason={workspace.conflict?'Recarregue a versão salva para resolver o conflito antes de emitir arquivos.':dirty?'Confirme ou descarte a prévia antes de emitir arquivos.':undefined} onImport={state=>change(async()=>(await reopenProcedure(context,state)).session,true)}/>}
  </main>;
}
function CreationStep({node:n,context,busy,command}:{node:ProcedureNode;context:ProcedureContext;busy:boolean;command:(c:ProcedureCommand)=>void}){
  const [value,setValue]=useState(''),[faces,setFaces]=useState(''),[author,setAuthor]=useState(''),[reason,setReason]=useState(''),[definitionId,setDefinition]=useState('');
  const table=context.tables.find(t=>t.id===n.tableId),rows=table?.streams.find(s=>s.id===(n.streamId??'main'))?.rows??[];
  return <details id={`creation-step-${n.key}`} open={n.status==='pending'||n.status==='needs-review'}><summary>{n.label} · {n.status==='resolved'?'Resolvido':n.status==='blocked'?'Aguardando':n.status==='needs-review'?'Revisar':'Pendente'}</summary>
    {n.text&&<p>{n.text}</p>}{n.status==='resolved'&&!n.text&&<p>{n.value}</p>}{n.reason&&<p>{n.reason}</p>}
    <fieldset disabled={busy||n.locked||n.status==='blocked'||n.kind==='lookup'}><legend>{n.subject.startsWith('pc/0/')?'Familiar / dependente':'Criação'}</legend>
      {['table','profession','dice'].includes(n.kind)&&<><button onClick={()=>command({type:'roll',key:n.key})}>{n.record?'Rolar novamente':'Rolar'}</button><label>Faces dos dados físicos<input value={faces} placeholder="1, 2, 3" onChange={e=>setFaces(e.target.value)}/></label><button disabled={!faces.trim()} onClick={()=>command({type:'record-faces',key:n.key,faces:faces.split(/[ ,;]+/).filter(Boolean).map(Number)})}>Registrar faces</button></>}
      {(n.kind==='choice'||n.manualAllowed)&&<label>Escolha<select value={value} onChange={e=>setValue(e.target.value)}><option value="">Selecione</option>{n.kind==='table'?rows.map(r=><option key={r.id} value={r.id}>{r.text}</option>):n.options?.map(o=><option key={o.id} value={o.id} disabled={o.eligible===false}>{o.label}</option>)}</select></label>}
      {n.freeText&&<label>Outra opção concreta<input value={value.startsWith('custom:')?value.slice(7):''} onChange={e=>setValue(`custom:${e.target.value}`)}/></label>}
      {n.kind==='number'&&<label>{n.label}<input type="number" step="any" min={n.minimum} max={n.maximum??undefined} value={value} onChange={e=>setValue(e.target.value)}/></label>}
      {(n.kind==='choice'||n.kind==='number'||n.manualAllowed)&&<button disabled={!value} onClick={()=>command({type:'manual',key:n.key,value:n.kind==='number'?Number(value):value})}>Confirmar escolha</button>}
      {n.kind==='adjudication'&&<><label>Decisão concreta<input value={value} onChange={e=>setValue(e.target.value)} maxLength={500}/></label><label>Autor<input value={author} onChange={e=>setAuthor(e.target.value)} maxLength={120}/></label><label>Motivo e contexto<input value={reason} onChange={e=>setReason(e.target.value)} maxLength={500}/></label><label>Definição publicada, quando aplicável<select value={definitionId} onChange={e=>setDefinition(e.target.value)}><option value="">Registro narrativo</option>{n.key.endsWith('/family-context')?context.professions.filter(p=>p.sourceFamily==='only-human').map(p=><option key={p.id} value={p.id}>{p.sourceText}</option>):context.itemDefinitions.map(i=><option key={i.id} value={i.id}>{i.name}</option>)}</select></label><button disabled={!value.trim()||!author.trim()||!reason.trim()} onClick={()=>command({type:'adjudication',key:n.key,decision:{name:value,author,reason,...(definitionId?{definitionId}:{})}})}>Registrar decisão</button></>}
    </fieldset>{n.kind!=='lookup'&&<button disabled={busy} onClick={()=>command({type:'lock',key:n.key,locked:!n.locked})}>{n.locked?'Desbloquear':'Bloquear'}</button>}
  </details>;
}
