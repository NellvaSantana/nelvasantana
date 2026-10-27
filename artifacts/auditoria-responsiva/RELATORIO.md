# Auditoria responsiva — Nellva Sântana

Realizada em 26/10/2026. Correções locais, sem commit, push ou deploy.

## Diagnóstico confirmado

Projeto Next.js 16.3.4 (App Router), React 19.1.1 e CSS global, sem biblioteca de estilos. A página principal está em `app/page.tsx`; `components/ui.tsx` fornece SectionTitle; Header, Footer, Press, ScrollRail e VideoCard compõem as outras áreas. As rotas antigas redirecionam para âncoras da página principal. Fontes e metadados ficam em `app/layout.tsx`.

O Hero possuía sucessivas versões de layout (grid, posicionamento absoluto e flex), regras duplicadas e overrides com `!important`. A largura efetiva da fotografia era `min(66vw,980px)` no desktop: atingia o teto por volta de 1485 px, enquanto a área disponível continuava crescendo. A margem direita também deslocava a foto para dentro de um contêiner centralizado. Isso explica a menor presença relativa e o vazio observado nas telas grandes, mas não comprova qual situação ocorreu no computador da cliente.

A altura mínima de 780 px prevalecia sobre a altura de viewport de 768 px. Havia ainda uma regra antiga para altura menor que 700 px, redundante com overrides posteriores. Não havia uma media query ativa que reduzisse especificamente a imagem apenas nos desktops de 1366/1440 px: o resultado vinha da combinação de tamanho fluido, teto fixo e offsets.

A escala descritiva anterior era 16–18 px; em celulares chegava a cerca de 16.1 px. Várias seções já reutilizavam o token, mas introduções eram sobrescritas pela regra final genérica de descrição. A frase de “A artista” permanecia em 24 px, apesar de estar numa família serifada com presença visual menor. Regras antigas de body com 15/16 px eram sobrescritas pela escala final; aumentar apenas essas regras não corrigiria a leitura.

## Implementação do Hero

Consolidei as regras `.one-hero`, `.one-hero-copy`, `.one-hero-photo` e seus elementos associados em um único bloco responsivo. Removi versões obsoletas e os overrides `!important` da foto.

- Foto desktop: `--portrait-width:min(70vw,1150px)`, aumento moderado nos compactos e maior presença nos grandes.
- Offset horizontal: `max(-3vw,calc((100vw - 1760px)/2))`, aproximando a artista do nome.
- Offset vertical vinculado à largura: `calc(var(--header) - var(--portrait-width)*.29)`, eliminando fundo acima do cabelo de maneira proporcional.
- Hero: mínimo de 44rem e altura `min(100svh,64rem)`, com padding inferior de 2rem; em 1366 × 768 passa a ocupar 768 px.
- Até 900 px, texto e imagem continuam em fluxo vertical; a foto usa 112% da moldura em vez de 104%, offset superior de -28% e margem superior de -1rem. Em 761–900 px a moldura permanece com 65vw.
- O JPG original continua intacto: 1357 × 2048, razão aproximada 0.663. `width`/`height` intrínsecos substituem `fill` no JSX, evitando sobrescrever os estilos inline desse modo com `!important`. `height:auto` preserva a proporção; `sizes` corresponde à largura CSS em cada faixa.

As capturas mostram rosto e cabelo completos, nome e frase legíveis. A moldura mantém o recorte editorial da parte inferior do corpo já existente. O arquivo original não foi substituído nem alterado; a renderização mantém a otimização do Next. A fonte de 1357 px impõe o limite natural de detalhe em dispositivos de alta densidade; não há alegação de ganho de resolução.

## Tipografia e inventário

Valores de referência consideram raiz de 16 px. Os tamanhos efetivos por viewport estão nos JSONs.

| Papel | Tratamento final |
| --- | --- |
| Nome no Hero | Great Vibes, clamp de 80–136 px no desktop; escala móvel de 70.4–96 px; proporções internas preservadas |
| Títulos principais | Cormorant Garamond; escalas editoriais existentes preservadas, em geral 48–112 px conforme seção |
| Títulos secundários | Escalas próprias existentes de performances, projetos, galeria e vídeos preservadas |
| Frase abaixo do título de A artista | Novo `--type-motto:clamp(1.625rem,1.4rem + .4vw,2rem)`: 26–32 px, entrelinha 1.45; largura 22ch |
| Introduções abaixo de títulos | Novo `--type-intro:clamp(1.1875rem,1.1rem + .3vw,1.375rem)`: 19–22 px; entrelinha 1.65; inclui Performances e Galeria |
| Descrições, biografia e textos institucionais | Reutilizado `--type-description`, agora `clamp(1.0625rem,1rem + .2vw,1.1875rem)`: 17–19 px, antes 16–18 px; entrelinha 1.8 |
| Resumos artísticos de projetos | Serifada itálica existente de 24–28 px, preservada |
| Rótulos e metadados | `--type-label` existente de 14–16 px e `--type-auxiliary` de 14–15 px, preservados |
| Links, botões e navegação | Escala auxiliar e alvos existentes de pelo menos 44 px, preservados; menu completo mantém sua escala serifada |
| Legendas e rodapé | Escala auxiliar existente preservada |
| Release | Composição, texto em Arial dimensionado por cqi e assinatura em imagem vetorial preservados; não foi objeto de nova direção gráfica |

As descrições de performances continuam com máximo de 55ch; biografia com 720 px; identidade com 65ch; introdução de Performances com 42ch. Mantidos os espaçamentos entre parágrafos e o alinhamento existente: justificado no desktop e alinhado ao início até 900 px. As cores de leitura existentes (#574b46 sobre #f9f7f2/#eee8dc, entre outras) foram preservadas. Não foi realizada certificação WCAG completa.

Fontes: Cormorant Garamond 400/500/600 normal e itálico; Great Vibes 400; Manrope 400/500/600; Oswald 400/500. Carregadas por `next/font/google`, com subconjunto latin e `display:swap`, servidas localmente pelo Next. Todas as quatro famílias tiveram faces usadas com status loaded nas 11 resoluções; faces não utilizadas podem permanecer unloaded normalmente. Não foi encontrada falha persistente de fonte nos testes.

## Breakpoints e unidades

O CSS usa faixas de 600, 601, 760, 761, 900, 901, 1024, 1050, 1100 e 1600 px, conforme componente. A navegação horizontal só aparece a partir de 1600 px; o botão e o menu completo continuam disponíveis em todas as faixas. O Hero usa 900 px como mudança de composição e 761–900 px como ajuste de tablet.

`px` aparece em breakpoints, limites de contêiner e imagens; `rem` na escala de leitura e espaçamentos; `em` em proporções de títulos e tracking; `vw` em colunas, padding e escalas fluidas; `vh` em espaçamentos de seções legadas; `svh` no Hero; `dvh` nos limites do modal de vídeo; `cqi` na composição editorial do Release. Há clamp() em títulos e textos. Os novos mínimos de leitura são em rem para evitar texto excessivamente pequeno nas telas compactas.

## Responsividade efetivamente testada

Chromium via Playwright instalado no projeto, escala de dispositivo 1, ambiente local. Capturas antes e depois nas 11 dimensões; inspeção visual da matriz e de capturas individuais do Hero e das seções prioritárias. Não é uma validação em computadores físicos diferentes, Safari ou Firefox.

| Viewport CSS | Altura do Hero antes → depois (px) | Largura da imagem antes → depois (px) | Descrição antes → depois |
| --- | --- | --- | --- |
| 1366 × 768 | 780 → 768 | 901.5 → 956.2 | 18px → 18.732px |
| 1440 × 900 | 900 → 900 | 950.4 → 1008.0 | 18px → 18.88px |
| 1536 × 864 | 864 → 864 | 980.0 → 1075.2 | 18px → 19px |
| 1600 × 900 | 900 → 900 | 980.0 → 1120.0 | 18px → 19px |
| 1920 × 1080 | 960 → 1024 | 980.0 → 1150.0 | 18px → 19px |
| 2560 × 1440 | 960 → 1024 | 980.0 → 1150.0 | 18px → 19px |
| 375 × 812 | 927 → 911 | 390.0 → 420.0 | 16.11px → 17px |
| 390 × 844 | 947 → 931 | 405.6 → 436.8 | 16.14px → 17px |
| 430 × 932 | 998 → 982 | 447.2 → 481.6 | 16.22px → 17px |
| 768 × 1024 | 1150 → 1134 | 519.1 → 559.1 | 16.896px → 17.536px |
| 1024 × 768 | 780 → 768 | 675.8 → 716.8 | 17.408px → 18.048px |

Sem overflow horizontal no documento nas 11 resoluções, antes e depois. Abertura por botão e fechamento por Escape passaram em todas elas. A navegação desktop aparece conforme o breakpoint existente. Os carrosséis continuam com rolagem horizontal própria intencional. Nomes e rosto não se sobrepõem nas capturas. No mobile, o Hero pode ultrapassar uma tela: texto e retrato permanecem em sequência, sem comprimir o nome ou cortar o rosto para caber em uma dobra.

Evidências: `before.json`, `after.json` (geometria, tamanho e família de fonte, entrelinha, cor, display e imagem selecionada); `inventario-tipografico.json`; `before-*.png`, `after-*.png` e `matriz-after.png`. Capturas de seção podem incluir o cabeçalho fixo sobre a posição de scroll adotada pelo Playwright; isso não indica uma nova posição do cabeçalho no layout.

## Validações e intercorrências

- `rtk npm run lint`: passou após converter o script de captura para imports ESM.
- `rtk npm run typecheck`: passou.
- `rtk npm run build`: passou; 16 páginas estáticas geradas. Aviso existente: NEXT_PUBLIC_SITE_URL ausente, metadataBase usa localhost. A variável não foi inventada ou alterada nesta tarefa.
- `rtk proxy npm run start -- --port 3001`: produção local para validação.
- `rtk proxy node artifacts/auditoria-responsiva/capture.mjs after`: matriz de 11 viewports.

A primeira captura depois das alterações teve timeouts no ambiente local. A investigação isolou uma requisição WebP de 1200 px que ficava pendente no processo de otimização, enquanto o JPG respondia. Houve uma rodada intermediária com transferência de imagens via Node para investigar o layout; depois de reiniciar o processo local de produção, a requisição WebP respondeu 200. A rodada final usa carregamento normal, sem interceptação. Não foi alterado o pipeline de imagens do produto com base nessa ocorrência local.

## Arquivos e limites

Arquivos de implementação alterados: `app/globals.css` e `app/page.tsx`. Acrescentados este relatório e as evidências/script em `artifacts/auditoria-responsiva/`. Não foram adicionadas dependências, modificados textos, imagens originais, assinatura do Release ou funcionalidades alheias ao pedido.

O repositório já tinha alterações em `.next` e `next-env.d.ts` no início; build, typecheck e servidor também geram arquivos em `.next` e `tsconfig.tsbuildinfo`. Esses arquivos de ferramenta não são alterações editoriais. Alterações preexistentes não foram revertidas. Nenhum commit, push ou deploy foi executado.

Pendências externas: faltam as capturas da cliente e dados de navegador, zoom, escala do sistema, resolução CSS e URL/versão publicada. Zoom, escala do sistema, fontes em cache e deploy antigo são hipóteses para a diferença entre computadores, não causas confirmadas. Para comparar, usar a mesma versão do site, registrar window.innerWidth/innerHeight e zoom e confrontar com as capturas desta auditoria. Validar também no navegador efetivamente usado pela cliente. O travamento local de otimização não comprova falha no deploy.
