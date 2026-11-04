import type {CharacterCompletion} from '../../packages/character-generator/character-finalization';

export function CharacterCompletionPanel({completion,busy,finalize,target}:{completion:CharacterCompletion;busy:boolean;finalize:()=>void;target:(key:string)=>string}){
  return <section aria-label="Estado do personagem">
    <h3>{completion.status==='finalized'?'Personagem finalizado':completion.canFinalize?'Rascunho pronto para finalizar':'Rascunho com pendências de criação'}</h3>
    {completion.invalidationReason&&<p role="alert">{completion.invalidationReason}</p>}
    <button type="button" disabled={busy||!completion.canFinalize||completion.status==='finalized'} onClick={finalize}>Finalizar personagem</button>
    {!!completion.blockers.length&&<><p>Resolva estas obrigações antes de finalizar:</p><ul>{completion.blockers.map((p,i)=><li key={`${p.key}/${i}`}><a href={target(p.key)}>{p.label}</a> {p.action}</li>)}</ul></>}
    {!!completion.deferredUse.length&&<details><summary>Efeitos reservados ao uso em jogo ({completion.deferredUse.length})</summary><p>Estes efeitos continuam explícitos e não bloqueiam a finalização da criação.</p><ul>{completion.deferredUse.map((p,i)=><li key={`${p.key}/${i}`}>{p.label}</li>)}</ul></details>}
    {!!completion.optionalOmissions.length&&<details><summary>Etapas facultativas não escolhidas ({completion.optionalOmissions.length})</summary><ul>{completion.optionalOmissions.map(p=><li key={p.key}>{p.label}</li>)}</ul></details>}
    <p>A finalização vale para o recorte local suportado. A revisão das fontes continua needs-review. Exportação desabilitada.</p>
  </section>;
}
