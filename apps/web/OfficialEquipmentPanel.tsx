import {useState} from 'react';
import {configureOfficialEquipment,useOfficialEquipment,type OfficialCoreContext,type OfficialCoreDraft,type OfficialInventoryRecord,calculateOfficialCore} from '../../packages/character-generator/official-core';
type View=Awaited<ReturnType<typeof calculateOfficialCore>>;
type Shared={draft:OfficialCoreDraft;context:OfficialCoreContext;view:View;busy:boolean;change:(action:()=>Promise<OfficialCoreDraft>)=>Promise<void>};
const positions={carried:'Guardado',worn:'Vestido',main:'Mão principal',off:'Mão secundária',both:'Ambas as mãos',unassigned:'Definir posição'};
function EquipmentRow({item,draft,context,view,busy,change}:Shared&{item:OfficialInventoryRecord}) {
  const [instance,setInstance]=useState(1),definition=context.itemDefinitions.find(d=>d.id===item.itemId)!;
  const current=view.equipment.loadout.find(p=>p.key===item.key&&p.instance===instance),slot=current?.slot??'carried';
  const mainOccupied=view.equipment.loadout.some(p=>p.slot==='main'||p.slot==='both');
  const defaultSlot=definition.armor?'worn':definition.weapon?.hands==='two'?'both':definition.weapon?.hands==='off'&&mainOccupied?'off':'main';
  const options=definition.armor?['carried','worn']:definition.weapon?.hands==='off'?['carried','main','off']:definition.weapon?.hands==='one'?['carried','main','both']:view.equipment.context.mounted&&definition.weapon?.properties.includes('one hand while mounted')?['carried','main','both']:['carried','both'];
  return <fieldset data-equipment-key={item.key} disabled={busy}><legend>{item.sourceLabel}</legend>
    {item.quantity!>1&&<label>Unidade de {item.sourceLabel}<input type="number" min={1} max={item.quantity!} value={instance} onChange={e=>{const value=Number(e.target.value);if(Number.isInteger(value)&&value>=1&&value<=item.quantity!)setInstance(value);}}/></label>}
    <label><input type="checkbox" checked={!!current} onChange={e=>void change(()=>configureOfficialEquipment(draft,context,{key:item.key,instance,slot:e.target.checked?defaultSlot:'carried'}))}/>{definition.armor?'Vestir':'Empunhar'}</label>
    <label>Posição de {item.sourceLabel}<select aria-label={`Posição de ${item.sourceLabel}`} value={slot} onChange={e=>void change(()=>configureOfficialEquipment(draft,context,{key:item.key,instance,slot:e.target.value}))}>
      {slot==='unassigned'&&<option value="unassigned" disabled>Definir posição</option>}{options.map(p=><option key={p} value={p}>{positions[p as keyof typeof positions]}</option>)}
    </select></label>
    {current&&current.slot!=='unassigned'&&<button type="button" onClick={()=>void change(()=>configureOfficialEquipment(draft,context,{key:item.key,instance,slot:current.slot,replaceConflicts:true}))}>Usar esta posição substituindo conflitos</button>}
  </fieldset>;
}
export function OfficialEquipmentPanel(props:Shared) {
  const {draft,context,view,busy,change}=props,e=view.equipment;
  return <section id="official-equipment" aria-label="Composição de equipamento"><h3>Equipamento e mãos</h3>
    <p>Possuir um item não aplica seus efeitos. Escolha a unidade, a posição e a empunhadura; conflitos preservam a seleção e suspendem os números até serem resolvidos.</p>
    {context.equipmentRules.defensiveStacking==='highest'&&<p>Interpretação do projeto: aplica-se somente o maior bônus defensivo dos escudos em uso.</p>}
    {view.inventory.filter(i=>i.itemId&&i.recordKind==='item'&&i.profile!=='none'&&i.quantity!==null&&i.quantity>0).map(item=><EquipmentRow key={`${item.key}/${item.itemId}`} {...props} item={item}/>)}
    {!!e.loadout.length&&<ul aria-label="Unidades em uso">{e.loadout.map((p,i)=><li key={`${p.key}/${p.instance}/${i}`}>{view.inventory.find(r=>r.key===p.key)?.sourceLabel??'Origem indisponível'} · unidade {p.instance} · {positions[p.slot]}
      <button type="button" disabled={busy} onClick={()=>void change(()=>configureOfficialEquipment(draft,context,{key:p.key,instance:p.instance,slot:'carried'}))}>Guardar esta unidade</button>
    </li>)}</ul>}
    {!!e.diagnostics.length&&<ul role="alert">{e.diagnostics.map((d,i)=><li key={`${d.code}/${i}`}>{d.label}</li>)}</ul>}
    <label><input type="checkbox" checked={e.context.mounted} disabled={busy} onChange={event=>{const value=event.target.checked;void change(()=>useOfficialEquipment(draft,context,{type:'mounted',value}));}}/>Montado, para propriedades que declaram essa condição</label>
    {e.resolved&&<>
      <p>Penalidades de equipamento: Strength {e.tests.strengthBanes} bane(s); Agility {e.tests.agilityBanes} bane(s); Strength ao nadar {e.tests.swimmingStrengthBanes} bane(s).</p>
      {!!e.weapons.length&&<ul aria-label="Perfis em uso">{e.weapons.map(w=><li key={w.ref}>{w.name} · {positions[w.slot]} · dano {w.damage.count}d{w.damage.sides}{w.damage.modifier>=0?'+':''}{w.damage.modifier} · {w.attackBanes} bane(s) de equipamento nos ataques com esta arma · Defense +{w.defensiveBonus}{w.defensiveSuppressed?' (suspenso até o fim da rodada)':w.defensiveStackingSuppressed?' (aplica-se somente o maior bônus defensivo)':''}
        {w.usePending.map(note=><p key={note}>{note}</p>)}</li>)}</ul>}
      <details><summary>Composição dos efeitos de equipamento</summary><ul>{e.breakdown.map((b,i)=><li key={i}>{b.phase==='defense-replacement'?'Substituição de Defense':b.phase==='speed-penalty'?'Ajuste de Speed':'Bônus defensivo'}: {b.value} · {view.inventory.find(r=>`${r.key}#1`===b.origin)?.sourceLabel??b.origin}</li>)}</ul></details>
    </>}
    <h4>Uso com duas armas</h4><p>Registre a condição ao atacar com duas armas. O ataque, o dano e a munição são resolvidos à parte. Escudos usados nesse ataque perdem o bônus defensivo até o fim da rodada.</p>
    {e.dualAttack.unavailableReason&&<p>{e.dualAttack.unavailableReason}</p>}
    <button type="button" disabled={busy||!e.dualAttack.eligible} onClick={()=>void change(()=>useOfficialEquipment(draft,context,{type:'dual-attack',targets:'one-target'}))}>Registrar uso contra um alvo</button>
    <button type="button" disabled={busy||!e.dualAttack.eligible} onClick={()=>void change(()=>useOfficialEquipment(draft,context,{type:'dual-attack',targets:'two-targets'}))}>Registrar uso contra dois alvos</button>
    {e.context.dualAttack!=='none'&&<p>Uso registrado: {e.dualAttack.additionalBanes} bane(s) da opção de duas armas, além das restrições aplicáveis a cada teste.</p>}
    <button type="button" disabled={busy||e.context.dualAttack==='none'&&!e.context.suppressedDefensive.length} onClick={()=>void change(()=>useOfficialEquipment(draft,context,{type:'end-round'}))}>Encerrar rodada de equipamento</button>
  </section>;
}
