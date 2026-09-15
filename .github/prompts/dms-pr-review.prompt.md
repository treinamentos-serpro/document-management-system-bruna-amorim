---
description: Revisa e trata um comentário de PR no Document Management System.
name: dms-pr-review
argument-hint: comentário ou solicitação de revisão
agent: agent
---

# Revisão de comentário do DMS

Analise e trate o seguinte comentário de revisão:

`${input:comentario:comentário ou solicitação}`

Siga este fluxo:

1. Localize o código afetado e confirme o comportamento atual antes de editar.
2. Altere somente o problema apontado, preservando mudanças não relacionadas.
3. Respeite a arquitetura `routes -> controllers -> services -> repositories`.
4. Para upload e download, verifique validação de entrada, path traversal, nomes de arquivo e erros do filesystem.
5. Adicione ou ajuste testes usando `node:test` e `node:assert` quando o comportamento ainda não estiver coberto.
6. Execute os testes do backend com `cd backend && npm test` e o build do frontend com `cd frontend && npm run build` quando as áreas forem afetadas.
7. Ao final, informe o diagnóstico, os arquivos alterados, os testes executados e qualquer risco restante.

Se o comentário não fizer sentido ou exigir uma mudança fora do escopo, explique o motivo e não faça uma alteração especulativa.
