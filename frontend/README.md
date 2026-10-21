# Controle suas Finanças — Frontend

Interface web da aplicação de controle financeiro pessoal, consumindo a API REST do projeto
(desenvolvida em Java 17 com Spring Boot e MySQL).

## Tecnologias

- **React 18** (JavaScript) — interface baseada em componentes
- **Vite** — build e servidor de desenvolvimento
- **React Router** — navegação entre páginas
- **Axios** — comunicação com a API REST
- **Recharts** — gráficos financeiros
- **Lucide React** — ícones
- **Fetch + OpenAI/Gemini** — assistente de IA para lançar movimentações por linguagem natural
- **CSS3** puro (variáveis + design system), sem framework de terceiros

## Como executar

```bash
cd frontend
npm install
npm run dev
```

A aplicação fica disponível em `http://localhost:5173`.

Build de produção:

```bash
npm run build    # gera a pasta dist/
npm run preview  # serve o build localmente
```

## Variáveis de ambiente

Crie um arquivo `.env` na pasta `frontend/` a partir do `.env.example`:

| Variável           | Descrição                                              | Padrão                  |
| ------------------ | ------------------------------------------------------ | ----------------------- |
| `VITE_API_URL`     | URL base da API REST                                   | `http://localhost:8080` |
| `VITE_USE_MOCKS`   | `true` usa dados simulados; `false` consome a API real | `true`                  |

## Fonte de dados

O backend **ainda não existe neste repositório** — a pasta apenas contém o README com o
planejamento da API. Enquanto isso, o frontend roda com uma camada local de dados:

- A lista de movimentações começa **vazia** — cadastre seus próprios registros pela interface.
- Os registros criados são persistidos no `localStorage` do navegador
  (`csf:mock-movimentacoes`) e sobrevivem ao recarregamento. Ao trocar para a API real,
  esses dados locais deixam de ser usados.
- Basta definir `VITE_USE_MOCKS=false` no `.env` para que as mesmas chamadas de serviço
  (`services/*.js`) atiquem a API real, sem alteração de componentes.
- A lista de categorias (`src/services/mock/mockData.js`, `MOCK_CATEGORIAS`) é uma
  substituta provisória do `GET /api/categorias` — edite-a conforme o backend evoluir.

## Contrato de API esperado

Os serviços foram implementados contra o seguinte contrato REST (a ser implementado no backend):

### Movimentações

| Método | Rota                          | Descrição                                    |
| ------ | ----------------------------- | -------------------------------------------- |
| GET    | `/api/movimentacoes`          | Lista paginada com filtros                   |
| POST   | `/api/movimentacoes`          | Cria uma movimentação                        |
| GET    | `/api/movimentacoes/{id}`     | Detalhes de uma movimentação                 |
| PUT    | `/api/movimentacoes/{id}`     | Atualiza uma movimentação                    |
| DELETE | `/api/movimentacoes/{id}`     | Exclui uma movimentação (204)                |

Query params de `GET /api/movimentacoes`:

```
tipo=RECEITA|DESPESA
categoria=Alimentação
dataInicio=2026-01-01
dataFim=2026-01-31
busca=salário
ordenacao=-data|data|-valor|valor   (padrão: -data)
pagina=0
tamanho=10
```

Resposta no formato Spring Data Page:

```json
{
  "content": [ { "...": "MovimentacaoDTO" } ],
  "totalElements": 42,
  "totalPages": 5,
  "number": 0,
  "size": 10,
  "first": true,
  "last": false,
  "empty": false
}
```

`MovimentacaoDTO`:

```json
{
  "id": 1,
  "descricao": "Supermercado",
  "valor": 250.50,
  "tipo": "DESPESA",
  "categoria": "Alimentação",
  "data": "2026-01-15",
  "observacao": "",
  "local": "Supermercado Pão de Açúcar",
  "formaPagamento": "A_VISTA",
  "totalParcelas": 1,
  "parcelaAtual": 1,
  "statusPagamento": "PAGO"
}
```

Campos adicionais de despesas (opcionais; ignorados para `tipo=RECEITA`):

| Campo            | Tipo                       | Descrição                                              |
| ---------------- | -------------------------- | ------------------------------------------------------ |
| `local`          | string (até 80)            | O que foi comprado / estabelecimento                   |
| `formaPagamento` | `A_VISTA` \| `PARCELADO`   | Forma de pagamento                                     |
| `totalParcelas`  | int (2–96 se parcelado)    | Total de parcelas                                      |
| `parcelaAtual`   | int (≥ 1)                  | Parcela referente ao registro                          |
| `statusPagamento`| `PAGO` \| `PENDENTE`       | `PENDENTE` identifica dívidas não pagas                |

> A interface exibe "Entrada" para `tipo=RECEITA` e "Despesa" para `tipo=DESPESA`.

### Categorias

| Método | Rota               | Descrição                       |
| ------ | ------------------ | ------------------------------- |
| GET    | `/api/categorias`  | Lista de categorias (somente leitura) |

`CategoriaDTO`: `{ "id": 1, "nome": "Alimentação", "tipo": "DESPESA", "cor": "#8b5cf6" }`

> A página **Categorias** é apenas de visualização porque a API planejada não possui
> endpoints de criação/edição/exclusão. Caso sejam criados no futuro, basta
> adicionar as operações em `services/categoriasService.js`.

### Erros

Espera-se resposta de erro no formato `{ "message": "..." }` (ou Bean Validation:
`{ "errors": [ { "defaultMessage": "..." } ] }`). O frontend converte falhas HTTP,
ausência de conexão e respostas inesperadas em mensagens compreensíveis (via `ApiError`).

## Estrutura

```
frontend/
├── src/
│   ├── components/
│   │   ├── layout/        # Sidebar, AppLayout
│   │   ├── dashboard/     # StatCard, gráficos, atalhos, recentes
│   │   ├── transactions/  # Tabela, filtros, formulário, detalhes, confirmação
│   │   └── ui/            # Modal, Toast, Pagination, estados, CurrencyInput…
│   ├── pages/             # Dashboard, Movimentacoes, Receitas, Despesas,
│   │                      # Assistente, Categorias, Configuracoes
│   ├── services/          # api.js (Axios), movimentacoesService, dashboardService,
│   │   │                  # categoriasService
│   │   ├── ai/            # assistente de IA (providers OpenAI/Gemini, prompt, agente)
│   │   └── mock/          # adaptador e dados locais (localStorage)
│   ├── hooks/             # useFetch, useLocalStorage
│   ├── utils/             # formatação (BRL, datas), validação, constantes
│   └── styles/            # variables.css, global.css (design system)
├── .env.example
└── package.json
```

## Funcionalidades

- **Dashboard**: saudação, seletor de período, cards de saldo/entradas/despesas/resultado,
  gráfico entradas × despesas (6 meses), gráfico de despesas por categoria, movimentações
  recentes e atalhos.
- **Movimentações**: listagem paginada, busca por descrição, filtros de período/categoria/tipo,
  ordenação por data e valor, visualização, edição, exclusão com confirmação e formulário
  validado (com máscara monetária). Despesas possuem campos detalhados: o que foi comprado
  (`local`), forma de pagamento (à vista/parcelado), total e parcela atual, e situação
  (pago/pendente — dívidas).
- **Entradas / Despesas**: mesma base de movimentações com tipo fixado e totais do período.
  O rótulo "Receita" da API é exibido como "Entrada" na interface.
- **Categorias**: visualização das categorias da API com contagem e soma de uso
  (somente leitura — sem endpoints de escrita na API).
- **Assistente IA**: aba dedicada com chat. Você descreve o lançamento em linguagem
  natural (ex.: “Gastei 50 reais no almoço hoje”) e o assistente interpreta, calcula e
  propõe a movimentação. **Nada é salvo sem a sua confirmação** — cada proposta aparece
  como um cartão com “Confirmar e lançar” / “Descartar”. O histórico da conversa é salvo
  no navegador (localStorage `csf:ai:conversa`). Veja a seção *Assistente de IA* abaixo.
- **Configurações**: preferências visuais locais (localStorage) — nome para a saudação,
  modo compacto, animações dos gráficos e **modo noturno** —, configuração do assistente
  de IA (provedor, chave, modelo) e informações de conexão. Não há gerenciamento de conta —
  o backend não possui autenticação.

## Assistente de IA

O assistente usa um provedor externo de IA (**OpenAI** ou **Google Gemini**) para
interpretar as frases. Como este projeto ainda não tem backend, a chamada é feita
diretamente do navegador:

- A **chave de API** é informada em *Configurações → Assistente de IA* e fica salva apenas
  no **localStorage** do seu navegador (`csf:ai:config`). Ela é enviada somente ao provedor
  escolhido — nunca a servidores intermediários.
- **Atenção à segurança**: qualquer chave usada no navegador fica acessível a quem tiver
  acesso ao dispositivo. Use uma chave restrita, de uso pessoal, e **nunca comite a chave**
  no código ou no `.env`. Para uso multiusuário, o ideal é um backend/proxy que guarde a
  chave e exponha um endpoint próprio (ex.: `POST /api/assistente`).
- O provedor precisa permitir requisições a partir do navegador (CORS). É possível apontar
  para um proxy/gateway no campo **URL base (avançado)**. Modelo padrão do Gemini:
  `gemini-3.8-flash` (modelos 2.5 foram aposentados para novas contas).

Fluxo: a frase é enviada ao modelo, que responde em JSON estruturado (`mensagem` + lista de
`propostas`). O frontend valida/normaliza cada proposta (`services/ai/agentService.js`) e
exibe para confirmação. Só após o “Confirmar” a movimentação é criada via
`POST /api/movimentacoes` (ou na camada local, em modo demo).

## Diferenças em relação ao plano original

- **Endpoint `GET /api/dashboard`**: não foi inventado. Os agregados (saldo, totais, série
  mensal, despesas por categoria) são calculados no frontend a partir das movimentações
  reais (`services/dashboardService.js`). Se o backend criar esse endpoint no futuro,
  basta substituir a implementação do serviço.
- **Autenticação**: não implementada, pois o backend não a possui. O frontend não armazena
  senhas nem tokens.

## Pendências no backend

Para conectar o frontend à API real, o backend precisa implementar os endpoints de
movimentações (CRUD paginado com filtros) e o `GET /api/categorias`, com os contratos
descritos acima, além de habilitar **CORS** para `http://localhost:5173`.
