# Auditoria Git e segurança — Nellva Sântana

Data: 27/10/2026. Branch auditada: `dev`, HEAD `3dcd23f2002710890ad612dfa81833afaab6a6be`.

## Causa e correção

O primeiro commit, `6287e0d579a782a7f2eb72db7f1c416b39229fb1` (31/08/2026), já incluiu `.next`; seu `.gitignore` continha apenas `node_modules`. O commit seguinte, `a4db01a`, adicionou `.next/` e outras exclusões, mas não retirou os arquivos do índice. Exclusões não afetam arquivos já rastreados. Na abertura da auditoria havia oito modificações de `.next/dev` já staged.

Foi atualizado apenas o arquivo de configuração `.gitignore`, mantendo `.env.example` permitido. Foram acrescentadas exclusões para build, cobertura, metadados locais Vercel, logs, temporários, arquivos de editor e `next-env.d.ts`.

Foram removidos somente do índice, com `git rm --cached`:

- Todos os 631 caminhos rastreados sob `.next/`: manifests, caches, bundles, fontes, tipos e traces de desenvolvimento e produção.
- `tsconfig.tsbuildinfo`.
- `next-env.d.ts`: o build confirmou que este arquivo gerado muda suas referências entre `.next/dev/types` e `.next/types`. Foi preservado localmente e passa a ser ignorado; Next.js o regenera em novos ambientes.

Total: 633 remoções staged. Os oito arquivos inicialmente staged estão incluídos na retirada solicitada de `.next`; seus conteúdos locais não foram apagados. As remoções aparecerão uma vez no Source Control até um commit autorizado. Após isso, regenerações normais serão ignoradas. `git add -f` ainda pode forçar inclusão e deve ser evitado.

Nenhum código de aplicação, configuração de TypeScript ou dependência foi modificado. Nenhum commit, push, deploy, reset, clean, revogação ou reescrita de histórico foi executado.

## Investigação do GitGuardian

### Exposição confirmada e candidatos ao alerta

Os arquivos `.next/prerender-manifest.json`, `.next/dev/prerender-manifest.json` e `.next/cache/.previewinfo` contêm `previewModeSigningKey` e `previewModeEncryptionKey`. Já estavam presentes no primeiro commit `6287e0d579a782a7f2eb72db7f1c416b39229fb1`, de 31/08/2026, e foram incluídos em outros commits posteriores.

Também foram encontradas chaves em `.next/cache/.rscinfo`, `.next/dev/cache/.rscinfo` (`encryption.key`) e `.next/server/server-reference-manifest.json` / `.next/dev/server/server-reference-manifest.json` (`encryptionKey`). Estes são outros possíveis candidatos ao detector genérico.

A publicação é confirmada pela ancestralidade do primeiro commit em `origin/main` e `origin/dev`. Uma consulta ao servidor com `git ls-remote` confirmou que as pontas remotas continuam em `279284df9566e9e7fe08fed3c5180deb476ab169` (main) e `3dcd23f2002710890ad612dfa81833afaab6a6be` (dev), iguais às referências locais examinadas. Os artefatos ainda constam das árvores remotas; a correção atual é local e não remove conteúdo já publicado.

Não há commits com data de autor/committer em 21/10/2026 nas referências disponíveis. Há commits de 16/10 e de 26/10; um push em 21/10 pode perfeitamente transportar commits anteriores. Datas de commit não demonstram a data de push. O clone não é shallow.

**Não foi possível atribuir o incidente específico a um único arquivo/commit.** Falta o detalhe do incidente GitGuardian: identificador ou URL, caminho, SHA e linha/ocorrência detectada. Não é necessário fornecer o valor da chave. Não foram consultados o painel GitGuardian, registros de push nem configurações da hospedagem; referências remotas apagadas e cópias externas também ficam fora da auditoria.

### Origem e finalidade

No Next.js 16.3.4 instalado, `node_modules/next/dist/build/preview-key-utils.js` gera as chaves de Preview Mode com `crypto.randomBytes(32)` e o identificador com `randomBytes(16)`. O desenvolvimento também gera chaves aleatórias em `server/lib/router-utils/filesystem.js`. Elas servem à assinatura/criptografia de cookies de preview e não representam, por si, senha de banco ou credencial de provedor.

O código desta versão mantém cache em `.next/cache/.previewinfo` por até 14 dias e pode reutilizá-lo em builds. Portanto, executar apenas outro build NÃO garante invalidar chaves publicadas. A expiração do cache também não invalida automaticamente uma instância de produção já em execução.

As chaves RSC/Server Actions têm finalidade distinta: criptografia de dados associados a Server Actions. O gerador pode usar `NEXT_SERVER_ACTIONS_ENCRYPTION_KEY` quando fornecida externamente. Não foi encontrada essa configuração no código auditado; a configuração real da hospedagem não foi examinada. Não é possível provar só pelo artefato se houve override externo.

### Segredos reais e risco

Há material criptográfico real publicado. Sua geração automática não torna o evento automaticamente falso positivo. Se um ambiente usa as mesmas chaves, pode haver impacto na confidencialidade/integridade de dados de preview ou de Server Actions, conforme as funcionalidades existentes.

O código atual não implementa Draft/Preview Mode, CMS ou Server Actions. Os manifests examinados no primeiro commit, no commit de 16/10 e nas duas pontas remotas têm mapas `node` e `edge` vazios. O build atual gerou 16 páginas estáticas. Isso reduz o impacto demonstrável no projeto atual, mas não prova quais artefatos ou funcionalidades estavam ativos no ambiente em 21/10.

Uma busca por padrões de chaves privadas, tokens comuns de provedores e atribuições de credenciais em 141 blobs históricos fora de `.next` não encontrou candidatos. Os nomes de arquivos históricos sensíveis encontrados limitam-se a `.env.example`; não foram encontrados `.env` reais ou arquivos de chave privada entre os caminhos históricos. No código atual, as referências de ambiente encontradas são apenas `NEXT_PUBLIC_SITE_URL`. Essa busca por padrões não constitui garantia de ausência de todos os tipos de segredo, particularmente em binários/caches e fontes externas.

Nenhum valor de chave foi reproduzido neste relatório ou no terminal.

## Validação

- `npm run lint`: aprovado.
- `npm run typecheck`: aprovado.
- `npm run build`: aprovado; 16 páginas estáticas. Aviso preexistente de `metadataBase` usando localhost, sem relação com esta correção.
- `git ls-files`: zero arquivos em `.next`, `node_modules`, zero `.tsbuildinfo` e nenhum `next-env.d.ts` rastreado após a correção.
- `git check-ignore -v`: confirma `.next`, `node_modules`, `out`, arquivos de ambiente reais, temporários, logs, `.tsbuildinfo` e `next-env.d.ts`. `.env.example` continua permitido e versionado.
- `git ls-files --others --exclude-standard`: nenhum artefato gerado desses caminhos aparece como novo arquivo após o build.
- `git diff --check` e `git diff --cached --check`: aprovados.
- A integração visual do VS Code não foi acessada; a validação ocorreu diretamente no índice e no working tree usados pelo Source Control.

## Próximos passos e plano sujeito a aprovação

1. Correlacionar o detalhe do incidente com os candidatos listados, sem compartilhar valores secretos.
2. Identificar o deployment ativo e verificar por comparação interna (resultado igual/diferente, sem valores) se usa chaves já publicadas e se existem overrides de ambiente. Nenhuma credencial externa deve ser rotacionada por suposição.
3. Se houver reutilização em ambiente ativo, preparar build em ambiente limpo, sem restaurar caches `.previewinfo` / `.rscinfo` expostos. Se houver override de chave, identificar consumidores e planejar rotação coordenada. Substituir o deployment somente após autorização, considerando invalidação de sessões de preview e de dados/ações em trânsito, além de instâncias antigas.
4. Revisar e autorizar commit/push desta correção para as branches utilizadas. Até lá, o GitHub permanece com os arquivos antigos.
5. Decidir limpeza histórica após confirmar o incidente e invalidar material ativo. Se aprovada: registrar backup restrito e referências afetadas; usar `git filter-repo` em clone separado para remover `.next/` de todo o histórico pertinente; validar refs e segredos; coordenar atualização forçada autorizada, PRs, forks e novos clones; solicitar ao GitHub tratamento de referências/caches residuais quando aplicável. A limpeza não substitui invalidação e não elimina cópias de terceiros. Este plano não foi executado.
6. Registrar a remediação no GitGuardian com a evidência correspondente. Não encerrar como falso positivo só porque a chave foi gerada pelo framework.

Documentação oficial de contexto: https://nextjs.org/docs/pages/guides/preview-mode . Para comportamento de cache/rotação, a evidência prioritária é o código da versão 16.3.4 instalada descrito acima.
