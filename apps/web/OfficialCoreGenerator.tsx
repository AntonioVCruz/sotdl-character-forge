import {useEffect,useRef,useState} from 'react';
import {InterestingThingPanel} from './InterestingThingPanel';
import {OfficialEquipmentPanel} from './OfficialEquipmentPanel';
import {CharacterCompletionPanel} from './CharacterCompletionPanel';
import {useCharacterWorkspace} from './useCharacterWorkspace';
import {CharacterWorkspacePanel} from './CharacterWorkspacePanel';
import {CoreDimensionsPanel} from './CoreDimensionsPanel';
import {recordOfficialDimensions} from '../../packages/character-generator/official-core';
import {calculateOfficialCore,chooseOfficialCore,finalizeOfficialCore,generateOfficialCore,selectOfficialBackground,parseOfficialCoreContext,parseOfficialCoreDraft,type OfficialCoreContext,type OfficialCoreDraft} from '../../packages/character-generator/official-core';
const STORAGE='sotdl-official-core-draft@1';
type View=Awaited<ReturnType<typeof calculateOfficialCore>>;
export function OfficialCoreGenerator({onDirtyChange}:{onDirtyChange?:(dirty:boolean)=>void}={}) {
  const [context,setContext]=useState<OfficialCoreContext>(),[draft,setDraft]=useState<OfficialCoreDraft>(),[view,setView]=useState<View>();
  const [suspended,setSuspended]=useState(false);
  const workspace=useCharacterWorkspace('core'),[dirty,setDirty]=useState(false);
  useEffect(()=>{onDirtyChange?.(dirty);return()=>onDirtyChange?.(false);},[dirty,onDirtyChange]);
  const [error,setError]=useState(''),[loading,setLoading]=useState(true),[busy,setBusy]=useState(false),lock=useRef(false);
  const [name,setName]=useState(''),[seed,setSeed]=useState(''),[increase,setIncrease]=useState<'strength'|'agility'|'intellect'|'will'>('strength');
  const [benefit,setBenefit]=useState<'random-profession'|'speak-language'>('random-profession'),[languageId,setLanguage]=useState(''),[variant,setVariant]=useState(''),[optional,setOptional]=useState(false);
  useEffect(()=>{let live=true;(async()=>{
    let existingSave:string|null=null;try {
      existingSave=localStorage.getItem(STORAGE);
      const r=await fetch('/api/official/core',{cache:'no-store'});
      if(!r.ok||!r.headers.get('content-type')?.includes('application/json'))throw new Error('Fontes reais indisponíveis ou fora da revisão. Execute os checks locais de curadoria.');
      const c=parseOfficialCoreContext(await r.json());if(!live)return;setContext(c);
      const saved=await workspace.load(STORAGE,async input=>{const d=parseOfficialCoreDraft(input);await calculateOfficialCore(d,c);return d;},parseOfficialCoreDraft);
      if(saved){const d=parseOfficialCoreDraft(saved),v=await calculateOfficialCore(d,c);
        if(live){setDraft(d);setView(v);setName(d.config.name);setSeed(d.config.seed);setIncrease(d.config.increase);setBenefit(d.config.benefit);setLanguage(d.config.languageId);setVariant(d.config.interestingVariant);setOptional(d.config.optionalTables);}}
    }catch(e){if(live){setError(e instanceof Error?e.message:'Não foi possível abrir as fontes locais.');setSuspended(!!existingSave);}}finally{if(live)setLoading(false);}
  })();return()=>{live=false;};},[]);
  async function change(action:()=>Promise<OfficialCoreDraft>,newCharacter=false) {
    if(lock.current||!context)return;lock.current=true;setBusy(true);setError('');
    try{const d=await action(),v=await calculateOfficialCore(d,context);if(newCharacter)workspace.stageNew();setDraft(d);setView(v);setDirty(true);setSuspended(false);}
    catch(e){setError(e instanceof Error?e.message:'Operação não concluída.');}finally{lock.current=false;setBusy(false);}
  }
  async function restore(id?:string){
    if(!context||lock.current)return;lock.current=true;setBusy(true);setError('');
    try{const target=id??workspace.record?.id,state=target?await workspace.open(target,async input=>{const d=parseOfficialCoreDraft(input);await calculateOfficialCore(d,context);return d;}):undefined;
      if(state){const d=parseOfficialCoreDraft(state),v=await calculateOfficialCore(d,context);setDraft(d);setView(v);setName(d.config.name);setSeed(d.config.seed);setIncrease(d.config.increase);setBenefit(d.config.benefit);setLanguage(d.config.languageId);setVariant(d.config.interestingVariant);setOptional(d.config.optionalTables);}else{setDraft(undefined);setView(undefined);}workspace.cancel();setDirty(false);
    }catch(e){setError(e instanceof Error?e.message:'Não foi possível abrir o personagem.');}finally{lock.current=false;setBusy(false);}
  }
  async function confirm(){
    if(!draft||lock.current)return;lock.current=true;setBusy(true);setError('');
    try{const response=await fetch('/api/official/core',{cache:'no-store'});if(!response.ok)throw new Error('Fontes locais indisponíveis.');
      const fresh=parseOfficialCoreContext(await response.json()),v=await calculateOfficialCore(draft,fresh);
      await workspace.save(draft,draft.config.name);setContext(fresh);setView(v);setDirty(false);setSuspended(false);
    }catch(e){const message=e instanceof Error?e.message:'Não foi possível salvar; a prévia foi preservada.';setError(message);if(/source-context-changed|Fontes locais indisponíveis/.test(message))setSuspended(true);}finally{lock.current=false;setBusy(false);}
  }
  const choose=(key:string,value:string)=>{if(draft&&context)void change(()=>chooseOfficialCore(draft,context,key,value));};
  return <main data-mode="official-local">
    <header><p className="eyebrow">SHADOW OF THE DEMON LORD · CHARACTER FORGE</p><h1>Forja de personagens</h1><h2>Humano · Livro básico · Nível 0</h2><p>Geração local com regras publicadas e fontes verificadas.</p></header>
    <p role="status" aria-live="polite">{loading?'Conferindo fontes reais locais…':busy?'Aplicando e salvando…':context?'Fontes reais carregadas. Geração oficial local habilitada.':'Aguardando fontes reais verificadas.'}</p>
    {error&&<p role="alert" className="error">{error}</p>}
    {suspended&&<p>Rascunho suspenso. O contexto ou o conteúdo salvo exige revisão; os dados anteriores foram preservados e a finalização está bloqueada.</p>}
    <CharacterWorkspacePanel {...workspace} dirty={dirty} busy={busy||loading} onOpen={id=>void restore(id)} onConfirm={()=>void confirm()} onDiscard={()=>void restore()}/>
    <form onSubmit={e=>{e.preventDefault();if(context&&variant==='core')void change(()=>generateOfficialCore(context,{name,seed,increase,benefit,languageId,interestingVariant:'core',optionalTables:optional}),true);}}>
      <fieldset disabled={!context||busy||loading}><legend>Personagem Core</legend>
        <label>Nome<input value={name} maxLength={200} onChange={e=>setName(e.target.value)}/></label>
        <label>Seed<input value={seed} required maxLength={200} onChange={e=>setSeed(e.target.value)}/></label>
        <label>Aumento de atributo<select value={increase} onChange={e=>setIncrease(e.target.value as typeof increase)}>{['strength','agility','intellect','will'].map(a=><option key={a} value={a}>{a}</option>)}</select></label>
        <label>Benefício de humano<select value={benefit} onChange={e=>setBenefit(e.target.value as typeof benefit)}><option value="random-profession">Profissão aleatória adicional</option><option value="speak-language">Falar outro idioma</option></select></label>
        {benefit==='speak-language'&&<label>Idioma adicional<select value={languageId} required onChange={e=>setLanguage(e.target.value)}><option value="">Selecione</option>{context?.core.languageOptions.filter(l=>l.id!==`language:${context.mechanicalPacks[0].entities[0].mechanics.baseLanguage.languageId}`).map(l=><option key={l.id} value={l.id.replace(/^language:/,'')}>{l.label}</option>)}</select></label>}
        <label>Fonte de Interesting Things<select value={variant} required onChange={e=>setVariant(e.target.value)}><option value="">Selecione a fonte deste resultado</option><option value="core">Livro básico — alternativa Core</option></select></label>
        <p>Oddities é o padrão do projeto; este recorte oferece a alternativa Core mediante escolha explícita.</p>
        <label><input type="checkbox" checked={optional} onChange={e=>setOptional(e.target.checked)}/>Sortear idade, Build, aparência, personalidade e religião opcionais</label>
        <button type="submit" disabled={!seed.trim()||variant!=='core'}>{draft?'Gerar novo rascunho com estas escolhas':'Gerar com regras reais'}</button>
      </fieldset>
    </form>
    {draft&&view&&<section aria-label="Ficha Core" data-official="true">
      <h2>{draft.config.name||'Personagem sem nome'}</h2>
      <CharacterCompletionPanel completion={suspended?{...view.completion,status:'draft',canFinalize:false,fullyResolved:false}:view.completion} busy={busy} finalize={()=>void change(()=>finalizeOfficialCore(draft,context!))} target={key=>key==='optional/build'?'#core-dimensions':key.startsWith('interesting/')?'#official-interesting':key.startsWith('equipment/')||key==='mechanics'?'#official-equipment':view.pending.some(p=>p.key===key)?`#${encodeURIComponent(`core-pending-${key}`)}`:'#core-pending'}/>
      <h3>Atributos e características</h3>{view.base.stats?<dl>{Object.entries(view.base.stats).map(([key,value])=><div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl>:<p role="alert">Resolver conflito de equipamento para calcular.</p>}
      <h3>Estados iniciais</h3><dl>{Object.entries(view.base.states??{}).map(([key,value])=><div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl>
      <h3>Profissões</h3><ul>{view.professions.map(p=><li key={p.key}>{p.label}{p.specialization&&` · ${p.specialization}`}</li>)}</ul>
      <h3>Idiomas</h3><ul>{view.languages.map(l=><li key={l.id}>{context?.core.languageOptions.find(option=>option.id===`language:${l.id}`)?.label??l.id} · {[l.speak?'fala':'',l.read?'leitura':'',l.write?'escrita':''].filter(Boolean).join(', ')}</li>)}</ul>
      <h3>Riqueza e ganhos</h3><p>{view.wealth} · Dinheiro disponível: {view.moneyBits} bits</p>
      <ul>{view.inventory.map(i=><li key={i.key}>{i.quantity??'Quantidade pendente'} {i.unit} · {i.sourceLabel} · {i.recordKind}</li>)}</ul>
      <OfficialEquipmentPanel draft={draft} context={context!} view={view} busy={busy} change={change}/>
      <InterestingThingPanel key={view.interestingThing.id} draft={draft} context={context!} view={view} busy={busy} change={change}/>
      <h3>Background opcional</h3>
      <p>Você pode manter esta etapa sem resultado, sortear ou escolher uma linha publicada. Trocar a linha substitui suas consequências; os sorteios anteriores são preservados.</p>
      <button type="button" disabled={busy||draft.choices['background/mode']==='random'} onClick={()=>void change(()=>selectOfficialBackground(draft,context!,'random'))}>{draft.rolls['background/result']?'Restaurar sorteio de Background':'Sortear Background'}</button>
      <button type="button" disabled={busy||!view.background} onClick={()=>void change(()=>selectOfficialBackground(draft,context!,'none'))}>Remover Background</button>
      <label>Escolher Background<select aria-label="Escolher Background" disabled={busy} value={view.background?.rowId??''} onChange={e=>{if(e.target.value)void change(()=>selectOfficialBackground(draft,context!,'manual',e.target.value));}}>
        <option value="">Sem seleção</option>{context?.core.tables.find(t=>t.id==='core:human-background')?.columns[0].rows.map(r=><option key={r.id} value={r.id}>{r.min} · {r.text}</option>)}
      </select></label>
      {view.background&&<><p>{view.background.text}</p>{view.background.values?.detail!==null&&<p>Quantidade narrativa registrada: {view.background.values?.detail}</p>}
        {view.background.values?.state!==null&&<p>Estado adicional de Background: {view.background.values?.state}</p>}
        {view.background.appearance&&<p>Marca física escolhida: {{finger:'Dedo perdido',teeth:'Dentes perdidos',ear:'Orelha perdida',scar:'Cicatriz'}[view.background.appearance]}</p>}
        <p>Fonte: {view.background.sourceId} · Resultado {view.background.rowId.split(':').at(-1)}</p></>}
      {!!view.narrative.length&&<><h3>Descrição opcional</h3>{view.narrative.map(n=><p key={n.tableId}>{n.text}</p>)}</>}
      {draft.config.optionalTables&&<CoreDimensionsPanel key={draft.config.seed} dimensions={view.dimensions} busy={busy} onRecord={values=>void change(()=>recordOfficialDimensions(draft,context!,values))}/>}
      <h3 id="core-pending">Pendências e escolhas</h3><ul>{view.pending.filter(p=>!p.key.startsWith('interesting/')||!p.options).map(p=><li id={`core-pending-${p.key}`} key={p.key}>{p.label}
        {p.options?<select aria-label={p.label} value={draft.choices[p.key]??''} disabled={busy} onChange={e=>choose(p.key,e.target.value)}><option value="">Selecione</option>{p.options.map(o=><option key={o.id} value={o.id}>{o.label}</option>)}</select>
          :p.key.endsWith('/specialization')?<input aria-label={p.label} disabled={busy} defaultValue={draft.choices[p.key]??''} onBlur={e=>{if(e.target.value.trim())choose(p.key,e.target.value.trim());}}/>:null}</li>)}</ul>
      <details><summary>Sorteios registrados</summary><p>Seed: {draft.config.seed} · Algoritmo: {draft.prngVersion}</p><ul>{Object.entries(draft.rolls).map(([key,faces])=><li key={key}>{key}: {faces.join(', ')}</li>)}</ul></details>
      <p>Revisão de conteúdo permanece needs-review. A emissão da ficha usa uma projeção mínima, sem textos das fontes.</p>
    </section>}
    <footer>Fontes utilizadas somente neste ambiente local. Rascunho salvo neste navegador, separado dos personagens legados.</footer>
  </main>;
}
