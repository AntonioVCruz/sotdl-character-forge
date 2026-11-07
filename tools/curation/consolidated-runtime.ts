import {buildOfficialLocalContext} from './official-local-context';
import {buildProcedureLocalContext} from './procedure-local-context';
import {compileRuntimeArtifacts} from './runtime-artifact-compiler';
export async function rebuild(sourceRoot:string,implementationRoot:string){
  const core=await buildOfficialLocalContext(sourceRoot,implementationRoot);
  const procedures=await buildProcedureLocalContext(sourceRoot,implementationRoot);
  const result=compileRuntimeArtifacts(core,procedures,'1.0.1');
  return {contexts:result.report.contexts,bundleSha256:result.report.bundleSha256,indexSha256:result.report.indexSha256,
    coverage:result.report.coverage,artifacts:[...result.artifacts].map(([path,text])=>({path,text}))};
}
