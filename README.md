# 💰 Finanças - Controle Financeiro Pessoal

> **Full Stack Application** - Spring Boot 3 + React + MySQL  
> Projeto pessoal de controle de receitas, despesas e dashboard financeiro.

---

## 📸 Demo

![Dashboard](docs/dashboard.png)
![Movimentações](docs/movimentacoes.png)
![Categorias](docs/categorias.png)

---

## 🚀 Tecnologias Utilizadas

### Back-end
| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| **Java** | 17 LTS | Linguagem principal |
| **Spring Boot** | 3.2.5 | Framework principal |
| **Spring Web** | - | REST API |
| **Spring Data JPA** | - | Persistência / ORM |
| **Spring Validation** | - | Bean Validation (JSR-380) |
| **MySQL Driver** | 8.0+ | Conexão banco de dados |
| **Lombok** | 1.18.30 | Redução de boilerplate |
| **Maven** | 3.9+ | Build & dependências |

### Front-end
| Tecnologia | Versão | Finalidade |
|------------|--------|------------|
| **React** | 18.3 | UI Library |
| **Vite** | 6.0 | Build tool / Dev server |
| **Axios** | 1.7 | HTTP Client |
| **Recharts** | 3.10 | Gráficos |
| **Lucide React** | 0.469 | Ícones |
| **React Router** | 6.28 | Roteamento |

### Banco de Dados
| Tecnologia | Versão |
|------------|--------|
| **MySQL** | 8.0+ |
| **Database** | `financas_db` |

### Ferramentas & Qualidade
- **ProblemDetail (RFC 7807)** - Padronização de erros HTTP
- **Bean Validation** - Validação declarativa (@NotBlank, @DecimalMin, @PastOrPresent, @Pattern)
- **CORS Configurado** - Integração front/back sem bloqueios
- **Paginação Spring Data** - Performance em listas grandes
- **DTO Pattern** - Desacoplamento API ↔ Banco

---

## 🧠 Como Pensei (Processo de Desenvolvimento)

### 1. **Entender o Front-end Primeiro**
> *"Não invente campos ou funcionalidades sem verificar se fazem sentido para a aplicação existente."*

- Analisei o front-end React/Vite já pronto
- Identifiquei contratos esperados: `/api/movimentacoes`, `/api/dashboard/resumo`, `/api/categorias`
- Mapeei parâmetros de query: `pagina`, `tamanho`, `ordenacao`, `dataInicio`, `dataFim`
- Entendi formato de resposta: Spring Page `{content, totalPages, totalElements}`

### 2. **Arquitetura em Camadas (Clean Architecture Simplificada)**
```
controller → service → repository → entity
     ↓         ↓           ↓         ↓
   HTTP      Regras      JPA       Banco
   DTOs      Negócio     Queries   Tabelas
```

**Decisões-chave:**
- **DTOs separados das Entities** → API não vaza estrutura do banco
- **Service Layer** → Regras centralizadas (ex: saldo = receitas - despesas)
- **Repository com Queries Derivadas + @Query** → Zero SQL nativo para CRUD, SQL só para agregações
- **GlobalExceptionHandler** → Um só lugar para 400/404/500 (ProblemDetail RFC 7807)

### 3. **Modelagem de Dados**

**Transação (Movimentação):**
```java
- id, descrição, valor (BigDecimal), tipo (RECEITA/DESPESA), 
  categoria, data, observacao, criadoEm (auditoria)
```

**Categoria:**
```java
- id, nome, tipo (RECEITA/DESPESA), descrição, cor (hex #RRGGBB), criadoEm
```

**Por que BigDecimal?** → Evita bugs de ponto flutuante em dinheiro  
**Por que Enum?** → Type safety, só aceita RECEITA/DESPESA  
**Por que @PrePersist?** → Auditoria automática (criadoEm)

### 4. **Compatibilidade Front-end First**
O front já existia, então o back **se adaptou**:
- Alias `/api/movimentacoes` (além de `/api/transacoes`)
- Mapeamento de parâmetros: `pagina`→`page`, `tamanho`→`size`, `ordenacao`→`sort`
- Campo `observacao` adicionado na entity/DTO
- Campo `cor` (hex) nas categorias
- Paginação Spring Page nativa (`{content, totalPages, totalElements...}`)

### 5. **Validação & Segurança**
- **Server-side always** → Nunca confio no front
- **Bean Validation** → `@NotBlank`, `@DecimalMin("0.01")`, `@PastOrPresent`, `@Pattern`
- **Enum validation customizada** → 400 claro se enviar "INVALIDO"
- **CORS restrito** → Só origens conhecidas (localhost:3000, 5173, 5500, 8080)

### 6. **Estratégia de Erros (RFC 7807)**
```json
// 400 Validação
{ "erros": { "campo": "mensagem" } }

// 404 Not Found
{ "detail": "Transação não encontrada com id: 999" }

// 500 Internal
{ "detail": "Erro interno do servidor" }
```
Front-end trata tudo com um `extractErrorMessage` único.

---

## 🏗️ Como Ficou (Resultado Final)

### Funcionalidades Implementadas

| Módulo | Endpoints | Status |
|--------|-----------|--------|
| **Health Check** | `GET /api/health` | ✅ |
| **Movimentações (CRUD)** | `GET/POST/PUT/DELETE /api/movimentacoes` | ✅ |
| **Filtros Avançados** | `?pagina=&tamanho=&ordenacao=&dataInicio=&dataFim=&tipo=&categoria=` | ✅ |
| **Paginação** | Spring Page nativa | ✅ |
| **Dashboard** | `GET /api/dashboard/resumo` | ✅ |
| **Categorias (CRUD)** | `GET/POST/PUT/DELETE /api/categorias` | ✅ |
| **Validação Completa** | 400 com detalhes por campo | ✅ |
| **Tratamento Erros** | RFC 7807 ProblemDetail | ✅ |

### Dashboard Response
```json
{
  "totalReceitas": 6700.00,
  "totalDespesas": 50.00,
  "saldo": 6650.00,
  "quantidadeTransacoes": 3,
  "receitasPorCategoria": [
    { "categoria": "Trabalho", "total": 6700.00, "quantidade": 2 }
  ],
  "despesasPorCategoria": [
    { "categoria": "Lazer", "total": 50.00, "quantidade": 1 }
  ]
}
```

### Movimentação Response (Paginada)
```json
{
  "content": [
    { "id": 1, "descricao": "Salário", "valor": 5500.00, "tipo": "RECEITA", 
      "categoria": "Trabalho", "data": "2026-10-20", "observacao": "Pagamento mensal",
      "criadoEm": "2026-10-21T15:50:08" }
  ],
  "totalPages": 1,
  "totalElements": 3,
  "size": 20,
  "number": 0
}
```

---

## ▶️ Como Rodar Localmente

### Pré-requisitos
- Java 17+
- MySQL 8.0+
- Node.js 18+ (para front)
- Maven 3.9+ (ou use `./mvnw`)

### 1. Banco de Dados
```sql
CREATE DATABASE financas_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- Usuario/senha configurados no application.yaml (padrão: root/admin123)
```

### 2. Back-end
```bash
cd financas-backend
# Configure JAVA_HOME para Java 17 se necessário
./mvnw spring-boot:run
# Roda em http://localhost:8080
```

### 3. Front-end
```bash
cd financas-frontend
cp .env.example .env  # Ajuste VITE_API_URL se necessário
npm install
npm run dev
# Roda em http://localhost:5173
```

### 4. Testar API (Postman/Insomnia)
Importe a collection: `docs/postman-collection.json`

---

## 📁 Estrutura do Projeto

```
financas/
├── financas-backend/          # Spring Boot
│   ├── src/main/java/com/gustavo/financas/
│   │   ├── config/            # WebConfig (CORS)
│   │   ├── controller/        # REST Controllers
│   │   ├── dto/               # Request/Response DTOs
│   │   ├── entity/            # JPA Entities
│   │   ├── exception/         # GlobalExceptionHandler
│   │   ├── repository/        # Spring Data JPA Repositories
│   │   ├── service/           # Business Logic
│   │   └── FinancasApplication.java
│   ├── src/main/resources/application.yaml
│   └── pom.xml
│
└── financas-frontend/         # React + Vite
    ├── src/
    │   ├── services/          # API clients (api.js, *Service.js)
    │   ├── components/        # UI Components
    │   ├── pages/             # Pages/Routes
    │   ├── hooks/             # Custom Hooks
    │   └── utils/             # Helpers (date, constants)
    ├── .env
    └── package.json
```

---

## 🎯 Lições Aprendidas

1. **Front-first design** → O back serve o front, não o contrário
2. **DTO ≠ Entity** → Desacoplamento evita dores futuras
3. **ProblemDetail (RFC 7807)** → Padroniza erros, facilita consumo
4. **BigDecimal para dinheiro** → Nunca use float/double
5. **Validação no back** → Front valida UX, back valida integridade
6. **Paginação nativa** → Spring Data Page economiza código
7. **Alias de rotas** → `/movimentacoes` + `/transacoes` = compatibilidade zero breaking changes

---

## 📈 Próximos Passos (Roadmap)

- [ ] Testes unitários (JUnit 5 + Mockito)
- [ ] Testes de integração (@SpringBootTest + Testcontainers)
- [ ] Swagger/OpenAPI (springdoc-openapi)
- [ ] Flyway Migrations (versionamento de schema)
- [ ] Docker Compose (back + db + front)
- [ ] CI/CD GitHub Actions
- [ ] Autenticação JWT + Spring Security (se front precisar)
- [ ] Relatórios PDF/Excel (Apache POI / iText)

---

## 👨‍💻 Autor

**Gustavo** - Estudante de Engenharia/Desenvolvimento  
Projeto de portfólio - Full Stack Java + React

---

## 📄 Licença

Este projeto é para fins educacionais e de portfólio.  
Sinta-se à vontade para estudar, adaptar e evoluir.

---

> *"Código limpo não é escrito seguindo regras, mas entendendo o porquê de cada decisão."*  
> — Construído com foco em aprendizado, boas práticas e entrega real.