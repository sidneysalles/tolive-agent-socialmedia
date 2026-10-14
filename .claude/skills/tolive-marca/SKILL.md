---
name: tolive-marca
description: A marca da toLive (voz, cor, tipo, forma, movimento, ícones, Toly, veredito). Use antes de criar ou mudar qualquer tela, texto visível, e-mail, notificação push, ícone ou cor de um app da toLive, e ao revisar um PR que mexe nisso.
---

# A marca da toLive

O guia inteiro está em [guia.md](guia.md) (copiado do tolive-base). Abra a seção certa antes de decidir;
isto aqui é o que mais se erra.

## Antes de escrever qualquer tela

1. **O veredito vem primeiro.** Toda tela abre com até três palavras em Archivo Black que respondem
   "está tudo bem?", com o ponto laranja desenhado (`.ponto`, nunca o ponto da fonte), e uma frase com o
   número que prova. Nunca abre num gráfico. Seção 2.
2. **Um sinal por tela.** O laranja (`--sinal`) só no ponto do veredito, no cartão de alerta, na cabeça do
   Toly e no sol do logo. Nunca em barra, botão, dado ou "dinheiro saindo". Seção 3.
3. **Cada cor tem um trabalho.** Base (papel, cartão, tinta) em 90% da tela; veredito (verde/vermelho) só
   em número e selo; domínio (a cor do app) só na faixa de 8 px, na etiqueta, no ícone e no foco — nunca
   botão, fundo ou veredito; dados só dentro de gráfico, na ordem. Nenhum hexadecimal fora de
   `marca/tokens.css` e `marca/dominios.css`. Seção 3.
4. **Botão é pílula de tinta**, um primário por tela, e a saída ("Agora não") nunca escondida. Seção 8.
5. **Forma:** sem sombra; raio 20 só no cartão de alerta, no do Toly, na folha e no balão do tour; o resto é reto ou pílula.
   Seção 5 e 10.
6. **Movimento:** nada passa de 600 ms (os três minutos e o fim de sessão, 1,2 s), nada se mexe depois de parado,
   número nunca conta pra cima, `prefers-reduced-motion` respeitado. Seção 6.
7. **Ícones** de `marca/icones/interface.mjs` e `assuntos.mjs` (`svgDoIcone`, `svgDoAssunto`): grade 24,
   traço 2, `currentColor`. Ícone que falta entra no tolive-base primeiro. Sem sino. Seção 7.

## Antes de escrever texto (tela, e-mail, push)

- A marca é **toLive** (nunca "ToLive"); o app é **toLive <Nome>** ("toLive Finanças").
- **Nunca cite "Lei 10"** (nem o livro de onde veio) pra quem usa: aplica-se o efeito dos três minutos, não
  se fala dele. Seção 8.
- Calmo, breve, concreto, com saída. Fato antes do pedido. "Você". Sem emoji, sem exclamação, sem
  culpa, sem "imperdível". Seção 2, com a tabela "Assim / não assim".
- Números: por extenso até dez no texto; sem centavos na leitura, com centavos no item; "R$ 18 mil" no
  veredito; sinal "−"/"+" só em variação e em análise que junta entrada e saída (no lançamento, saída sem
  sinal e entrada com "+" em verde). Datas por extenso no Início, "12 out" em lista.
- Push: o fato no título, o pedido no corpo, até 4 linhas de ~45 caracteres; abre a tela da decisão.

## Depois

Rode `node ../tolive-base/ferramentas/conferir-marca.mjs .` (com o tolive-base clonado ao lado) e corrija o
que ele apontar. O que ele não pega (o veredito certo, um sinal só, a voz) é com você: releia a tela contra
as regras acima.
