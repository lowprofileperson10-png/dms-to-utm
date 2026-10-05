import type { Vertice } from "@/lib/topocad"

export interface LinhaVertice { project_id: string; seq: number; code: string; lon_dms: string; lat_dms: string; lon_dec: number; lat_dec: number; altitude_m: number | null; vante_code: string; azimuth_dms: string; distance_m: number; confrontacao: string; easting: number; northing: number; edited: boolean }

export function verticeParaLinha(projectId: string, v: Vertice): LinhaVertice { return { project_id: projectId, seq: v.seq, code: v.codigo, lon_dms: v.lonDms, lat_dms: v.latDms, lon_dec: v.lon, lat_dec: v.lat, altitude_m: v.altitude, vante_code: v.vante, azimuth_dms: v.azimuteDms, distance_m: v.distancia, confrontacao: v.confrontacao, easting: v.este, northing: v.norte, edited: v.editado } }

export function linhaParaVertice(l: LinhaVertice): Vertice { return { seq: l.seq, codigo: l.code, lonDms: l.lon_dms, latDms: l.lat_dms, lon: Number(l.lon_dec), lat: Number(l.lat_dec), altitude: l.altitude_m === null ? null : Number(l.altitude_m), vante: l.vante_code, azimuteDms: l.azimuth_dms, distancia: Number(l.distance_m), confrontacao: l.confrontacao, este: Number(l.easting), norte: Number(l.northing), editado: l.edited } }

export function crsDoProjeto(project: { datum: string; utm_zone: string | number; utm_hemisphere: "S" | "N"; epsg: number }) { const fuso = Number(project.utm_zone); return { datum: "SIRGAS 2000" as const, fuso, hemisferio: project.utm_hemisphere, epsg: project.epsg, nome: `SIRGAS 2000 / UTM zone ${fuso}${project.utm_hemisphere}` } }

export function projetoDoResultado(r: Extract<import("@/lib/topocad").ResultadoMotor, { ok: true }>) { return { status: "ready", datum: r.crs.datum, epsg: r.crs.epsg, utm_zone: `${r.crs.fuso}${r.crs.hemisferio}`, utm_hemisphere: r.crs.hemisferio, area_m2: r.geometria.areaM2, perimeter_m: r.geometria.perimetroGradeM, perimeter_memorial_m: r.geometria.perimetroMemorialM, closure_error_m: r.geometria.divergenciaMaxDistanciaM, is_closed: r.geometria.poligonoFechado, avisos: r.avisos, error_code: null, error_message: null } }
