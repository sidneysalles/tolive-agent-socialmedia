// As cores que um vídeo pode usar: as da marca (marca/tokens.css e marca/dominios.css, copiados do
// tolive-base) e os tons "noite" do site (tolive/publico/css/tokens.css), que fazem as cenas escuras.
// Nenhum outro arquivo do estúdio escreve hexadecimal: as cenas pedem COR.papel, COR.sinal, dominio('fe')…
// O test/cores.test.mjs confere que estas continuam iguais às do tokens.css copiado.

export const COR = Object.freeze({
  // base (claro)
  papel: '#EBEAE5', cartao: '#F6F5F1', tinta: '#111111', tinta2: '#55534E', apoio: '#2E2D2A', linha: '#C8C6BF',
  trilho: '#D6D4CD', selecionado: '#EFEDE7', hover: '#E2E0D9',
  // sinal: um por quadro (o ponto do veredito, o cartão de alerta, a cabeça do Toly, o sol do logo)
  sinal: '#F26B3A', sinalTexto: '#B4421A', sinalSuave: '#FBE1D6',
  // veredito
  positivo: '#2E6E52', positivoFundo: '#DCEBE3', negativo: '#B4421A', negativoFundo: '#FBE1D6',
  // o cartão de alerta
  inversoFundo: '#111111', inversoTinta: '#EBEAE5', inversoBorda: '#6B6963',
  // noite: as cenas escuras (o tema escuro da marca usado como seção, como no site)
  noite: '#111111', noiteCartao: '#1E1D1B', noiteBorda: '#3A3936', noiteLinha: '#33322F', noiteTinta: '#EBEAE5',
  noiteTinta2: '#A3A099', noiteSinal: '#FF7A4A', noitePositivo: '#6FC29A', noitePositivoFundo: '#17302A',
  // dados: só dentro de gráfico, nesta ordem
  dado1: '#111111', dado2: '#3352B8', dado3: '#C9A03A', dado4: '#8A5C8E', dado5: '#A9BDB4',
});

/** As cores de cada app (claro): tom, fundo da etiqueta, texto, e o horizonte do ícone. */
export const DOMINIO = Object.freeze({
  financas: { nome: 'Finanças', tom: '#7A4A7E', fundo: '#EBDFEC', texto: '#6A3E6E', horizonte: '#CC9DCF', escuroFundo: '#2E1F30' },
  fe: { nome: 'Fé', tom: '#3352B8', fundo: '#DDE3F5', texto: '#2C4BA8', horizonte: '#8EA4F0', escuroFundo: '#1D2440' },
  saude: { nome: 'Saúde', tom: '#2F6B73', fundo: '#D9E9EA', texto: '#255A61', horizonte: '#7FC2C9', escuroFundo: '#13292C' },
  casa: { nome: 'Casa', tom: '#8C6510', fundo: '#F1E6C7', texto: '#7A570C', horizonte: '#E0B65A', escuroFundo: '#33280F' },
  pessoas: { nome: 'Pessoas', tom: '#A3416A', fundo: '#F5DFE8', texto: '#8E3359', horizonte: '#E89BBA', escuroFundo: '#3A1A27' },
});

export const dominio = nome => {
  const d = DOMINIO[nome];
  if (!d) throw new Error(`domínio desconhecido: ${nome}`);
  return d;
};
