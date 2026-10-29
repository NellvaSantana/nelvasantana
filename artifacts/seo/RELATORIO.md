Auditoria e implementação de SEO técnico — Nellva Sântana

Data: 29/10/2026. Branch: `dev`, originalmente limpa. Nenhuma troca de branch, alteração de ambiente, DNS ou Vercel, commit, merge, push ou deploy realizado.

1. **Diagnóstico inicial**

O projeto usa Next.js 16.3.4 com App Router. A home e as rotas de metadata são pré-renderizadas estaticamente. As nove rotas antigas redirecionam permanentemente para seções da home; não são páginas independentes para inclusão no sitemap.

`app/sitemap.ts` retornava `[]` quando `NEXT_PUBLIC_SITE_URL` estava ausente. A mesma condição removia canonical, metadataBase, URL do Person e referência ao sitemap no robots. O build inicial emitiu aviso de fallback para `http://localhost:3000` nas imagens sociais. Não foi necessário ler valores de variáveis ou alterar arquivos de ambiente.

Na consulta pública, a home respondeu 200, o sitemap respondeu XML vazio e o robots continha apenas `User-Agent: *` e `Allow: /`. HTTP e HTTPS com www responderam 308 para `https://nellvasantana.com.br/`. Não foram encontradas referências a domínios antigos, previews ou localhost no código de produção auditado. URLs externas legítimas foram preservadas.

2. **Implementações**

Criada uma fonte única e explícita para o domínio institucional em `data/seo.ts`, independente do hostname de preview ou da presença de variáveis. Corrigidas as implementações existentes de sitemap e robots, sem rotas paralelas. Sitemap com exatamente uma URL absoluta, sem fragmentos, lastModified, priority ou changeFrequency.

MetadataBase, canonical e og:url passaram a utilizar o domínio oficial. Preservados o título “Nellva Sântana — Site Oficial” e a descrição existente, por identificarem a artista e refletirem o conteúdo aprovado com mais especificidade musical que as sugestões genéricas. Textos de compartilhamento e a imagem Open Graph de 1200 × 630 já existente foram preservados. O Next.js fornece a imagem pela convenção `app/opengraph-image.tsx`, também usada no Twitter Card.

O único JSON-LD Person foi enriquecido com identificador estável, descrição, profissão confirmada, fotografia já usada no Hero e os três links sociais do próprio projeto. Nenhuma biografia nova, data, premiação ou evento foi criado. Mantido Person, sem inventar uma organização ou grupo musical. Serialização escapa `<` antes de inserir o JSON no HTML.

3. **Arquivos**

- `app/layout.tsx`: metadata e Person.
- `app/sitemap.ts`: uma URL canônica incondicional.
- `app/robots.ts`: referência ao sitemap oficial.
- `data/seo.ts`: domínio e descrição centralizados.
- `artifacts/seo/validate.mjs`: verificação HTTP e navegador reproduzível.
- `artifacts/seo/validacao.json`: resultado das verificações.
- `artifacts/seo/RELATORIO.md`: diagnóstico, limites e entrega.

4. **SEO final validado localmente**

| Item | Resultado |
| --- | --- |
| Sitemap | HTTP 200; XML analisado por DOMParser sem erros; namespace correto; somente https://nellvasantana.com.br/ |
| Robots | HTTP 200; rastreamento permitido; sitemap absoluto oficial |
| Metadata | Título e descrição preservados; base oficial; sem noindex/nofollow na home |
| Canonical | https://nellvasantana.com.br/ |
| Open Graph | website, pt_BR, título, descrição, siteName, URL e imagem oficial do projeto |
| Twitter | summary_large_image; imagem absoluta responde 200 e content-type de imagem |
| JSON-LD | Um objeto Person; JSON parseável; URL, imagem e redes coerentes com o projeto |
| Idioma | pt-BR |
| Ícone | Rota /icon responde 200 com imagem; não há apple-touch-icon dedicado |
| Imagens | Todas com atributo alt; fotos informativas com descrição; miniaturas e fundos decorativos com alt vazio; dimensões ou fill com contêiner e sizes existentes |
| Semântica | Um H1 com nome acessível pela assinatura, um main, header/nav/footer, H2 de seção e H3 de itens; âncoras sem destino inexistente |

O Next.js serializa og:url sem a barra final da origem; a URL normalizada é equivalente à canonical. O sitemap e canonical mantêm a barra final solicitada.

5. **Validações executadas**

- `npm run lint`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run build`: aprovado; aviso de metadataBase eliminado; rotas continuam estáticas.
- `git diff --check`: aprovado.
- `node artifacts/seo/validate.mjs`, com servidor de produção na porta 3100: aprovado.
- XML válido e não vazio, robots, tags HTML reais, canonical, JSON-LD, imagens sociais e ícone: aprovados.
- Nove rotas antigas: 308 para as âncoras esperadas; rota inexistente: 404.
- Navegador em 390 e 1440 px: sem erros JavaScript, sem overflow horizontal; menu abre e fecha por Escape; HTML do main idêntico à versão inicial.
- Capturas de página inteira: 1440 px idêntica byte a byte. Em 390 px, mesmas dimensões; 284.172 pixels diferentes exclusivamente dentro de imagens devido ao carregamento assíncrono. Comparação de pixels com as áreas dos elementos img excluídas encontrou zero diferenças. As capturas temporárias ficam em `/tmp/nellva-seo/` e não integram o código de produção.

Para repetir os testes de rotas, execute `npm run build`, `npm run start -- --port 3100` e, em outro terminal, `node artifacts/seo/validate.mjs`. O script repete a comparação com a baseline visual somente se as capturas temporárias desta sessão existirem; sem baseline, os checks HTTP, HTML e funcionais continuam sendo executados.

6. **Performance, acessibilidade e segurança: limites e pendências**

Sem mudança de layout, paleta, tipografia, imagens, enquadramentos, animações, navegação ou textos visíveis. Lora e demais fontes foram integralmente preservadas. Fontes usam next/font com display swap. Hero já tem carregamento eager e sizes responsivo; as demais imagens usam next/image e lazy loading padrão ou explícito. Vídeos só carregam o iframe quando abertos. A página principal permanece Server Component, com interatividade nos componentes existentes. Nenhuma otimização especulativa foi aplicada.

Existem originais grandes, incluindo `nellva-booking.jpg` (~15,99 MiB), servidos nas páginas pelo otimizador do Next.js. Isso não equivale ao tamanho transferido ao navegador. Os originais foram preservados. LCP, INP e CLS de campo não foram medidos; não há evidência suficiente para atribuir notas ou afirmar aprovação de Core Web Vitals. Recomenda-se avaliar dados reais do Search Console/PageSpeed após publicação antes de novas intervenções.

A estrutura acessível foi verificada, mas não foi realizada certificação WCAG, auditoria completa de contraste ou teste com leitor de tela. Ajustes que afetem cores ou conteúdo dependem da aprovação da cliente. Ícone Apple dedicado é melhoria opcional de identidade em dispositivos, sem bloqueio à indexação; depende de escolha/aprovação do asset. Não foi feita simulação de compartilhamento nos aplicativos WhatsApp/Facebook/LinkedIn; tags e disponibilidade dos recursos foram verificadas localmente. JSON-LD não foi enviado a um validador externo nem implica elegibilidade a rich results ou painel de conhecimento.

`.next/`, `out/`, dependências, metadados locais da Vercel e arquivos de ambiente estão ignorados. Não há arquivos gerados rastreados nesses diretórios, nem arquivos públicos fora da pasta de imagens; apenas `.env.example` está versionado. As alterações contêm exclusivamente dados públicos confirmados. Isso não constitui varredura completa de segredos ou remediação histórica. Incidente GitGuardian não foi alterado, resolvido ou investigado além da higiene pertinente à tarefa.

7. **Publicação e Search Console — execução posterior**

As correções ainda não estão publicadas: produção continua usando o código anterior. Revisar o diff em dev e seguir o fluxo habitual do projeto para integrar em main e publicar na Vercel, após autorização. Não é necessário criar ou alterar NEXT_PUBLIC_SITE_URL para estas correções.

Após publicação, abrir a home, `/robots.txt`, `/sitemap.xml` e a imagem social no domínio oficial. Confirmar 200, ausência de X-Robots-Tag noindex e canonical oficial no HTML. O sitemap deve conter um único loc com `https://nellvasantana.com.br/`, e o robots deve apontar para `https://nellvasantana.com.br/sitemap.xml`.

Na propriedade já verificada do Search Console, acessar “Sitemaps” e enviar `https://nellvasantana.com.br/sitemap.xml`. Acompanhar sucesso de processamento, última leitura e páginas descobertas. Inspecionar a home para conferir canonical e acompanhar a solicitação de indexação já enviada, sem necessidade de repetir solicitações continuamente.

Segundo a [documentação do Google](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap), o sitemap deve listar URLs absolutas e preferencialmente canônicas; priority/changefreq são ignorados e lastmod deve refletir atualização real. Envio do sitemap não garante rastreamento, indexação imediata ou posicionamento.

Referências técnicas locais consultadas: documentação instalada do Next.js 16.3.4 para sitemap, robots e generate-metadata em `node_modules/next/dist/docs/01-app/03-api-reference/`.
