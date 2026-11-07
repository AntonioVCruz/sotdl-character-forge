/** Known-pattern guard, not a classifier of licenses, all personal data or arbitrary secrets. */
const purchase=/\((?:order\s*)?#\d{4,}\)/iu;
const privateQuery=/^(?:access_token|refresh_token|token|auth|authorization|signature|sig|x-amz-signature|x-amz-credential|x-amz-security-token|x-goog-signature|x-goog-credential)$/i;
export class ExportContentError extends Error{}
export const CHARACTER_FILE_DESTINATIONS={json:'private-backup',html:'minimal-sharing-sheet',pdf:'minimal-sharing-sheet'} as const;
export function assertPermittedExportData(input:unknown){
  const visit=(value:unknown):void=>{
    if(typeof value==='string'){
      if(purchase.test(value))throw new ExportContentError('Conteúdo de compra identificado. Confira os campos livres antes de emitir o arquivo; o save foi preservado.');
      for(const match of value.matchAll(/https?:\/\/[^\s<>"']+/gi)){
        try{const url=new URL(match[0]);if(url.username||url.password||[...url.searchParams.keys()].some(key=>privateQuery.test(key)))throw new Error('private-url');}
        catch{throw new ExportContentError('Link autenticado ou privado identificado. Confira os campos livres antes de emitir o arquivo; o save foi preservado.');}
      }
    }else if(Array.isArray(value))value.forEach(visit);
    else if(value&&typeof value==='object')for(const [key,child]of Object.entries(value)){visit(key);visit(child);}
  };visit(input);
}
