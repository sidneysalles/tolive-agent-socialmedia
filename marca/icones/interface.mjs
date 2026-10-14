// Os ícones de interface da toLive (guia, seção 7: L-Icones): grade de 24, traço de 2, pontas e cantos
// redondos, sem preenchimento, sempre na cor do texto, nunca laranja. Sem sino: quem chama atenção é o
// veredito e, quando preciso, o Toly. A base é a Lucide. Fonte única: os apps copiam esta pasta
// (ferramentas/sincronizar.mjs) e os SVGs de svg/interface/ são gerados daqui (ferramentas/gerar-svgs.mjs).
// Ícone novo entra aqui primeiro, num PR do tolive-base, e chega aos apps na próxima cópia.

export const DESENHOS = Object.freeze({
  voltar: '<path d="M15 6l-6 6 6 6"/>',
  inicio: '<path d="M4 11l8-6 8 6v8a1 1 0 0 1-1 1h-4v-5h-6v5H5a1 1 0 0 1-1-1z"/>',
  financas: '<rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 10h18"/><path d="M16 15h2"/>',
  saude: '<path d="M3 12h4l2-5 4 10 2-5h6"/>',
  pessoas: '<circle cx="9" cy="8" r="3"/><circle cx="17" cy="9" r="2.5"/><path d="M3 19c0-3.3 2.7-5 6-5s6 1.7 6 5"/><path d="M15 14.5c3 0 5.5 1.3 5.5 4.5"/>',
  calendario: '<rect x="4" y="5" width="16" height="15" rx="2"/><path d="M4 10h16"/><path d="M9 3v4"/><path d="M15 3v4"/>',
  feito: '<path d="M5 12.5l4.5 4.5L19 7"/>',
  fechar: '<path d="M6 6l12 12"/><path d="M18 6L6 18"/>',
  adicionar: '<path d="M12 5v14"/><path d="M5 12h14"/>',
  buscar: '<circle cx="11" cy="11" r="6"/><path d="M20 20l-4.5-4.5"/>',
  regras: '<path d="M4 7h10"/><path d="M18 7h2"/><circle cx="16" cy="7" r="2"/><path d="M4 17h2"/><path d="M10 17h10"/><circle cx="8" cy="17" r="2"/>',
  fe: '<path d="M12 2v5"/><path d="M9.5 4.5h5"/><path d="M5 21V12l7-4 7 4v9"/><path d="M10 21v-4h4v4"/>', // a etiqueta do Fé (guia, N-Identidade)
  horas: '<circle cx="12" cy="12" r="8"/><path d="M12 8v4l3 2"/>',
  avancar: '<path d="M9 6l6 6-6 6"/>',
  expandir: '<path d="M6 9l6 6 6-6"/>',
  globo: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3a14 14 0 0 1 0 18a14 14 0 0 1 0-18"/>',
  externo: '<path d="M14 4h6v6"/><path d="M20 4l-9 9"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',
  copiar: '<rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V6a1 1 0 0 1 1-1h9"/>',
  colar: '<rect x="6" y="4" width="12" height="17" rx="2"/><path d="M9 4V3h6v1"/>',
  cadeado: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  recolher: '<path d="M6 15l6-6 6 6"/>',
  pessoa: '<circle cx="12" cy="8" r="3.5"/><path d="M5 20c0-3.6 3.1-5.5 7-5.5s7 1.9 7 5.5"/>',
  'seta-cima': '<path d="M12 19V5"/><path d="M6 11l6-6 6 6"/>',
  'seta-baixo': '<path d="M12 5v14"/><path d="M6 13l6 6 6-6"/>',
  alerta: '<path d="M10.3 4.6a2 2 0 0 1 3.4 0l7.4 12.9a2 2 0 0 1-1.7 3H4.6a2 2 0 0 1-1.7-3z"/><path d="M12 10v4"/><path d="M12 17.5h.01"/>',
  banco: '<path d="M3 10l9-6 9 6"/><path d="M4 10h16"/><path d="M6 10v8"/><path d="M10 10v8"/><path d="M14 10v8"/><path d="M18 10v8"/><path d="M3 20h18"/>',
});

/** Nomes que levam a outro desenho (o mesmo conceito com outra palavra na tela). */
export const APELIDOS = Object.freeze({
  ajustes: 'regras',
  cartao: 'financas',
  agenda: 'calendario',
  mais: 'adicionar',
  casa: 'inicio', // a etiqueta do Casa
  conta: 'pessoa', // a etiqueta da Conta
});

export const NOMES_DOS_ICONES = Object.freeze([...Object.keys(DESENHOS), ...Object.keys(APELIDOS)]);

/**
 * O SVG do ícone como texto: grade de 24, traço de 2, pontas redondas, sem preenchimento, na cor do
 * texto (`currentColor`). `aria-hidden`: o nome vai no texto ou no aria-label do botão. Quem monta HTML
 * com escape (o `html` dos apps) marca este texto como seguro: ele não traz nada de quem usa. `data-icone` leva o
 * nome pedido (o apelido, se foi ele), pra teste e CSS acharem o ícone sem depender do desenho.
 */
export function svgDoIcone(nome, { tamanho = 24, traco = 2, classe = '' } = {}) {
  const desenho = DESENHOS[APELIDOS[nome] ?? nome];
  if (!desenho) throw new Error(`Ícone desconhecido: ${nome}`);
  const lado = Number(tamanho);
  const espessura = Number(traco);
  if (!(lado > 0) || !(espessura > 0)) throw new Error(`Tamanho ou traço inválido para o ícone ${nome}`);
  if (!/^[a-z0-9 _-]*$/i.test(classe)) throw new Error(`Classe inválida para o ícone ${nome}`);
  const classes = classe ? `icone ${classe}` : 'icone';
  return `<svg class="${classes}" width="${lado}" height="${lado}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="${espessura}" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false" data-icone="${nome}">${desenho}</svg>`;
}
