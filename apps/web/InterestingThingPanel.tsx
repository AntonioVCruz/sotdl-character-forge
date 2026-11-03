import {useState} from 'react';
import {adjudicateOfficialThing,selectOfficialThing,chooseOfficialCore,type OfficialCoreContext,type OfficialCoreDraft,calculateOfficialCore} from '../../packages/character-generator/official-core';
import {thingChoiceKey} from '../../packages/character-generator/core-interesting-things';

type Props={draft:OfficialCoreDraft;context:OfficialCoreContext;view:Awaited<ReturnType<typeof calculateOfficialCore>>;busy:boolean;change:(action:()=>Promise<OfficialCoreDraft>)=>Promise<void>};
export function InterestingThingPanel({draft,context,view,busy,change}:Props) {
  const app=view.interestingApplication,thing=view.interestingThing;
  const [author,setAuthor]=useState(''),[reason,setReason]=useState(''),[definition,setDefinition]=useState(''),[name,setName]=useState('');
  const quantityRoles={contents:'Conteúdo',length:'Comprimento',weight:'Peso',capacity:'Capacidade',resource:'Recurso inicial',count:'Quantidade'};
  return <section aria-label="Resultado de Interesting Things">
    <h3>Interesting Thing</h3><p>{thing.text}</p>
    <label>Escolher Interesting Thing<select aria-label="Escolher Interesting Thing" disabled={busy} value={thing.id} onChange={e=>void change(()=>selectOfficialThing(draft,context,e.target.value))}>
      {context.core.things.map(t=><option key={t.id} value={t.id}>{t.id.replace(/^core:/,'')} · {t.text}</option>)}
    </select></label>
    <button type="button" disabled={busy||!draft.choices['interesting/result']} onClick={()=>void change(()=>selectOfficialThing(draft,context))}>Restaurar sorteio de Interesting Thing</button>
    <p>{app.creationResolved?'Ganhos da criação registrados.':'Complete as escolhas da criação indicadas nas pendências.'} Efeitos condicionais de uso estão separados abaixo.</p>
    {thing.details.choices.map(choice=><label key={choice.id}>Alternativa de Interesting Thing<select aria-label="Alternativa de Interesting Thing" disabled={busy} value={draft.choices[thingChoiceKey(thing.id,choice.id)]??''} onChange={e=>{if(e.target.value)void change(()=>chooseOfficialCore(draft,context,thingChoiceKey(thing.id,choice.id),e.target.value));}}>
      <option value="">Selecione</option>{choice.options.map(o=><option key={o.id} value={o.id}>{o.text}</option>)}
    </select></label>)}
    {!!app.selectedAlternatives.length&&<ul>{app.selectedAlternatives.map(o=><li key={o.choiceId}>Alternativa: {o.text}</li>)}</ul>}
    {!!app.quantities.length&&<ul aria-label="Quantidades de Interesting Thing">{app.quantities.map(q=><li key={q.id}>{quantityRoles[q.role]}: {q.amount} {q.unit}</li>)}</ul>}
    {app.declaredWorth&&<p>Valor patrimonial: {app.declaredWorth.amount} {app.declaredWorth.denomination}. Não acrescentado ao dinheiro disponível.</p>}
    {!!app.grants.filter(g=>['companion','relationship','narrative'].includes(g.kind)).length&&<ul aria-label="História e acompanhantes">{app.grants.filter(g=>['companion','relationship','narrative'].includes(g.kind)).map(g=><li key={g.key}>{g.kind==='companion'?'Companheiro/dependente':g.kind==='relationship'?'Relação':'História'} · {g.count} · {g.label}</li>)}</ul>}
    {app.specialArmor&&<p>Interpretação definida pelo usuário: armadura leve com os atributos de mail, peso 0, sem requisito de Strength e sem acumular com outra armadura. Seus efeitos são aplicados ao vestir.</p>}
    {thing.details.gmChoice&&<form onSubmit={e=>{e.preventDefault();void change(()=>adjudicateOfficialThing(draft,context,{outcomeId:thing.id,author,reason,definition:definition==='generic'?{kind:'generic',name}:{kind:'published',itemId:definition}}));}}>
      <fieldset disabled={busy}><legend>Identificar a arma escolhida pelo mestre</legend>
        <label>Responsável pela decisão<input aria-label="Responsável pela decisão" value={author} maxLength={120} required onChange={e=>setAuthor(e.target.value)}/></label>
        <label>Decisão e contexto<input aria-label="Decisão e contexto" value={reason} maxLength={500} required onChange={e=>setReason(e.target.value)}/></label>
        <label>Definição da arma<select aria-label="Definição da arma" required value={definition} onChange={e=>setDefinition(e.target.value)}><option value="">Selecione</option>
          {context.itemDefinitions.filter(i=>i.definitionStatus==='published-core'&&i.category==='weapon').map(i=><option key={i.id} value={i.id}>{i.name}</option>)}
          <option value="generic">Outro nome, sem perfil mecânico validado</option></select></label>
        {definition==='generic'&&<label>Nome da arma<input aria-label="Nome da arma" required maxLength={200} value={name} onChange={e=>setName(e.target.value)}/></label>}
        <button type="submit" disabled={!author.trim()||!reason.trim()||!definition||definition==='generic'&&!name.trim()}>Registrar arma e decisão</button>
      </fieldset>
    </form>}
    {app.adjudication&&<p>Decisão registrada por {app.adjudication.author}: {app.adjudication.reason}. Arma: {app.adjudication.definition.kind==='generic'?app.adjudication.definition.name:context.itemDefinitions.find(i=>i.id===(app.adjudication!.definition as {itemId:string}).itemId)?.name}</p>}
    {!!app.pending.filter(p=>p.scope==='use').length&&<><h4>Efeitos e adjudicações de uso</h4><ul>{app.pending.filter(p=>p.scope==='use').map(p=><li key={p.key}>{p.label}</li>)}</ul></>}
    {!!app.deferredUseRolls.length&&<p>Dados para o uso, ainda não consumidos: {app.deferredUseRolls.map(r=>`${r.count}d${r.sides} (${r.purpose})`).join('; ')}</p>}
    <details><summary>Origem e histórico de Interesting Things</summary><p>{app.origin.sourceId} · {app.origin.outcomeId}</p><p>Contexto: {app.contextSha256}</p>
      <ul>{draft.interestingHistory.map((e,i)=><li key={i}>{e.type==='adjudicate'?`Decisão de ${e.decision.author} para ${e.decision.outcomeId}`:`${e.type==='select'?'Resultado':'Alternativa'}: ${e.outcomeId}`}</li>)}</ul>
    </details>
  </section>;
}
