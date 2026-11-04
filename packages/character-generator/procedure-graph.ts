import type {HumanL0MechanicalPack} from '../curation/human-l0-mechanics';
import {type ProcedureContext,type ProcedureSession,type ProcedureReplayState,type ProcedureNode,type ProcedurePending,type ProcedureProfession,type ProcedureLanguage,type ProcedureStateGrant,type ProcedureProgramInstance,procedureSignature} from './procedure-model';
import type {GrantNode} from '../curation/starting-equipment-model';
import {applyInterestingThing} from './core-interesting-things';

type Def=Omit<ProcedureNode,'signature'|'locked'|'status'|'value'|'faces'|'record'>;
type Quantity={count:number;sides:number;modifier?:number;minimum?:number|null};
export class ProcedureGraph {
  nodes:ProcedureNode[]=[];byKey=new Map<string,ProcedureNode>();pending:ProcedurePending[]=[];
  professions:ProcedureProfession[]=[];languages:ProcedureLanguage[]=[];states:ProcedureStateGrant[]=[];
  programs:ProcedureProgramInstance[]=[];materialBindings:{key:string;referenceId:string|null;definitionKey?:string;adjudicationKey?:string}[]=[];
  things:{key:string;outcomeId:string;application:ReturnType<typeof applyInterestingThing>}[]=[];
  traits:{key:string;name:string;subject:string;sourceId:string}[]=[];notes:{key:string;text:string;subject:string}[]=[];
  appearanceDeltas:{key:string;amount:number;subject:string}[]=[];ageDeltas:{key:string;amount:number;subject:string}[]=[];
  relativeCandidates:{id:string;label:string;depth:number}[]=[];
  root:string;limited=false;initialLifeCount:number|null=null;finalSize:number|null=null;dimensions:{height:number;weight:number;age:number}|null=null;
  constructor(readonly context:ProcedureContext,readonly session:ProcedureSession,readonly state:ProcedureReplayState){this.root=`pc/${state.attempt}`;}
  issue(key:string,code:string,label:string,scope:'creation'|'use'='creation',subject=this.root){this.pending.push({key,code,label,scope,subject});}
  node(def:Def):ProcedureNode|null {
    if(this.byKey.has(def.key))return this.byKey.get(def.key)!;
    if(this.nodes.length>=this.context.policy.maxNodes){if(!this.limited)this.issue('bounds/nodes','execution-bound','Limite de etapas atingido; os resultados existentes foram preservados.');this.limited=true;return null;}
    const parents=def.parents.map(k=>this.byKey.get(k)),ready=parents.every(p=>p?.status==='resolved');
    const signature=procedureSignature({context:this.session.contextSha256,key:def.key,kind:def.kind,tableId:def.tableId,streamId:def.streamId,dice:def.dice,modifier:def.modifier,manualAllowed:def.manualAllowed,options:def.options?.map(o=>[o.id,o.eligible!==false]),minimum:def.minimum,maximum:def.maximum,automaticValue:def.automaticValue,parents:parents.map(p=>[p?.key,p?.record?.id??p?.signature,p?.value])});
    const n:ProcedureNode={...def,signature,locked:this.state.locks.get(def.key)??false,status:ready?'pending':'blocked',value:null,faces:[]};
    this.nodes.push(n);this.byKey.set(n.key,n);
    if(!ready){n.reason='Aguardando etapas anteriores.';return n;}
    if(def.kind==='table'&&this.tableData(def.tableId!)?.streams.find(s=>s.id===(def.streamId??'main'))?.association==='needs-review'){n.status='needs-review';n.reason='Associação da coluna à fonte ainda não verificada.';return n;}
    if(def.automaticValue!==undefined){n.value=def.automaticValue;n.status='resolved';return n;}
    const record=this.state.latest.get(n.key);if(!record)return n;
    if(record.signature!==signature){n.status='needs-review';n.reason='Dependências alteradas; a decisão anterior permanece no histórico.';return n;}
    const result=record.result;
    try{
      if(result.method==='adjudication'){
        if(n.kind!=='adjudication')throw new Error('unexpected adjudication');n.value=result.decision.name;n.record=record;n.status='resolved';return n;
      }
      if(result.method==='manual'||result.method==='application-uniform'){
        if(result.method==='application-uniform'&&!result.consented)throw new Error('missing consent');
        if(n.kind==='table'||n.kind==='profession'){
          if(!n.manualAllowed||result.method==='application-uniform')throw new Error('published roll required');
          if(n.kind==='profession'){
            if(!n.options?.some(o=>o.id===result.value&&o.eligible!==false))throw new Error('profession ineligible');n.value=result.value;
          }else{
            const row=this.tableData(n.tableId!)?.streams.find(s=>s.id===(n.streamId??'main'))?.rows.find(r=>r.id===result.value);if(!row)throw new Error('unknown row');n.value=row.id;n.rowId=row.id;n.text=row.text;n.evidenceIds=row.evidenceIds;
          }
        }else if(n.kind==='choice'){
          const eligible=n.options?.some(o=>o.id===result.value&&o.eligible!==false);
          if(!eligible&&!(n.freeText&&typeof result.value==='string'&&result.value.startsWith('custom:')&&result.value.length>7))throw new Error('choice ineligible');n.value=result.value;
        }else if(n.kind==='number'){
          if(typeof result.value!=='number'||!Number.isFinite(result.value)||result.value<(n.minimum??0)||n.maximum!==null&&n.maximum!==undefined&&result.value>n.maximum)throw new Error('number out of range');n.value=result.value;
        }else throw new Error('recorded dice required');
      }else {
        const faces=result.faces;n.faces=faces;
        if(n.kind==='profession'){
          const table=this.tableData(n.tableId!);if(!table?.dice)throw new Error('profession table missing');
          let child=table,childFaces=faces;
          if(n.tableId!.endsWith('profession-router')){
            if(faces.length!==2||faces[0]<1||faces[0]>table.dice.sides)throw new Error('selector faces invalid');
            const route=table.streams[0].rows.find(r=>(r.min===null||faces[0]>=r.min)&&(r.max===null||faces[0]<=r.max));child=this.tableData(route?.text??'')!;childFaces=faces.slice(1);
          }
          if(!child?.dice||childFaces.length!==child.dice.count||childFaces.some(f=>f<1||f>child.dice!.sides))throw new Error('child dice invalid');
          const total=childFaces.reduce((a,b)=>a+b,0),option=this.context.professions.find(o=>o.tableId===child.id&&o.range&&total>=o.range.min&&total<=o.range.max);
          if(!option||n.options&&!n.options.some(o=>o.id===option.id&&o.eligible!==false))throw new Error('profession missing');n.value=option.id;n.rawTotal=total;n.total=total;n.text=option.sourceText;n.evidenceIds=option.evidenceIds;
        }else {
          const spec=n.kind==='table'?this.tableData(n.tableId!)?.dice:n.dice;
          if(!spec||faces.length!==spec.count||faces.some(f=>f<1||f>spec.sides))throw new Error('faces invalid');
          n.rawTotal=faces.reduce((a,b)=>a+b,0);n.total=n.rawTotal+(n.modifier??n.dice?.modifier??0);
          if(n.kind==='table'){
            const row=this.tableData(n.tableId!)?.streams.find(s=>s.id===(n.streamId??'main'))?.rows.find(r=>(r.min===null||n.total!>=r.min)&&(r.max===null||n.total!<=r.max));
            if(!row)throw new Error('range missing');n.value=row.id;n.rowId=row.id;n.text=row.text;n.evidenceIds=row.evidenceIds;
          }else if(n.kind==='dice')n.value=n.dice?.minimum===null||n.dice?.minimum===undefined?n.total:Math.max(n.dice.minimum,n.total);
          else throw new Error('unexpected dice');
        }
      }
      n.status='resolved';n.record=record;
    }catch{n.status='needs-review';n.value=null;n.reason='Registro incompatível com os dados ou as permissões atuais; preservado para revisão.';}
    return n;
  }
  tableData(id:string){return this.context.tables.find(t=>t.id===id);}
  row(n:ProcedureNode|null){return n?.status==='resolved'&&n.rowId?this.tableData(n.tableId!)?.streams.find(s=>s.id===(n.streamId??'main'))?.rows.find(r=>r.id===n.rowId):undefined;}
  done(n:ProcedureNode|null):n is ProcedureNode{return n?.status==='resolved';}
  table(tableId:string,key:string,parents:string[],subject=this.root,modifier=0,manualAllowed=false,streamId='main'){
    const t=this.tableData(tableId);if(!t){this.issue(key,'source-table-missing','Tabela necessária indisponível; nenhuma fonte substituta foi usada.','creation',subject);return null;}
    return this.node({key,label:tableId.split(':').at(-1)!.replaceAll('-',' '),subject,parents,kind:'table',sourceId:t.sourceId,tableId,streamId,modifier,manualAllowed,evidenceIds:t.evidenceIds});
  }
  dice(key:string,label:string,q:Quantity,parents:string[],subject=this.root,sourceId=this.context.sources.onlyHuman,evidenceIds:string[]=[]){return this.node({key,label,subject,parents,kind:'dice',sourceId,dice:{count:q.count,sides:q.sides,modifier:q.modifier??0,minimum:q.minimum??null},evidenceIds});}
  choice(key:string,label:string,options:{id:string;label:string;eligible?:boolean}[],parents:string[],subject=this.root,freeText=false,sourceId=this.context.sources.onlyHuman){return this.node({key,label,subject,parents,kind:'choice',sourceId,options,freeText,evidenceIds:[]});}
  number(key:string,label:string,minimum:number,maximum:number|null,parents:string[],subject=this.root){return this.node({key,label,subject,parents,kind:'number',sourceId:this.context.sources.onlyHuman,minimum,maximum,evidenceIds:[]});}
  adjudication(key:string,label:string,parents:string[],subject=this.root){return this.node({key,label,subject,parents,kind:'adjudication',sourceId:this.context.sources.onlyHuman,evidenceIds:[]});}
  language(key:string,languageId:string,abilities:ProcedureLanguage['abilities'],subject:string,sourceId:string,evidenceIds:string[]=[]){this.languages.push({key,languageId,abilities,subject,sourceId,evidenceIds});}
  languageChoice(key:string,abilities:ProcedureLanguage['abilities'],parents:string[],subject=this.root,knownOnly=false){
    const known=new Set(this.languages.filter(l=>l.subject===subject&&l.abilities.includes('speak')).map(l=>l.languageId));
    const options=this.context.languageOptions.filter(l=>!knownOnly||known.has(l.id.replace(/^language:/,''))).map(l=>({id:l.id.replace(/^language:/,''),label:l.label}));
    const n=this.choice(key,knownOnly?'Escolher idioma já falado':'Escolher idioma concreto',options,parents,subject,!knownOnly);
    if(this.done(n))this.language(key,String(n.value).replace(/^custom:/,''),abilities,subject,n.sourceId,n.evidenceIds);return n;
  }
  stateGrant(key:string,target:'insanity'|'corruption',amount:number,subject:string,sourceId:string,evidenceIds:string[]=[]){this.states.push({key,target,amount,subject,sourceId,evidenceIds});}
  stateDice(key:string,target:'insanity'|'corruption',q:Quantity,parents:string[],subject=this.root){const n=this.dice(key,`Ganho de ${target}`,q,parents,subject);if(this.done(n))this.stateGrant(key,target,Number(n.value),subject,n.sourceId,n.evidenceIds);return n;}
  profession(key:string,tableId:string,parents:string[],subject=this.root,manualAllowed=false){
    const table=this.tableData(tableId);if(!table){this.issue(key,'profession-table-missing','Tabela profissional indisponível.','creation',subject);return null;}
    const source=table.sourceId;
    const options=this.context.professions.filter(o=>o.sourceId===source&&o.tableId!==null&&(tableId.endsWith('profession-router')||o.tableId===tableId)).map(o=>({id:o.id,label:o.sourceText}));
    const n=this.node({key,label:'Profissão',subject,parents,kind:'profession',sourceId:source,tableId,manualAllowed,options,evidenceIds:table.evidenceIds});
    if(this.done(n))this.professionGrant(key,String(n.value),parents.concat(n.key),subject);return n;
  }
  professionGrant(key:string,optionId:string,parents:string[],subject=this.root,fixedSpecialization?:string,allowedSubchoices?:string[]){
    const option=this.context.professions.find(p=>p.id===optionId);if(!option){this.issue(key,'profession-missing','Concessão profissional não está no lote selecionado.','creation',subject);return;}
    let specialization=fixedSpecialization??'';
    const dependencies=[...parents];
    if(option.specialization!=='none'&&!fixedSpecialization){
      const literate=this.languages.some(l=>l.subject===subject&&l.abilities.includes('read')&&l.abilities.includes('write'));
      const options=option.subchoices.filter(s=>!allowedSubchoices||allowedSubchoices.includes(s.id)).map(s=>({id:s.id,label:s.label,eligible:!s.requiresLiteracy||literate}));
      const n=this.choice(`${key}/specialization`,'Escolher especialização',options,parents,subject,!allowedSubchoices,option.sourceId);dependencies.push(n?.key??'missing');
      if(!this.done(n))return;specialization=String(n.value).replace(/^custom:/,'');
    }
    this.professions.push({key,optionId,specialization,subject,sourceId:option.sourceId,evidenceIds:option.evidenceIds});
    if(option.literacy&&(option.literacy.condition==='always'||['poet','writer'].includes(specialization)))this.languageChoice(`${key}/literacy`,['read','write'],dependencies,subject,true);
    if(subject===this.root){const program=this.context.professionPrograms.find(p=>p.optionId===optionId)?.programId;if(program)this.program(`${key}/gear`,program,dependencies,subject);}
  }
  program(key:string,programId:string,parents:string[],subject=this.root){
    const program=this.context.programs.find(p=>p.id===programId);if(!program){this.issue(key,'program-missing','Programa material indisponível.','creation',subject);return;}
    this.programs.push({eventId:key,programId,subject:subject===this.root?'pc':'family'});
    const visit=(nodes:GrantNode[],prefix:string,path:string,deps:string[])=>{
      for(const grant of nodes){const k=`${prefix}/${grant.key}`,p=`${path}/${grant.key}`;
        if(grant.kind==='choice'){
          const n=this.choice(k,'Escolher alternativa de equipamento',grant.options.map(o=>({id:o.id,label:o.label})),deps,subject,false,program.sourceId);
          if(this.done(n)){const selected=grant.options.find(o=>o.id===n.value)!;visit(selected.grants,`${k}/${selected.id}`,`${p}/${selected.id}`,[n.key]);}continue;
        }
        const quantity=grant.kind==='money'?grant.amount:grant.quantity,quantityKey=`${k}/${grant.kind==='money'?'amount':'quantity'}`;
        const quantityNode=quantity.kind==='dice'?this.dice(quantityKey,'Quantidade inicial',quantity,deps,subject,program.sourceId,program.evidenceIds):null;
        if(grant.kind==='record'&&grant.worth?.amount.kind==='dice')this.dice(`${k}/worth`,'Valor patrimonial',grant.worth.amount,deps,subject,program.sourceId,program.evidenceIds);
        if(grant.kind==='money')continue;
        const ref=this.context.itemReferences.find(r=>r.originId===programId&&r.path===`grant${p}`),binding:{key:string;referenceId:string|null;definitionKey?:string;adjudicationKey?:string}={key:k,referenceId:ref?.id??null};
        if(!ref)this.issue(k,'material-reference-missing','Vínculo material sem definição no lote.','creation',subject);
        else if(ref.resolution==='choice-required'){
          const d=this.choice(`${k}/definition`,'Escolher definição de equipamento',ref.candidateItemIds.map(id=>({id,label:this.context.itemDefinitions.find(i=>i.id===id)?.name??id})),[...deps,...(quantityNode?[quantityNode.key]:[])],subject,false,program.sourceId);binding.definitionKey=d?.key;
        }
        // Named GM/user-selected gear is identified concretely; generic published grants remain editable records.
        if(['extra:minor-windfall-15','extra:major-windfall-5','extra:major-windfall-1-fallback','extra:major-windfall-16'].includes(programId)){
          const d=this.adjudication(`${k}/identity`,'Identificar o ganho com autoria e contexto',deps,subject);binding.adjudicationKey=d?.key;
        }
        this.materialBindings.push(binding);
      }
    };visit(program.grants,key,'',parents);
  }
  template(parent:ProcedureNode,subject:string,familyProfession?:string|null,orphan=false,familyPending=false){
    for(const template of this.context.templates.filter(t=>t.rowIds.includes(parent.rowId??''))){
      const key=`${parent.key}/template/${template.id}`,parents=[parent.key];
      for(const language of template.languages??[])this.language(`${key}/${language.languageId}`,language.languageId,language.abilities,subject,template.sourceId,template.evidenceIds);
      if(template.languageChoice)this.languageChoice(`${key}/language`,template.languageChoice.abilities,parents,subject);
      if(template.professionRoll&&!template.professionRoll.repeat)this.profession(`${key}/profession`,template.professionRoll.tableId,parents,subject);
      if(template.professionChoice){const choice=template.professionChoice;
        if(choice.optionId)this.professionGrant(`${key}/profession`,choice.optionId,parents,subject);
        else if(choice.categories){const category=this.choice(`${key}/category`,'Escolher categoria permitida',choice.categories.map(id=>({id,label:id})),parents,subject);if(this.done(category))this.profession(`${key}/profession`,`only-human:${category.value}`,[category.key],subject);}
        else if(choice.options){const option=this.choice(`${key}/profession-choice`,'Escolher profissão dirigida',choice.options.map(o=>({id:o.optionId,label:this.context.professions.find(p=>p.id===o.optionId)?.sourceText??o.optionId})),parents,subject);if(this.done(option)){const selected=choice.options.find(o=>o.optionId===option.value)!;this.professionGrant(`${key}/profession`,selected.optionId,[option.key],subject,selected.specialization);}}
      }
      if(template.professionGrant){const grant=template.professionGrant;
        if(grant.kind==='inherit-family-profession'){
          if(familyPending)continue;
          if(familyProfession){const family=this.professions.find(p=>p.optionId===familyProfession&&p.subject===`${subject}/family-origin`),dependencies=this.nodes.filter(n=>n.key.startsWith(`${subject}/family-profession/`)).map(n=>n.key);if(family)this.professionGrant(`${key}/inherited`,familyProfession,[...parents,...dependencies],subject,family.specialization||undefined);}
          else if(orphan&&grant.orphanFallbackCategories){const category=this.choice(`${key}/orphan-category`,'Escolher categoria do caso órfão',grant.orphanFallbackCategories.map(id=>({id,label:id})),parents,subject);if(this.done(category))this.profession(`${key}/inherited`,`only-human:${category.value}`,[category.key],subject);}
          else {const decision=this.adjudication(`${key}/family-context`,'Definir profissão familiar ausente na instrução, com autoria e contexto',parents,subject);if(this.done(decision)){const definition=decision.record?.result.method==='adjudication'?decision.record.result.decision.definitionId:undefined;if(definition&&this.context.professions.some(p=>p.id===definition&&p.sourceFamily==='only-human'))this.professionGrant(`${key}/inherited`,definition,[decision.key],subject);else this.issue(`${key}/family-context`,'family-profession-definition-required','Identifique uma profissão Only Human válida na decisão.','creation',subject);}}
        }else if(grant.optionId&&!(grant.ifNotAlreadyPresent&&this.professions.some(p=>p.subject===subject&&p.optionId===grant.optionId&&p.specialization===(grant.specialization??''))))this.professionGrant(`${key}/granted`,grant.optionId,parents,subject,grant.specialization);
      }
      if(template.additionalChoice){const options=template.additionalChoice.options,n=this.choice(`${key}/additional`,'Escolher benefício da educação',options.map(o=>({id:o.optionId,label:this.context.professions.find(p=>p.id===o.optionId)?.sourceText??o.optionId})),parents,subject);if(this.done(n)){const selected=options.find(o=>o.optionId===n.value)!;this.professionGrant(`${key}/additional-profession`,selected.optionId,[n.key],subject,undefined,selected.allowedSubchoices);}}
      if(template.exclusiveChoice){const n=this.choice(`${key}/exclusive`,'Escolher um benefício exclusivo',template.exclusiveChoice.map((o,i)=>({id:String(i),label:o.languageChoice?'Idioma falado':'Campo de scholarship aleatório'})),parents,subject);if(this.done(n)){const selected=template.exclusiveChoice[Number(n.value)];if(selected.languageChoice)this.languageChoice(`${key}/language`,selected.languageChoice.abilities,[n.key],subject);if(selected.professionRoll)this.profession(`${key}/profession`,selected.professionRoll.tableId,[n.key],subject);}}
      if(template.countRoll){const count=this.dice(`${key}/count`,'Vidas anteriores lembradas',template.countRoll,parents,subject);if(this.done(count)&&template.professionRoll?.repeat)for(let i=0;i<Number(count.value);i++)this.profession(`${key}/previous-life/${i}`,template.professionRoll.tableId,[count.key],subject);}
    }
  }
  thing(key:string,parents:string[],subject=this.root){
    const variant=this.context.thingVariants.find(v=>v.id===this.state.config.interestingVariant);if(!variant){this.issue(key,'interesting-source-disabled','Fonte de Interesting Things indisponível; não houve fallback.','creation',subject);return;}
    const selector=this.table(variant.selectorId,`${key}/selector`,parents,subject,0,this.state.config.procedure==='core');
    if(!this.done(selector))return;
    const row=this.row(selector),route=variant.routes.find(r=>selector.total!==undefined?selector.total>=r.min&&selector.total<=r.max:row?.min!==null&&row?.min!==undefined&&row.min>=r.min&&row.min<=r.max);
    if(!route){this.issue(key,'interesting-route-missing','Rota de Interesting Things indisponível.','creation',subject);return;}
    const outcome=this.table(route.tableId,`${key}/result`,[selector.key],subject,0,this.state.config.procedure==='core');if(!this.done(outcome))return;
    const thing=this.context.thingTables.find(t=>t.id===route.tableId)?.outcomes.find(o=>o.id===outcome.rowId),plan=this.context.thingPlans.find(p=>p.outcomeId===outcome.rowId);
    if(!thing||!plan){this.issue(key,'interesting-handler-missing','Resultado sem contrato consumível.','creation',subject);return;}
    const choices:Record<string,string>={},rolls:Record<string,number[]>={};
    for(const choice of thing.details.choices){const n=this.choice(`${key}/${thing.id}/${choice.id}`,'Escolher alternativa de Interesting Thing',choice.options.map(o=>({id:o.id,label:o.text})),[outcome.key],subject,false,thing.sourceId);if(this.done(n))choices[`interesting/${choice.id}`]=String(n.value);}
    const selected=new Set(Object.values(choices));
    for(const roll of thing.details.sideRolls)if(roll.phase==='creation'&&(roll.optionId===null||selected.has(roll.optionId))){const n=this.dice(`${key}/${thing.id}/${roll.id}`,roll.purpose,roll,[outcome.key,...thing.details.choices.map(c=>`${key}/${thing.id}/${c.id}`)],subject,thing.sourceId,thing.evidenceIds);if(this.done(n))rolls[`interesting/${thing.id}/${roll.id}`]=n.faces;}
    let decision:unknown;
    if(thing.details.gmChoice){const n=this.adjudication(`${key}/${thing.id}/gm`,'Identificar a arma escolhida pelo mestre',[outcome.key],subject);if(this.done(n)&&n.record?.result.method==='adjudication'){const d=n.record.result.decision;if(d.definitionId&&!this.context.itemDefinitions.some(i=>i.id===d.definitionId&&i.weapon)){this.issue(n.key,'gm-weapon-definition-required','A decisão precisa identificar uma arma válida.','creation',subject);}else decision={outcomeId:thing.id,author:d.author,reason:d.reason,definition:d.definitionId?{kind:'published',itemId:d.definitionId}:{kind:'generic',name:d.name}};}}
    // Alias only this grant's inputs into the existing handler; outputs receive the independent grant identity.
    const handlerChoices=Object.fromEntries(thing.details.choices.filter(c=>choices[`interesting/${c.id}`]).map(c=>[`interesting/${thing.id}/${c.id}`,choices[`interesting/${c.id}`]]));
    const readyRolls=thing.details.sideRolls.filter(r=>r.phase==='creation'&&(r.optionId===null||selected.has(r.optionId))).every(r=>rolls[`interesting/${thing.id}/${r.id}`]);
    if(!readyRolls)return;
    const application=applyInterestingThing(plan,thing,handlerChoices,rolls,decision);
    this.things.push({key,outcomeId:thing.id,application});
    for(const p of application.pending)this.issue(`${key}/${p.key}`,p.code,p.label,p.scope,subject);
  }
  finish(){for(const n of this.nodes)if(n.status!=='resolved')this.issue(n.key,n.status==='needs-review'?'dependency-review':n.status==='blocked'?'prior-step':'choice-or-roll',n.reason??`Resolver: ${n.label}`,'creation',n.subject);return this;}
}

export function buildProcedureGraph(context:ProcedureContext,session:ProcedureSession,state:ProcedureReplayState){
  const b=new ProcedureGraph(context,session,state),c=state.config,root=b.root;
  for(const field of ['variant','attributeMode','procedure','interestingVariant','size','increase','adjustment','coreBenefit'] as const)b.node({key:`config/${field}`,label:field,subject:root,parents:[],kind:'config',sourceId:context.sources.core,automaticValue:JSON.stringify(c[field]),evidenceIds:[]});
  const packs=context.mechanicalPacks as HumanL0MechanicalPack[],pack=packs.find(p=>p.entities[0].mechanics.variant===c.variant);
  if(!pack){b.issue('mechanics','ancestry-source-missing','Base mecânica da variante indisponível.');return b.finish();}
  b.language(`${root}/base-language`,pack.entities[0].mechanics.baseLanguage.languageId,['speak'],root,pack.source.id);
  if(c.attributeMode==='random')for(const attribute of ['strength','agility','intellect','will'])b.dice(`${root}/attribute/${attribute}`,`Atributo: ${attribute}`,pack.entities[0].mechanics.attributes.random!.dice,['config/variant','config/attributeMode'],root,pack.source.id);
  if(c.procedure==='core'){
    if(c.coreBenefit==='speak-language')b.languageChoice(`${root}/core-benefit/language`,['speak'],['config/variant','config/procedure'],root);
    const professionKeys=[];
    for(let i=0;i<2+(c.coreBenefit==='random-profession'?1:0);i++){const key=`${root}/core/profession/${i}`;professionKeys.push(key);b.profession(key,'core:profession-router',['config/procedure','config/variant'],root,i<2);}
    const wealth=b.table('core:wealth',`${root}/core/wealth`,['config/procedure'],root,0,true);
    if(b.done(wealth)){const row=b.row(wealth)!,lifestyle=row.id.split(':').at(-1)!,program=context.lifestylePrograms.find(p=>p.procedure==='core'&&p.lifestyle===lifestyle);if(program)b.program(`${wealth.key}/kit`,program.programId,[wealth.key]);}
    b.thing(`${root}/thing/initial`,['config/procedure','config/interestingVariant']);
    for(const id of c.optionalCoreTables){
      if(id==='core:role-traits'){
        for(const [stream,count] of [['positive',2],['negative',1]] as const)for(let i=0;i<count;i++)b.table(id,`${root}/optional/${id}/${stream}/${i}`,['config/procedure'],root,0,true,stream);
        continue;
      }
      if(!id.startsWith('core:human-')&&!b.tableData(id)?.activation.includes('optional')){b.issue(id,'optional-table-not-eligible','Esta tabela não é uma opção narrativa Core.');continue;}
      const table=b.table(id,`${root}/optional/${id}`,['config/procedure'],root,0,true);
      if(b.done(table))applyCoreOptional(b,table);
    }
    b.finalSize=c.size;
  }else buildHumanDevelopment(b,root,0);
  return b.finish();
}
function applyCoreOptional(b:ProcedureGraph,parent:ProcedureNode){
  if(parent.tableId!=='core:human-background')return;
  const plan=b.context.backgroundPlans.find(p=>p.rowId===parent.rowId);if(!plan){b.issue(parent.key,'background-plan-missing','Consequências de Background indisponíveis.');return;}
  if(plan.state){if(plan.state.dice)b.stateDice(`${parent.key}/state`,plan.state.target,plan.state.dice,[parent.key],parent.subject);else b.stateGrant(`${parent.key}/state`,plan.state.target,plan.state.amount!,parent.subject,plan.sourceId,plan.evidenceIds);}
  if(plan.detail)b.dice(`${parent.key}/${plan.detail.key}`,plan.detail.key,plan.detail.dice,[parent.key],parent.subject);
  if(plan.programId)b.program(`${parent.key}/material`,plan.programId,[parent.key]);
  b.template(parent,parent.subject);
  if(plan.keepsake)b.notes.push({key:`${parent.key}/keepsake`,text:parent.text??'',subject:parent.subject});
  if(plan.appearanceChoice)b.choice(`${parent.key}/appearance`,'Marca física',[{id:'finger',label:'Dedo'},{id:'teeth',label:'Dentes'},{id:'ear',label:'Orelha'},{id:'scar',label:'Cicatriz'}],[parent.key]);
}

function buildHumanDevelopment(b:ProcedureGraph,subject:string,depth:number):void {
  // Implemented below: source-declared roots, conditional children and subject-scoped grants.
  buildDevelopmentSubject(b,subject,depth);
}

function buildDevelopmentSubject(b:ProcedureGraph,subject:string,depth:number):void {
  if(depth>b.context.policy.maxRelativeDepth){b.issue(`${subject}/bounds`,'relative-depth-bound','Limite de detalhamento de parentes atingido; o resultado de Fate permanece registrado.','creation',subject);return;}
  const c=b.state.config,baseParents=['config/procedure'];
  b.table('only-human:ancestors',`${subject}/ancestors`,baseParents,subject);
  const family=b.table('only-human:family-circumstances',`${subject}/family`,baseParents,subject),familyRow=b.row(family);
  let familyProfession:ProcedureNode|null=null;
  const familyResult=familyRow?.min;
  if(b.done(family)&&familyResult!==undefined&&familyResult!==null&&familyResult>=6&&familyResult<=17){
    const categories=familyResult<=8?['common','criminal','military','wilderness']:['common','military','religious','wilderness'];
    const category=b.choice(`${subject}/family-profession/category`,'Categoria profissional da família',categories.map(id=>({id,label:id})),[family.key],subject);
    if(b.done(category))familyProfession=b.profession(`${subject}/family-profession/result`,`only-human:${category.value}`,[category.key],`${subject}/family-origin`);
  }
  const parents=b.table('only-human:parents',`${subject}/parents`,baseParents,subject),parentRow=b.row(parents);
  if(b.done(parents)&&parentRow){
    const dead=parentRow.min===3?['father','mother']:parentRow.min===5?['father']:parentRow.min===13?['mother']:[];
    for(const parent of dead)b.table('only-human:death',`${subject}/parent/${parent}/death`,[parents.key],`${subject}/parent/${parent}`);
  }
  const siblings=b.table('only-human:siblings',`${subject}/siblings`,baseParents,subject),siblingsRow=b.row(siblings);
  let siblingCount:number|null=null,countKey=siblings?.key??'';
  if(b.done(siblings)&&siblingsRow){
    if(siblingsRow.min===1)siblingCount=0;
    else if(siblingsRow.min===5)siblingCount=1;
    else {const q=siblingsRow.min===9?{count:1,sides:3,modifier:1}:siblingsRow.min===13?{count:1,sides:6,modifier:2}:{count:2,sides:6};const count=b.dice(`${siblings.key}/count`,'Quantidade de irmãos',q,[siblings.key],subject);countKey=count?.key??'';if(b.done(count))siblingCount=Number(count.value);}
  }
  if(siblingCount!==null)for(let i=0;i<siblingCount&&!b.limited;i++){
    const related=`${subject}/sibling/${i}`;
    b.table('only-human:sibling-gender',`${related}/gender`,[countKey],related);
    b.table('only-human:sibling-age',`${related}/relative-age`,[countKey],related);
    relatedFate(b,related,[countKey],depth,true);
  }
  const age=b.table('only-human:age',`${subject}/age`,baseParents,subject),ageRow=b.row(age);
  const build=b.table('only-human:build',`${subject}/build`,[age?.key??'missing-age'],subject);
  const appearance=b.table('only-human:appearance',`${subject}/appearance`,[age?.key??'missing-age'],subject);
  const modifier=familyRow?.min===3?-6:familyRow?.min===4?-3:familyRow?.min===6?-1:familyRow?.min===13?1:familyRow?.min===16?3:familyRow?.min===18?6:0;
  const childhood=b.table('only-human:childhood',`${subject}/childhood`,[age?.key??'missing-age',family?.key??'missing-family'],subject,modifier);
  if(b.done(childhood)){
    const familyPending=familyResult!==undefined&&familyResult!==null&&familyResult>=6&&familyResult<=17&&(!b.done(familyProfession)||!b.professions.some(p=>p.subject===`${subject}/family-origin`));
    b.template(childhood,subject,b.done(familyProfession)?String(familyProfession.value):null,familyResult===3,familyPending);
  }
  const ageRanges=[{min:0,max:11,count:0},{min:12,max:17,count:1},{min:18,max:25,count:2},{min:26,max:35,count:3},{min:36,max:55,count:4},{min:56,max:75,count:5},{min:76,max:null,count:6}];
  const ageIndex=ageRow?b.tableData('only-human:age')!.streams[0].rows.findIndex(r=>r.id===ageRow.id):-1;
  const band=ageRanges[ageIndex];if(subject===b.root)b.initialLifeCount=band?.count??null;
  const lifeNodes:ProcedureNode[]=[];
  if(band&&b.done(age)){
    const childDependencies=b.nodes.filter(n=>n.subject===subject&&n.key.startsWith(`${subject}/childhood`)).map(n=>n.key);
    if(familyProfession)childDependencies.push(familyProfession.key);
    for(let i=0;i<band.count&&!b.limited;i++){
      const previous=b.nodes.filter(n=>n.subject===subject&&n.key.startsWith(`${subject}/life/`)).map(n=>n.key);
      const life=b.table('only-human:life',`${subject}/life/${i}`,[age.key,...childDependencies,...previous],subject);
      if(b.done(life)){lifeNodes.push(life);lifeEvent(b,life,subject);}
    }
    // Optional fate of children is explicitly after the initial Life Experience sequence.
    if(lifeNodes.length===band.count)for(const life of lifeNodes){
      const event=b.byKey.get(`${life.key}/detail`);
      if(event?.tableId==='only-human:minor-windfall'&&b.row(event)?.min===3){
        const children=b.byKey.get(`${event.key}/children`);
        if(children&&b.done(children)){const option=b.choice(`${event.key}/children-fate`,'Detalhar Fate dos filhos',[{id:'no',label:'Sem Fate adicional'},{id:'yes',label:'Rolar Fate de cada filho'}],[children.key,...lifeNodes.map(n=>n.key)],subject);
          if(b.done(option)&&option.value==='yes')for(let j=0;j<Number(children.value);j++)relatedFate(b,`${event.key}/child/${j}`,[option.key],depth,false);}
      }
    }
  }
  const lifeDependencies=b.nodes.filter(n=>n.subject===subject&&n.key.startsWith(`${subject}/life/`)).map(n=>n.key);
  const lifestyle=b.table('only-human:lifestyle',`${subject}/lifestyle`,[age?.key??'missing-age',childhood?.key??'missing-childhood',...lifeDependencies],subject,lifestyleModifier(b,subject));
  if(b.done(lifestyle)){
    const row=b.row(lifestyle)!,key=row.id.split(':').at(-1)!;
    const program=b.context.lifestylePrograms.find(p=>p.procedure==='only-human'&&p.lifestyle===key);
    if(program)b.program(`${lifestyle.key}/kit`,program.programId,[lifestyle.key],subject);
    for(const lookup of b.context.lookups)b.node({key:`${subject}/lookup/${lookup.tableId}`,label:lookup.tableId,subject,parents:[lifestyle.key],kind:'lookup',sourceId:b.context.sources.onlyHuman,automaticValue:key,text:lookup.rows.find(r=>r.key===key)?.text,evidenceIds:lookup.rows.find(r=>r.key===key)?.evidenceIds??[]});
    if(subject===b.root)b.thing(`${subject}/thing/initial`,[lifestyle.key,'config/interestingVariant'],subject);
  }
  for(const id of ['personality','relationships','fears','desires','obligations','morality'])b.table(`only-human:${id}`,`${subject}/${id}`,baseParents,subject);
  let religion=b.table('only-human:religion',`${subject}/religion/0`,baseParents,subject);
  let priorPiety:string|null=null,threes=0;
  for(let i=0;i<b.context.policy.maxCycleSteps&&!b.limited;i++){
    const piety=b.table('only-human:piety',`${subject}/piety/${i}`,[religion?.key??'missing-religion',...(priorPiety?[priorPiety]:[])],subject);
    if(!b.done(piety))break;
    const row=b.row(piety)!;
    if(row.min===3){if(threes>0)b.stateGrant(`${piety.key}/insanity`,'insanity',1,subject,piety.sourceId,piety.evidenceIds);threes++;priorPiety=piety.key;religion=b.table('only-human:religion',`${subject}/religion/${i+1}`,[piety.key],subject);
      if(i===b.context.policy.maxCycleSteps-1)b.issue(piety.key,'piety-cycle-bound','Piety atingiu o limite; resultados e crenças anteriores foram preservados.','creation',subject);
    }else{if(row.min===18)b.stateGrant(`${piety.key}/insanity`,'insanity',1,subject,piety.sourceId,piety.evidenceIds);break;}
  }
  if(band&&b.done(age)&&b.done(build))composeDimensions(b,subject,age,build,band);
  if(b.done(appearance)){
    const rows=b.tableData(appearance.tableId!)!.streams[0].rows,index=rows.findIndex(r=>r.id===appearance.rowId),delta=b.appearanceDeltas.filter(d=>d.subject===subject).reduce((s,d)=>s+d.amount,0);
    if(delta)b.notes.push({key:`${subject}/appearance-final`,text:rows[Math.max(0,Math.min(rows.length-1,index+delta))].text,subject});
  }
}
function relatedFate(b:ProcedureGraph,subject:string,parents:string[],depth:number,canDetail:boolean){
  const fate=b.table('only-human:character-fate',`${subject}/fate`,parents,subject),row=b.row(fate);
  if(!b.done(fate)||!row)return;
  if(row.min===6)b.table('only-human:death',`${subject}/death`,[fate.key],subject);
  if(canDetail&&row.min!==null&&row.min>=9){
    b.relativeCandidates.push({id:subject,label:subject,depth:depth+1});
    if(b.state.config.relativeDetails.includes(subject))buildDevelopmentSubject(b,subject,depth+1);
  }
}
function lifestyleModifier(b:ProcedureGraph,subject:string){
  let total=0;
  for(const n of b.nodes.filter(n=>n.subject===subject&&n.status==='resolved'&&n.key.startsWith(`${subject}/life/`))){const result=b.row(n)?.min;
    if(n.tableId==='only-human:life'&&result===9)total++;
    if(n.tableId==='only-human:major-setback')total+=result===5||result===8?-3:result===10?-1:0;
    if(n.tableId==='only-human:minor-setback'&&[4,10,19].includes(result??-1))total--;
    if(n.tableId==='only-human:minor-windfall'&&[2,7].includes(result??-1))total++;
    if(n.tableId==='only-human:major-windfall'&&[4,13].includes(result??-1))total+=3;
  }return total;
}
function lifeEvent(b:ProcedureGraph,life:ProcedureNode,subject:string){
  const row=b.row(life)!,r=row.min!;
  if(r===3){
    b.table('only-human:death',`${life.key}/death`,[life.key],subject);
    const options=[{id:'return',label:'Retornar à vida e registrar Insanity'},{id:'restart',label:'Recomeçar preservando o histórico'},...(b.state.config.supplements.includes('tombs')?[{id:'transformation',label:'Transformação de Tombs of the Desolation (requer handler)'}]:[])];
    const choice=b.choice(`${life.key}/death-choice`,'Resolver a morte do personagem',options,[life.key],subject);
    if(b.done(choice)){if(choice.value==='return')b.stateDice(`${life.key}/return-insanity`,'insanity',{count:1,sides:6},[choice.key],subject);else b.issue(choice.key,choice.value==='restart'?'restart-required':'ancestry-transformation-handler',choice.value==='restart'?'Confirme o reinício para criar uma nova tentativa sem apagar esta história.':'A transformação precisa de um handler da ancestralidade escolhida; a base Human não é aplicada como se fosse a nova ancestralidade.','creation',subject);}return;
  }
  if(r===9){const professions=b.professions.filter(p=>p.subject===subject);b.choice(`${life.key}/worked`,'Profissão em que trabalhou',professions.map(p=>({id:p.key,label:b.context.professions.find(o=>o.id===p.optionId)?.sourceText??p.optionId})),[life.key],subject);return;}
  const table=r===4?'major-setback':r===6?'minor-setback':r===13?'minor-windfall':r===16?'major-windfall':'strange';
  let detail=b.table(`only-human:${table}`,`${life.key}/detail`,[life.key],subject);
  if(table==='strange')for(let i=0;i<b.context.policy.maxCycleSteps;i++){
    if(!b.done(detail)||b.row(detail)?.min!==19||b.state.config.supplements.includes('tooth-and-claw'))break;
    if(i===b.context.policy.maxCycleSteps-1){b.issue(detail.key,'strange-cycle-bound','Strange atingiu o limite de rerolls publicados; o 19 não foi apagado.','creation',subject);return;}
    detail=b.table('only-human:strange',`${life.key}/strange-reroll/${i}`,[detail.key],subject);
  }
  if(!b.done(detail))return;applyDevelopmentResult(b,detail,subject);
}
function applyDevelopmentResult(b:ProcedureGraph,n:ProcedureNode,subject:string){
  const row=b.row(n)!,r=row.min!,key=n.key,parents=[key],table=n.tableId!,source=n.sourceId;
  const fixed=(target:'insanity'|'corruption',amount:number,suffix=target)=>b.stateGrant(`${key}/${suffix}`,target,amount,subject,source,n.evidenceIds);
  const amount=(suffix:string,label:string,q:Quantity,age=false)=>{const d=b.dice(`${key}/${suffix}`,label,q,parents,subject,source,n.evidenceIds);if(b.done(d)){if(age)b.ageDeltas.push({key:d.key,amount:Number(d.value),subject});else b.notes.push({key:d.key,text:`${label}: ${d.value}`,subject});}return d;};
  const optionalComplication=(name:string)=>{if(b.state.config.supplements.includes('companion')){const choice=b.choice(`${key}/complication`,'Complicação opcional',[{id:'none',label:'Sem complicação adicional'},{id:'include',label:name}],parents,subject);if(b.done(choice)&&choice.value==='include')b.issue(choice.key,'complication-handler-required',`Aplicação de ${name} requer dados/handler da expansão.`,'creation',subject);}};
  b.template(n,subject);
  if(table==='only-human:major-setback'){
    if(r===1)b.stateDice(`${key}/corruption`,'corruption',{count:1,sides:6},parents,subject);
    if([2,4].includes(r))fixed('corruption',1);
    if(r===4&&b.state.config.supplements.includes('companion'))optionalComplication('Possessed');
    if([6,9,17].includes(r))b.appearanceDeltas.push({key,amount:r===6?-2:-1,subject});
    if(r===6)optionalComplication('Plagued');if(r===9)optionalComplication('Maimed');
    if(r===7){amount('years','Anos acrescentados pela prisão',{count:2,sides:6},true);const choice=b.choice(`${key}/guilt`,'Responsabilidade pelo crime',[{id:'guilty',label:'Cometeu o crime'},{id:'innocent',label:'Não cometeu o crime'}],parents,subject);if(b.done(choice)){if(choice.value==='guilty')fixed('corruption',1);else b.stateDice(`${key}/insanity`,'insanity',{count:1,sides:3},[choice.key],subject);}}
    if(r===9){const choice=b.choice(`${key}/injury`,'Lesão sofrida',[{id:'eye',label:'Olho'},{id:'ear',label:'Orelha'},{id:'fingers',label:'Dedos'},{id:'hand',label:'Mão'}],parents,subject);if(b.done(choice)&&choice.value==='fingers')b.dice(`${key}/fingers`,'Quantidade de dedos',{count:1,sides:3},[choice.key],subject);}
    if(r===13)amount('years','Anos narrativos de exílio',{count:2,sides:6});
    if(r===14)b.stateDice(`${key}/insanity`,'insanity',{count:1,sides:3},parents,subject);
    if(r===15)amount('years','Anos narrativos de escravidão',{count:1,sides:6});
    if(r===16){b.stateDice(`${key}/insanity`,'insanity',{count:1,sides:6,modifier:1},parents,subject);optionalComplication('Mad');}
    if(r===10)optionalComplication('Cursed');
    if(r===19)b.choice(`${key}/faith`,'Religião do local profanado',[],parents,subject,true);
    if(r===20)b.adjudication(`${key}/nemesis`,'Criar o inimigo com o mestre',parents,subject);
  }
  if(table==='only-human:minor-setback'){
    if(r===3)b.choice(`${key}/injury`,'Marca física',[{id:'ear',label:'Orelha'},{id:'teeth',label:'Dentes'},{id:'finger',label:'Dedo'},{id:'scars',label:'Cicatrizes'}],parents,subject);
    if(r===7)fixed('insanity',1);if(r===12)fixed('corruption',1);if(r===11)optionalComplication('Addicted');
    if(r===13)amount('responsibility','Responsabilidade: ímpar personagem, par amigo',{count:1,sides:6});
    if(r===14)b.adjudication(`${key}/secret`,'Definir o segredo com o mestre',parents,subject);
    if(r===15)amount('years','Anos narrativos sem memória',{count:1,sides:6});
  }
  if(table==='only-human:minor-windfall'){
    if(r===3)amount('children','Quantidade de filhos',{count:1,sides:3});
    if([1,5,17,20].includes(r))b.adjudication(`${key}/person`,'Identificar a relação com o mestre',parents,subject);
    if(r===5)b.choice(`${key}/connection`,'Benefício da conexão',['influence','information','security'].map(id=>({id,label:id})),parents,subject);
    if(r===10&&subject===b.root)b.thing(`${key}/thing/additional`,[key,'config/interestingVariant'],subject);
    if(r===14)b.traits.push({key,name:'Fortune',subject,sourceId:source});
    if([11,12].includes(r))b.issue(`${key}/use`,'conditional-community-benefit','O benefício comunitário mantém suas condições publicadas e depende do contexto de uso.','use',subject);
  }
  if(table==='only-human:major-windfall'){
    if([1,2,3,5,6,8,12,14,18].includes(r))b.adjudication(`${key}/gm`,'Definir o benefício com o mestre',parents,subject);
    if(r===1&&b.state.config.supplements.includes('terrible-beauty'))b.issue(`${key}/favor`,'terrible-beauty-favor-generator','A fonte escolhida exige o gerador de favor de Terrible Beauty; nenhum objeto substituto foi concedido.','creation',subject);
    if(r===2)b.issue(`${key}/tradition`,'tradition-discovery-handler','A tradição escolhida precisa de uma definição mecânica antes de alterar capacidades mágicas.','creation',subject);
    if([11,15,20].includes(r))b.issue(`${key}/use`,'conditional-resource-use','Recurso contextual preservado; duração, invocação ou uso posterior não são rolados na criação.','use',subject);
  }
  if(table==='only-human:strange'){
    if(r===1)amount('years','Anos acrescentados entre faeries',{count:1,sides:20},true);
    if(r===2)b.choice(`${key}/color`,'Cor de pele após a transformação',[],parents,subject,true);
    if([3,7].includes(r))b.adjudication(`${key}/gm`,'Identificar o encontro com o mestre',parents,subject);
    if(r===5)b.issue(`${key}/fate-use`,'first-fate-roll-choice','A escolha entre duas rolagens aplica-se ao primeiro fate roll em jogo; não altera Character Fate de parentes.','use',subject);
    if([6,16,20].includes(r)){
      const branch=amount('branch','Ramo do encontro',{count:1,sides:6});
      if(b.done(branch)){const face=Number(branch.value);if(r===6&&face===1){b.traits.push({key,name:'Shadowsight',subject,sourceId:source});b.stateDice(`${key}/corruption`,'corruption',{count:1,sides:3},[branch.key],subject);}if(r===16&&face>=2&&face<=5)fixed('insanity',face);if(r===16&&face===1)b.notes.push({key:`${key}/religion`,text:'Religião alterada para Devil neste evento; conservar a história das crenças.',subject});if(r===20&&face===1)fixed('insanity',1);}
    }
    if(r===8)optionalComplication('Haunted');
    if([11,13,14].includes(r))b.stateDice(`${key}/insanity`,'insanity',{count:1,sides:3},parents,subject);
    if(r===12)amount('scars','Quantidade de cicatrizes',{count:1,sides:6});
    if(r===14)fixed('corruption',1);
    if(r===15)amount('years','Anos acrescentados no peixe',{count:1,sides:6},true);
    if(r===19)b.issue(`${key}/skinchanger`,'skinchanger-handler','Tooth and Claw está em uso; o resultado exige o handler de skinchanger, sem reroll substituto.','creation',subject);
  }
  const trigger=`${table}-${r}`;
  for(const extra of b.context.extraPrograms.filter(p=>p.trigger===trigger)){
    if(extra.condition&&b.state.config.supplements.includes('terrible-beauty'))continue;
    b.program(`${key}/extra/${extra.programId}`,extra.programId,parents,subject);
  }
}
function composeDimensions(b:ProcedureGraph,subject:string,age:ProcedureNode,build:ProcedureNode,band:{min:number;max:number|null;count:number}){
  const exact=b.number(`${subject}/exact-age`,'Idade inicial exata',band.min,band.max,[age.key],subject);
  const baseline=b.choice(`${subject}/dimension-base`,'Base de medidas (independente do gênero narrativo)',[{id:'male',label:'Base publicada: 70 in / 160 lb'},{id:'female',label:'Base publicada: 63 in / 120 lb'},{id:'custom',label:'Medidas-base informadas'}],[build.key],subject);
  const result=b.row(build)!.min!;let delta=0;
  const dice=result===3||result===18?{count:4,sides:6}:result===4||result===16?{count:3,sides:6}:result===6||result===13?{count:4,sides:6}:null;
  if(dice){const rolled=b.dice(`${build.key}/dimension-change`,'Alteração de medida de Build',dice,[build.key],subject);if(!b.done(rolled))return;delta=Number(rolled.value);}
  if(!b.done(exact)||!b.done(baseline))return;
  let height=baseline.value==='male'?70:63,weight=baseline.value==='male'?160:120;
  if(baseline.value==='custom'){const h=b.number(`${subject}/base-height`,'Altura-base em polegadas',0.01,null,[baseline.key],subject),w=b.number(`${subject}/base-weight`,'Peso-base em libras',0.01,null,[baseline.key],subject);if(!b.done(h)||!b.done(w))return;height=Number(h.value);weight=Number(w.value);}
  if(result===3){height-=delta;weight-=delta*2;}if(result===4){height-=delta;weight-=delta;}if(result===6)weight-=delta;if(result===13)weight+=delta;if(result===16){height+=delta;weight+=delta;}if(result===18){height+=delta;weight+=delta*2;}
  const years=Number(exact.value)+b.ageDeltas.filter(d=>d.subject===subject).reduce((s,d)=>s+d.amount,0),scale=years<12?0.5:years<18?0.75:1;
  height*=scale;weight*=scale;
  if(height<=0||weight<=0){b.issue(`${subject}/dimensions`,'nonpositive-dimensions','As medidas informadas geraram dimensão não positiva; revise a base.','creation',subject);return;}
  if(subject===b.root){b.finalSize=result===3||years<12?0.5:b.state.config.size;b.dimensions={height,weight,age:years};}
}
