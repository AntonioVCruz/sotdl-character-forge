import {useState} from 'react';
export function CoreDimensionsPanel({dimensions,busy,onRecord}:{dimensions:{height:number;weight:number;age:number}|null;busy:boolean;onRecord:(values:{height:number;weight:number;age:number;reviewed:true})=>void}){
  const [height,setHeight]=useState(String(dimensions?.height??'')),[weight,setWeight]=useState(String(dimensions?.weight??'')),[age,setAge]=useState(String(dimensions?.age??'')),[reviewed,setReviewed]=useState(false);
  return <section id="core-dimensions" aria-label="Dimensões narrativas Core"><h3>Dimensões narrativas Core</h3>
    <p>Confira os resultados de idade e Build abaixo e registre as medidas concretas escolhidas. Este fluxo registra medidas informadas; não aplica as fórmulas de Human Development nem altera Size automaticamente.</p>
    {dimensions&&<p>Registrado: {dimensions.height} in · {dimensions.weight} lb · {dimensions.age} anos.</p>}
    <form onSubmit={e=>{e.preventDefault();if(reviewed)onRecord({height:Number(height),weight:Number(weight),age:Number(age),reviewed:true});}}><fieldset disabled={busy}><legend>Medidas conferidas</legend>
      <label>Altura em polegadas<input required type="number" min="0.01" step="any" value={height} onChange={e=>setHeight(e.target.value)}/></label>
      <label>Peso em libras<input required type="number" min="0.01" step="any" value={weight} onChange={e=>setWeight(e.target.value)}/></label>
      <label>Idade em anos<input required type="number" min="0" step="1" value={age} onChange={e=>setAge(e.target.value)}/></label>
      <label><input type="checkbox" checked={reviewed} onChange={e=>setReviewed(e.target.checked)}/>Conferi as medidas com os resultados narrativos de idade e Build.</label>
      <button disabled={!reviewed}>Registrar dimensões na prévia</button>
    </fieldset></form>
  </section>;
}
