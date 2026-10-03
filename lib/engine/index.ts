import "server-only"
import { createAdminClient } from "@/lib/supabase/server"
import { parseMemorialPdf } from "./parse-memorial"
import { parseDms } from "./dms"
import { convertToUtm } from "./utm"
import { geometry } from "./geometry"
export type ProcessResult={ok:boolean;error?:string}
export async function processMemorial(projectId:string):Promise<ProcessResult>{
 const db=createAdminClient(); const {data:project,error}=await db.from("projects").select("id,source_pdf_path").eq("id",projectId).maybeSingle(); if(error||!project)return {ok:false,error:"Projeto não encontrado."}
 await db.from("projects").update({status:"processing",error_message:null}).eq("id",projectId)
 try { const {data:file,error:downloadError}=await db.storage.from("memoriais").download(project.source_pdf_path); if(downloadError||!file)throw new Error("PDF_SEM_TEXTO")
  const parsed=await parseMemorialPdf(await file.arrayBuffer()); if(!parsed.ok)throw new Error(parsed.code)
  const coordinates=parsed.vertices.map(v=>({lon:parseDms(v.longitudeDms??"")??0,lat:parseDms(v.latitudeDms??"")??0})); const utm=convertToUtm(coordinates); if("errorCode" in utm)throw new Error(utm.errorCode)
  const rows=parsed.vertices.map((v,i)=>({project_id:projectId,seq:i+1,code:v.label,lon_dms:v.longitudeDms??null,lat_dms:v.latitudeDms??null,lon_dec:coordinates[i].lon,lat_dec:coordinates[i].lat,azimuth_dms:v.azimuthDms??null,distance_m:v.distanceM??null,easting:utm.points[i].easting,northing:utm.points[i].northing}))
  const {error:deleteError}=await db.from("project_vertices").delete().eq("project_id",projectId); if(deleteError)throw deleteError
  const {error:insertError}=await db.from("project_vertices").insert(rows); if(insertError)throw insertError
  const geo=geometry(utm.points); const {error:updateError}=await db.from("projects").update({status:"ready",datum:"SIRGAS 2000",epsg:utm.epsg,utm_zone:`${utm.zone}S`,utm_hemisphere:"S",area_m2:geo.areaM2,perimeter_m:geo.perimeterM,error_message:null}).eq("id",projectId); if(updateError)throw updateError
  return {ok:true}
 } catch(error) { const code=error instanceof Error?error.message:"PROCESSAMENTO_FALHOU"; const messages:Record<string,string>={PDF_SEM_TEXTO:"O PDF não contém texto extraível.",VERTICES_NAO_ENCONTRADOS:"Nenhum vértice foi identificado.",FUSO_NAO_SUPORTADO:"O fuso UTM não é suportado."}; await db.from("projects").update({status:"error",error_message:messages[code]??"Não foi possível processar o memorial."}).eq("id",projectId); return {ok:false,error:code} }
}
export async function processMemorialForUser(projectId:string,userId:string){const {data}=await createAdminClient().from("projects").select("id").eq("id",projectId).eq("user_id",userId).maybeSingle(); return data?processMemorial(projectId):{ok:false,error:"Projeto não encontrado."}}
export const memorialEngineMessage="O memorial será processado após o upload."
