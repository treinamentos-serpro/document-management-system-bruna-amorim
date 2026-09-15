# Especificação - Document Management System

## 1. Objetivo

Permitir que usuários enviem, consultem e baixem documentos de forma simples, com armazenamento local seguro no filesystem da aplicação e metadados mantidos em memória durante esta fase inicial.

## 2. Escopo

### Dentro do escopo

- Upload de documentos
- Listagem de documentos
- Download de documentos
- Gestão simples por usuário
- Persistência local de arquivos em `backend/storage`
- Registro dos metadados em memória
- Estrutura de backend em Clean Architecture simples

### Fora do escopo

- Armazenamento externo ou em nuvem
- Versionamento de documentos
- Autenticação e autorização complexa
- Controle de usuários avançado
- Sincronização entre instâncias da aplicação

## 3. Requisitos funcionais

| ID | Requisito |
| --- | --- |
| RF-01 | O sistema deve permitir o envio de um arquivo por meio de um formulário multipart. |
| RF-02 | O sistema deve validar que o arquivo foi recebido antes de persistir os dados. |
| RF-03 | O sistema deve registrar metadados do documento, incluindo identificador único, nome original, tamanho, data de upload e dono. |
| RF-04 | O sistema deve listar todos os documentos cadastrados com seus metadados. |
| RF-05 | O sistema deve permitir o download do conteúdo de um documento pelo identificador único. |
| RF-06 | O sistema deve retornar erro claro quando um documento não for encontrado para download. |
| RF-07 | O sistema deve preservar o nome original do arquivo no metadata para facilitar a apresentação ao usuário. |
| RF-08 | O sistema deve aceitar um identificador de usuário responsável pelo upload para manter a noção de dono do documento. |

## 4. Requisitos não funcionais

| ID | Requisito |
| --- | --- |
| RNF-01 | Os arquivos devem ser gravados no filesystem local da aplicação em `backend/storage`, usando `multer` com `diskStorage`. |
| RNF-02 | Os metadados dos documentos devem ser mantidos em memória nesta fase, sem banco de dados. |
| RNF-03 | A aplicação deve seguir a arquitetura em camadas: `routes -> controllers -> services -> repositories`. |
| RNF-04 | A configuração da aplicação deve respeitar princípios 12-Factor, usando variáveis de ambiente quando necessário. |
| RNF-05 | O backend deve ser implementado em Node.js com Express e manter a estrutura simples e legível. |
| RNF-06 | O código deve ser organizado seguindo convenções de nomes em inglês e mensagens em português. |

## 5. Modelo de dados (metadados do documento)

| Campo | Tipo | Descrição |
| --- | --- | --- |
| id | string | Identificador único do documento gerado pela aplicação. |
| originalName | string | Nome do arquivo enviado pelo usuário. |
| size | number | Tamanho do arquivo em bytes. |
| uploadedAt | string | Data/hora do upload no formato ISO 8601. |
| owner | string | Identificador do usuário que realizou o upload. |
| fileName | string | Nome físico do arquivo armazenado no servidor; campo interno, não obrigatório em resposta pública. |
| filePath | string | Caminho local do arquivo em disco; campo interno, não obrigatório em resposta pública. |

## 6. Contratos de API

### POST /upload

- Entrada: arquivo em `multipart/form-data` e campo `owner` opcional
- Resposta de sucesso: 201 com o metadata do documento criado
- Resposta de erro: 400 quando o arquivo não foi enviado ou a solicitação é inválida

Exemplo de resposta:

```json
{
  "id": "c4ce3d9c-9aca-4b71-b7ab-f7db5a219d5d",
  "originalName": "contrato.pdf",
  "size": 245678,
  "uploadedAt": "2026-09-15T12:00:00.000Z",
  "owner": "bruna"
}
```

### GET /documents

- Saída: lista de metadados de todos os documentos
- Resposta de sucesso: 200 com array de objetos de documento
- Resposta vazia: 200 com array vazio quando não houver arquivos

### GET /documents/:id/download

- Entrada: identificador do documento na URL
- Resposta de sucesso: 200 com o conteúdo binário do arquivo e cabeçalho apropriado
- Resposta de erro: 404 se o documento não for localizado

## 7. Decisões arquiteturais

- Backend em Clean Architecture simples (routes, controllers, services, repositories)
- Fluxo de dependência: `routes -> controllers -> services -> repositories`
- Frontend em React com componentes e serviços dedicados para consumo do backend
- Armazenamento local apenas, sem serviços externos ou provedores de nuvem
- Metadados em memória para manter o seed simples e evolutivo
- Validação mínima no controller e regras de negócio centralizadas no service

## 8. Plano de execução

1. Definir a estrutura das camadas do backend em `backend/src` e preparar as rotas públicas.
2. Implementar o repositório responsável por armazenar os metadados em memória e manter os arquivos no filesystem local.
3. Implementar o service de documentos com regras de criação, listagem e download, respeitando a persistência local.
4. Implementar os controllers para tratar requisições HTTP e responder com códigos adequados.
5. Registrar as rotas no aplicativo Express e configurar o upload com `multer` e `diskStorage`.
6. Validar o comportamento do backend por testes de fumaça e integração, cobrindo upload, listagem e download.
7. Revisar a organização por camadas e confirmar que a aplicação segue as restrições do projeto.

## 9. Critérios de aceite

- O sistema consegue receber um arquivo e retornar os metadados esperados.
- A listagem de documentos funciona sem erros e retorna os arquivos salvos.
- O download retorna o conteúdo original do arquivo de forma confiável.
- Os documentos são armazenados localmente em `backend/storage`.
- O backend respeita a arquitetura em camadas e as convenções do projeto.
