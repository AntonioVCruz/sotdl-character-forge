import {useEffect,useRef,useState} from 'react';
import {calculateOfficialCore,chooseOfficialCore,equipOfficialCore,generateOfficialCore,selectOfficialBackground,parseOfficialCoreContext,parseOfficialCoreDraft,type OfficialCoreContext,type OfficialCoreDraft} from '../../packages/character-generator/official-core';
const STORAGE='sotdl-official-core-draft@1';
type View=Awaited<ReturnType<typeof calculateOfficialCore>>;
export function OfficialCoreGenerator() {
  const [context,setContext]=useState<OfficialCoreContext>(),[draft,setDraft]=useState<OfficialCoreDraft>(),[view,setView]=useState<View>();
  const [error,setError]=useState(''),[loading,setLoading]=useState(true),[busy,setBusy]=useState(false),lock=useRef(false);
  const [name,setName]=useState(''),[seed,setSeed]=useState(''),[increase,setIncrease]=useState<'strength'|'agility'|'intellect'|'will'>('strength');
  const [benefit,setBenefit]=useState<'random-profession'|'speak-language'>('random-profession'),[languageId,setLanguage]=useState(''),[variant,setVariant]=useState(''),[optional,setOptional]=useState(false);
  useEffect(()=>{let live=true;(async()=>{
    try {
      const r=await fetch('/api/official/core',{cache:'no-store'});
      if(!r.ok||!r.headers.get('content-type')?.includes('application/json'))throw new Error('Fontes reais indisponíveis ou fora da revisão. Execute os checks locais de curadoria.');
      const c=parseOfficialCoreContext(await r.json());if(!live)return;setContext(c);
      const text=localStorage.getItem(STORAGE);
      if(text){if(text.length>1_000_000)throw new Error('Rascunho salvo excede o limite; os dados foram preservados.');const d=parseOfficialCoreDraft(JSON.parse(text)),v=await calculateOfficialCore(d,c);
        if(live){setDraft(d);setView(v);setName(d.config.name);setSeed(d.config.seed);setIncrease(d.config.increase);setBenefit(d.config.benefit);setLanguage(d.config.languageId);setVariant(d.config.interestingVariant);setOptional(d.config.optionalTables);}}
    }catch(e){if(live)setError(e instanceof Error?e.message:'Não foi possível abrir as fontes locais.');}finally{if(live)setLoading(false);}
  })();return()=>{live=false;};},[]);
  async function change(action:()=>Promise<OfficialCoreDraft>) {
    if(lock.current||!context)return;lock.current=true;setBusy(true);setError('');
    try{const d=await action(),v=await calculateOfficialCore(d,context);localStorage.setItem(STORAGE,JSON.stringify(d));setDraft(d);setView(v);}
    catch(e){setError(e instanceof Error?e.message:'Operação não concluída.');}finally{lock.current=false;setBusy(false);}
  }
  const choose=(key:string,value:string)=>{if(draft&&context)void change(()=>chooseOfficialCore(draft,context,key,value));};
  return <main data-mode="official-local">
    <header><p className="eyebrow">SHADOW OF THE DEMON LORD · CHARACTER FORGE</p><h1>Forja de personagens</h1><h2>Humano · Livro básico · Nível 0</h2><p>Geração local com regras publicadas e fontes verificadas.</p></header>
    <p role="status" aria-live="polite">{loading?'Conferindo fontes reais locais…':busy?'Aplicando e salvando…':context?'Fontes reais carregadas. Geração oficial local habilitada.':'Aguardando fontes reais verificadas.'}</p>
    {error&&<p role="alert" className="error">{error}</p>}
    <form onSubmit={e=>{e.preventDefault();if(context&&variant==='core')void change(()=>generateOfficialCore(context,{name,seed,increase,benefit,languageId,interestingVariant:'core',optionalTables:optional}));}}>
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
      <h2>{draft.config.name||'Personagem sem nome'}</h2><p className="notice">Rascunho com regras reais · {view.pending.length} pendência(s). A ficha ainda não está concluída.</p>
      <h3>Atributos e características</h3>{view.base.stats?<dl>{Object.entries(view.base.stats).map(([key,value])=><div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl>:<p role="alert">Resolver conflito de equipamento para calcular.</p>}
      <h3>Estados iniciais</h3><dl>{Object.entries(view.base.states??{}).map(([key,value])=><div key={key}><dt>{key}</dt><dd>{value}</dd></div>)}</dl>
      <h3>Profissões</h3><ul>{view.professions.map(p=><li key={p.key}>{p.label}{p.specialization&&` · ${p.specialization}`}</li>)}</ul>
      <h3>Idiomas</h3><ul>{view.languages.map(l=><li key={l.id}>{context?.core.languageOptions.find(option=>option.id===`language:${l.id}`)?.label??l.id} · {[l.speak?'fala':'',l.read?'leitura':'',l.write?'escrita':''].filter(Boolean).join(', ')}</li>)}</ul>
      <h3>Riqueza e ganhos</h3><p>{view.wealth} · Dinheiro disponível: {view.moneyBits} bits</p>
      <ul>{view.inventory.map(i=><li key={i.key}>{i.quantity??'Quantidade pendente'} {i.unit} · {i.sourceLabel} · {i.recordKind}
        {i.itemId&&i.recordKind==='item'&&i.profile!=='none'&&i.quantity!==null&&i.quantity>0&&<label><input type="checkbox" checked={i.equipped} disabled={busy} onChange={e=>{const checked=e.target.checked;void change(()=>equipOfficialCore(draft,context!,i.key,checked));}}/>{i.profile==='armor'?'Vestir':'Empunhar'}</label>}</li>)}</ul>
      {view.equipmentNotes.map(n=><p key={n}>{n}</p>)}
      <h3>Interesting Thing</h3><p>{view.interestingThing.text}</p>
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
      <h3>Pendências e escolhas</h3><ul>{view.pending.map(p=><li key={p.key}>{p.label}
        {p.options?<select aria-label={p.label} value={draft.choices[p.key]??''} disabled={busy} onChange={e=>choose(p.key,e.target.value)}><option value="">Selecione</option>{p.options.map(o=><option key={o.id} value={o.id}>{o.label}</option>)}</select>
          :p.key.endsWith('/specialization')?<input aria-label={p.label} disabled={busy} defaultValue={draft.choices[p.key]??''} onBlur={e=>{if(e.target.value.trim())choose(p.key,e.target.value.trim());}}/>:null}</li>)}</ul>
      <details><summary>Sorteios registrados</summary><p>Seed: {draft.config.seed} · Algoritmo: {draft.prngVersion}</p><ul>{Object.entries(draft.rolls).map(([key,faces])=><li key={key}>{key}: {faces.join(', ')}</li>)}</ul></details>
      <p>Revisão de conteúdo permanece needs-review. Impressão e exportação aguardam as consequências e os gates de distribuição.</p>
    </section>}
    <footer>Fontes utilizadas somente neste ambiente local. Rascunho salvo neste navegador, separado dos personagens legados.</footer>
  </main>;
}
