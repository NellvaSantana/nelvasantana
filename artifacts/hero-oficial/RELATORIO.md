# Hero — assinatura oficial e enquadramento

## Causa
A fotografia contém fundo vazio acima do cabelo (cerca de 39% da largura renderizada). O deslocamento antigo removia apenas 29%. A largura min(70vw, 1150px) e a altura limitada a 64rem reduziam a presença em monitores grandes. A cópia ocupava 46% da largura. Não havia max-height na imagem nem background-position: era uma imagem absoluta com altura automática, object-fit contain, sem grid. O breakpoint de 900px empilhava também tablets; a regra intermediária ainda reduzia a foto a 65vw.

## Alterações
PNG oficial em public/images/nellva-assinatura-transparente.png, cópia byte a byte do Downloads (SHA-256 e34e5b484f21b183117cc48031c856dde0d4faef9367c4b0c4b589d2041ed02a). Transparência, cores e desenho preservados, sem filtros, conversão ou reconstrução. H1 com alt “Nellva Sântana”; largura máxima 480px e altura automática. Fonte de 991px oferece resolução para 2× nessa largura. Great Vibes deixa de construir a assinatura do Hero; seu carregamento global foi preservado para não interferir em outras seções.

Retrato original preservado. Escala max(82vw, 110svh), deslocamento ligado à posição real do cabelo, altura do Hero 100svh com mínimo de 40rem, cópia de 38% e margens laterais de 4vw. Tablet em retrato usa 90vw e altura máxima de 56rem; celular abaixo de 700px usa composição empilhada e enquadramento próprio. Altura automática e object-fit contain preservam proporções. Nenhum max-height de imagem ou esticamento foi introduzido.

## Comparação com a referência
No desktop o rosto fica maior, o cabelo aproxima-se do menu sem corte, e o retrato aproxima-se da assinatura. Menos área preta fica sem uso. Assinatura à esquerda com frase, redes e link abaixo; menu permanece acessível. A composição acompanha a referência, com os textos existentes preservados. No celular a composição é empilhada para conservar legibilidade e rosto/cabelo completos. No tablet a fotografia permanece ao lado, sem assinatura sobre o rosto.

[Antes desktop](before-1440x900-100.png) · [Depois desktop](after-1440x900-100.png)

[Antes celular](before-375x812-100.png) · [Depois celular](after-375x812-100.png)

Todas as capturas e as medidas estão nesta pasta, em before.json e after.json.

## Matriz de validação
375×812, 390×844, 768×1024, 1024×768, 1280×800, 1366×768, 1440×900 e 1920×1080. Desktop também a 125%: 13 cenários antes e 13 depois. Zoom de 125% emulado com viewport CSS dividido por 1,25 e deviceScaleFactor 1,25; não é uma operação manual no menu de zoom do navegador. Captura adicional Retina 1440×900 a 2×.

Depois: zero overflow horizontal e zero exceções JavaScript nos 13 cenários; imagens decodificadas e menu aberto em todos. Na primeira coleta o teste de menu antes não aguardava a animação e registrou falso; o script final aguarda a visibilidade. Esse dado inicial não indica regressão de menu.

Lint, typecheck e build executados com sucesso. Build apresenta aviso de metadataBase ausente, preexistente e fora do Hero.

## Limitações
Validação automatizada em Chromium local, sem acesso ao computador da cliente ou Safari/Firefox. Comparação com a referência visual fornecida no chat, sem medição pixel a pixel. Nitidez máxima depende do raster original; telas acima de 2× não ganham detalhe adicional. Não houve dependências novas, commit, push ou deploy. Mudanças de código limitadas ao Hero.

Em 1440×900 a largura renderizada da foto passou de 1008px para 1181px.
