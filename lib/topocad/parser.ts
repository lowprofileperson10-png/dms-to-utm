import type { Aviso, VerticeBruto } from "./tipos";
import { normalizarTexto } from "./texto";

/**
 * Mesma regex do teste_automacao.py (grupos nomeados em JS: (?<nome>...)).
 * Única extensão: altitude pode ser negativa ou "-" (vira null).
 */
export const PADRAO_VERTICE =
  /(?<codigo>[A-Z0-9]+-[A-Z]-\d+)\s+(?<lon_d>-?\d+)°(?<lon_m>\d+)'(?<lon_s>[\d,]+)"\s+(?<lat_d>-?\d+)°(?<lat_m>\d+)'(?<lat_s>[\d,]+)"\s+(?<altitude>-?[\d,]+|-)\s+(?<vante>[A-Z0-9]+-[A-Z]-\d+)\s+(?<az_d>\d+)°(?<az_m>\d+)'\s+(?<distancia>[\d.,]+)\s+(?<confrontacao>.+)/;

const COMECA_COM_CODIGO = /^[A-Z0-9]+-[A-Z]-\d+\s/;

/** "1.234,56" -> 1234.56 (igual ao texto_para_numero do script). */
export function textoParaNumero(txt: string): number {
  return parseFloat(txt.replace(/\./g, "").replace(",", "."));
}

/**
 * DMS -> decimal. O hemisfério vem do PREFIXO "-" do texto dos graus
 * (int("-0") vale 0, então o sinal não pode vir do número).
 */
export function dmsParaDecimal(grauTexto: string, minuto: number, segundoTexto: string): number {
  const negativo = grauTexto.startsWith("-");
  const dec = Math.abs(parseInt(grauTexto, 10)) + minuto / 60 + textoParaNumero(segundoTexto) / 3600;
  return negativo ? -dec : dec;
}

export interface ExtracaoVertices {
  vertices: VerticeBruto[];
  avisos: Aviso[];
}

/**
 * Extrai vértices de linhas de texto (já reconstruídas). Normaliza antes.
 *
 * Confrontação quebrada em 2+ linhas: a linha seguinte é anexada quando NÃO
 * começa com código de vértice e (a confrontação anterior termina em , ; ou
 * a linha seguinte começa em minúscula). Isso evita colar "Página 1 de 1".
 */
export function extrairVertices(linhasOuTexto: string | string[]): ExtracaoVertices {
  const bruto = Array.isArray(linhasOuTexto) ? linhasOuTexto.join("\n") : linhasOuTexto;
  const linhas = normalizarTexto(bruto).split("\n").map((l) => l.trim());

  const vertices: VerticeBruto[] = [];
  const avisos: Aviso[] = [];
  let aberto = false; // última linha tratada foi vértice/continuação

  for (const linha of linhas) {
    const m = PADRAO_VERTICE.exec(linha);
    if (m?.groups) {
      const g = m.groups as Record<string, string>;
      const altTxt = g.altitude!;
      vertices.push({
        seq: vertices.length + 1,
        codigo: g.codigo!,
        lonDms: `${g.lon_d}°${g.lon_m}'${g.lon_s}"`,
        latDms: `${g.lat_d}°${g.lat_m}'${g.lat_s}"`,
        lon: dmsParaDecimal(g.lon_d!, parseInt(g.lon_m!, 10), g.lon_s!),
        lat: dmsParaDecimal(g.lat_d!, parseInt(g.lat_m!, 10), g.lat_s!),
        altitude: altTxt === "-" ? null : textoParaNumero(altTxt.replace(/^-/, "")) * (altTxt.startsWith("-") ? -1 : 1),
        vante: g.vante!,
        azimuteDms: `${g.az_d}°${g.az_m}'`,
        distancia: textoParaNumero(g.distancia!),
        confrontacao: g.confrontacao!.trim(),
      });
      aberto = true;
      continue;
    }

    if (COMECA_COM_CODIGO.test(linha)) {
      avisos.push({
        codigo: "LINHA_NAO_RECONHECIDA",
        mensagem: "Linha parece um vértice, mas não casou com o formato esperado.",
        linha,
      });
      aberto = false;
      continue;
    }

    const ultimo = vertices[vertices.length - 1];
    if (aberto && ultimo && linha !== "") {
      if (/[,;]$/.test(ultimo.confrontacao) || /^[a-zà-ÿ]/.test(linha)) {
        ultimo.confrontacao = `${ultimo.confrontacao} ${linha}`;
        continue;
      }
    }
    aberto = false;
  }

  return { vertices, avisos };
}
