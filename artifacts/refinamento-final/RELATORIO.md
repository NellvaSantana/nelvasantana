# Refinamento final — Nellva Sântana

## Implementação

Arquitetura preservada: Next.js App Router, página principal em `app/page.tsx`, componentes compartilhados e dados locais em `data/`. Rotas antigas redirecionam para as seções. Sem dependências ou versões novas.

- `data/gallery.ts`: removidas exclusivamente as duas entradas finais de Bastidores, `retratos/foto-07.webp` (estampa preta e branca) e `retratos/foto-08.webp` (rosto em preto e branco sob projeções). Identificação visual feita nos arquivos originais. Ambas já estão em Retratos: nenhuma inserção, exclusão física ou mudança na ordem de Retratos. Bastidores: 10 imagens; Retratos: 9.
- `data/content.ts`: três parágrafos transcritos integralmente do Release fornecido, incluindo datas, instituições, projetos e grafia. Sem revisão editorial do texto oficial.
- `components/press.tsx`: substituído o estado vazio por composição editorial bege/dourada, fotografia proporcional, assinatura e texto HTML selecionável; duas colunas no desktop e uma até 900px.
- `app/page.tsx`: ajustado `sizes` da imagem da Hero para a escala real.
- `app/globals.css`: fotografia da Hero passa de 57vw/840px para 66vw/980px com deslocamento à esquerda e ajuste vertical proporcional. Mantidos degradês, duas linhas da assinatura, cores, frase e links. No mobile, removida a margem negativa que aproximava a foto dos controles.
- Tipografia: reutilizados tokens `--type-description`, `--type-auxiliary`, `--type-label` e `--leading-description`; textos de leitura entre 16 e 18px, auxiliares entre 14 e 15px, entrelinha de leitura 1.8. Uniformizadas descrições, introduções, agenda e contato; ampliados links, identificadores e rodapé. Preservados títulos e resumos editoriais maiores. Textos estreitos deixam de ser justificados até 900px. Links de texto têm altura mínima de 44px; foco com cor herdada; contraste de rótulos preservado em fundos claros e escuros.

## Fontes e materiais pendentes

A assinatura da Hero e do Release usa **Great Vibes 400**, já configurada via `next/font/google`, como alternativa caligráfica disponível. Cormorant Garamond (400/500/600, normal/itálico), Manrope (400/500/600) e Oswald (400/500) permanecem no sistema. Todas as quatro famílias continuam utilizadas. Nenhuma fonte nova foi instalada.

**Bredlive** e **ITC Edwardian Script** não estão nos assets do projeto. A aplicação exata, inclusive o S ornamental, depende dos arquivos e da licença web adequados. Fontes oficiais consultadas:

- Bredlive: https://alitdesign.net/product/bredlive-typeface/ — oferece licença web para hospedagem própria.
- ITC Edwardian Script: https://www.myfonts.com/collections/edwardian-script-font-itc — disponível com licença web.

A fotografia do Release com microfone dourado e roupa preta de renda não foi encontrada nos 70 assets locais. O bloco usa provisoriamente `public/images/nellva-hero.jpg`, existente no projeto, com rosto/cabelo/microfone e proporção preservados. **Pendente o original exato para substituição.** O screenshot não foi recortado nem publicado como fotografia. Não foi criado PDF.

## Validação

- `rtk npm run lint`: passou.
- `rtk npm run typecheck`: passou.
- `rtk npm run build`: falhou no resolvedor interno de fontes do Turbopack para Oswald (`next/font/google queries have exactly one entry`). A configuração de fontes em `app/layout.tsx` não foi alterada.
- `rtk npm run build -- --webpack`: passou, incluindo TypeScript e geração das 16 páginas. Aviso de `metadataBase` ausente por falta de `NEXT_PUBLIC_SITE_URL` no ambiente; não foi inventada URL de produção.
- Não existe script de testes no projeto. Playwright já instalado foi usado sem novas dependências.
- Navegador Chromium real/headless: 375×812, 390×844, 430×932, 768×1024, 1024×768, 1280×800, 1440×900, 1920×1080; adicionais 320×800 e 720×450. Todas sem overflow horizontal, imagens quebradas, âncoras inválidas ou erros de JavaScript/console. Fontes carregadas; Release com três parágrafos; textos verificados de pelo menos 14px.
- Revisão visual de capturas da página inteira em 390 e 1440px e da Hero nos tamanhos representativos, incluindo 375, 1024 e 1920px. Capturas de evidência nesta pasta.
- Menu abriu e fechou com Escape; carrossel de Bastidores avançou por ArrowRight; link Release navegou para `#release`.
- Reflow adicional em 720px (largura equivalente a 1440px sob zoom de 200%) e ampliação CSS a 200% sem overflow. **Zoom nativo do navegador a 200% não foi testado**; ampliação CSS não substitui esse teste.
- Revisados semântica de títulos, alt, foco e contraste básico dos textos sobre fundos sólidos; isto não constitui certificação integral WCAG 2.2 AA, nem teste com leitor de tela.

Nenhum commit, push, PR ou deploy realizado.
