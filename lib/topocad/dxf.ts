import type { Vertice } from "./tipos";

/** Camadas e cores (ACI) iguais às do script: PONTOS vermelho, LIMITE verde, CODIGOS branco/preto. */
const CAMADAS: [string, number][] = [
  ["0", 7],
  ["PONTOS", 1],
  ["LIMITE", 3],
  ["CODIGOS", 7],
];

function num(n: number): string {
  const s = n.toFixed(6).replace(/\.?0+$/, "");
  return s === "-0" || s === "" ? "0" : s;
}

/**
 * Gera DXF ASCII versão R2010 (AC1024): 1 POINT por vértice, 1 TEXT por vértice,
 * 1 LWPOLYLINE fechada na ordem do memorial. X = Este, Y = Norte.
 * Escritor próprio e sem dependências; NÃO foi validado no AutoCAD, só relido por parser
 * e aberto no LibreOffice (ver README). Abra no AutoCAD antes de liberar.
 */
export function gerarDxf(vertices: Pick<Vertice, "codigo" | "este" | "norte">[]): string {
  if (vertices.length === 0) throw new Error("gerarDxf: nenhum vértice");

  let handle = 0x10;
  const h = () => (handle++).toString(16).toUpperCase();
  const out: string[] = [];
  const g = (codigo: number | string, valor: string | number) => {
    out.push(String(codigo), String(valor));
  };

  const xs = vertices.map((v) => v.este);
  const ys = vertices.map((v) => v.norte);
  const altura = (Math.max(...xs) - Math.min(...xs) > Math.max(...ys) - Math.min(...ys)
    ? Math.max(...xs) - Math.min(...xs)
    : Math.max(...ys) - Math.min(...ys)) / 100;
  const alturaTxt = altura > 0 ? altura : 1;

  // HEADER
  g(0, "SECTION"); g(2, "HEADER");
  g(9, "$ACADVER"); g(1, "AC1024");
  g(9, "$HANDSEED"); const idxSeed = out.length; g(5, "0"); // preenchido no fim
  g(9, "$INSUNITS"); g(70, 6);
  g(9, "$PDMODE"); g(70, 35);
  g(9, "$PDSIZE"); g(40, -2);
  g(0, "ENDSEC");

  // TABLES
  g(0, "SECTION"); g(2, "TABLES");

  g(0, "TABLE"); g(2, "LTYPE"); g(5, h()); g(100, "AcDbSymbolTable"); g(70, 1);
  g(0, "LTYPE"); g(5, h()); g(100, "AcDbSymbolTableRecord"); g(100, "AcDbLinetypeTableRecord");
  g(2, "CONTINUOUS"); g(70, 0); g(3, "Solid line"); g(72, 65); g(73, 0); g(40, 0);
  g(0, "ENDTAB");

  g(0, "TABLE"); g(2, "LAYER"); g(5, h()); g(100, "AcDbSymbolTable"); g(70, CAMADAS.length);
  for (const [nome, cor] of CAMADAS) {
    g(0, "LAYER"); g(5, h()); g(100, "AcDbSymbolTableRecord"); g(100, "AcDbLayerTableRecord");
    g(2, nome); g(70, 0); g(62, cor); g(6, "CONTINUOUS");
  }
  g(0, "ENDTAB");

  g(0, "TABLE"); g(2, "STYLE"); g(5, h()); g(100, "AcDbSymbolTable"); g(70, 1);
  g(0, "STYLE"); g(5, h()); g(100, "AcDbSymbolTableRecord"); g(100, "AcDbTextStyleTableRecord");
  g(2, "Standard"); g(70, 0); g(40, 0); g(41, 1); g(50, 0); g(71, 0); g(42, 2.5); g(3, "txt"); g(4, "");
  g(0, "ENDTAB");

  g(0, "ENDSEC");

  // ENTITIES
  g(0, "SECTION"); g(2, "ENTITIES");

  for (const v of vertices) {
    g(0, "POINT"); g(5, h()); g(100, "AcDbEntity"); g(8, "PONTOS"); g(100, "AcDbPoint");
    g(10, num(v.este)); g(20, num(v.norte)); g(30, 0);
  }

  for (const v of vertices) {
    g(0, "TEXT"); g(5, h()); g(100, "AcDbEntity"); g(8, "CODIGOS"); g(100, "AcDbText");
    g(10, num(v.este + alturaTxt / 2)); g(20, num(v.norte + alturaTxt / 2)); g(30, 0);
    g(40, num(alturaTxt)); g(1, v.codigo); g(7, "Standard");
    g(100, "AcDbText");
  }

  g(0, "LWPOLYLINE"); g(5, h()); g(100, "AcDbEntity"); g(8, "LIMITE"); g(100, "AcDbPolyline");
  g(90, vertices.length); g(70, 1);
  for (const v of vertices) { g(10, num(v.este)); g(20, num(v.norte)); }

  g(0, "ENDSEC");
  g(0, "EOF");
  out[idxSeed + 1] = h(); // próximo handle livre (sempre maior que todos os usados)
  return out.join("\r\n") + "\r\n";
}
