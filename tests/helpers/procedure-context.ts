import fixture from '../../curation/examples/human-l0-mechanics.synthetic.json';
import {ProcedureContextSchema} from '../../packages/character-generator/procedure-model';

// Invented dice and content. No licensed catalog is necessary for these history invariants.
export function inventedProcedureContext(){return ProcedureContextSchema.parse({contract:'sotdl.human-creation',contractVersion:'1.0.0',fictionalData:true,
  policy:{enabled:true,authority:'fictional-test',deadParents:'independent-cause-per-parent',dimensions:'build-then-age-scale',lifeCount:'initial-age-roll',maxNodes:40,maxCycleSteps:2,maxRelativeDepth:0},
  sources:{core:'fictional:core',onlyHuman:'fictional:expanded',oddities:'fictional:objects'},implementationSha256:'a'.repeat(64),mechanicalPacks:fixture.packs,
  tables:[{id:'core:wealth',sourceId:'fictional:core',evidenceIds:['fictional:evidence'],kind:'random',activation:'invented',manualMode:'invented',dice:{count:2,sides:4},streams:[{id:'main',association:'verified-transcription',rows:[{id:'invented:low',min:2,max:5,text:'Invented low result',evidenceIds:['fictional:evidence']},{id:'invented:high',min:6,max:8,text:'Invented high result',evidenceIds:['fictional:evidence']}]}],lookupKeys:[],modifierPolicy:'none',application:'reference-only-manual-effects',automaticGeneration:false,reviewNotes:[]}],
  lookups:[],professions:[],templates:[],programs:[],lifestylePrograms:[],professionPrograms:[],extraPrograms:[],languageOptions:[],thingTables:[],thingVariants:[],thingPlans:[],backgroundPlans:[],itemDefinitions:[],itemReferences:[],
  equipmentRules:{contract:'sotdl.equipment-context',contractVersion:'1.0.0',sourceId:'fictional:core',defensiveStacking:'pending',stackingAuthority:'unresolved',shieldItemIds:[],dualAttack:{oneTargetBanes:0,twoTargetBanes:0},evidence:[{id:'fictional:evidence',sourceId:'fictional:core',path:'fictional/input',inputSha256:'b'.repeat(64),startLine:1,endLine:1,excerptSha256:'c'.repeat(64)}]},evidence:[],inputs:[]});}
