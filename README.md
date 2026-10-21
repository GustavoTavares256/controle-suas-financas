<<<<<<< HEAD
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
=======
# 💰 Controle suas Finanças

Aplicação Full Stack para gerenciamento de finanças pessoais, desenvolvida com o objetivo de facilitar o controle de receitas, despesas e movimentações financeiras. O projeto utiliza uma API REST no backend e uma interface web no frontend, com persistência dos dados em banco de dados relacional.

## 📌 Sobre o projeto

O **Controle suas Finanças** tem como finalidade ajudar o usuário a organizar sua vida financeira por meio do registro e acompanhamento de suas movimentações.

A proposta é permitir que o usuário gerencie suas receitas e despesas, consulte seus registros e acompanhe o resultado financeiro, facilitando a visualização de entradas, saídas e saldo disponível.

A aplicação está sendo desenvolvida com uma arquitetura separada entre frontend e backend, favorecendo a organização do código, a manutenção e a evolução das funcionalidades.

## ✨ Funcionalidades planejadas

- Cadastro, consulta, atualização e exclusão de movimentações financeiras.
- Registro de receitas e despesas.
- Organização e consulta do histórico financeiro.
- Visualização do saldo com base nas movimentações registradas.
- Validação dos dados enviados à API.
- Integração entre a interface web e o backend.
- Persistência das informações em banco de dados relacional.

## 🖥️ Frontend

Responsável pela interface com o usuário, pela apresentação das informações financeiras e pela comunicação com a API do backend.

**Tecnologias:**

- **React** — construção da interface baseada em componentes.
- **JavaScript** — lógica e interatividade.
- **HTML5** — estrutura dos elementos da aplicação.
- **CSS3** — estilização e responsividade.

## ⚙️ Backend

Responsável pelas regras de negócio, pelo processamento das requisições HTTP, pela validação dos dados e pela comunicação com o banco de dados.

**Tecnologias:**

- **Java 17** — linguagem principal da aplicação.
- **Spring Boot** — criação e configuração da API REST.
- **Spring Web** — criação de endpoints e tratamento de requisições HTTP.
- **Spring Data JPA** — persistência e acesso aos dados.
- **Hibernate** — mapeamento objeto-relacional.
- **Bean Validation** — validação dos dados recebidos.
- **Maven** — gerenciamento de dependências e build.

## 🗄️ Banco de dados

O projeto utiliza **MySQL** como banco de dados relacional, com integração ao backend por meio do Spring Data JPA e do Hibernate.

O banco é responsável por armazenar os registros financeiros da aplicação, permitindo sua consulta e manutenção.

## 🏗️ Estrutura do projeto

A organização proposta para o backend segue uma separação por responsabilidades:

```text
controle-suas-financas/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── org/example/
│   │   │   │       ├── controller/
│   │   │   │       ├── service/
│   │   │   │       ├── repository/
│   │   │   │       ├── entity/
│   │   │   │       ├── dto/
│   │   │   │       └── Main.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
│
└── README.md
```

> A estrutura acima é uma referência de organização para o projeto completo. Os diretórios podem ser ajustados conforme a implementação evoluir.

### Responsabilidades das camadas do backend

- **Controller:** recebe as requisições HTTP e retorna as respostas da API.
- **Service:** concentra as regras de negócio e o processamento das operações.
- **Repository:** realiza o acesso e a persistência dos dados.
- **Entity:** representa as entidades mapeadas para o banco de dados.
- **DTO:** define os dados utilizados na comunicação entre a API e seus consumidores.
- **Test:** contém os testes automatizados da aplicação.

No frontend, os componentes são responsáveis pelos elementos reutilizáveis da interface, as páginas organizam as telas e os serviços centralizam a comunicação com a API.

## ▶️ Como executar

### Pré-requisitos

- Java 17 ou superior.
- Maven.
- MySQL.
- Node.js e npm para executar o frontend, quando implementado.

### 1. Configurar o banco de dados

Crie o banco de dados no MySQL:

```sql
CREATE DATABASE controle_suas_financas;
```

### 2. Configurar o backend

Configure as credenciais do MySQL no arquivo `src/main/resources/application.properties`:

```properties
spring.application.name=controle-suas-financas

spring.datasource.url=jdbc:mysql://localhost:3306/controle_suas_financas
spring.datasource.username=root
spring.datasource.password=SUA_SENHA

spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.open-in-view=false
```

Substitua `SUA_SENHA` pela senha configurada no seu MySQL.

### 3. Executar a aplicação

Na pasta do backend, execute:

```bash
mvn spring-boot:run
```

Por padrão, a aplicação Spring Boot utiliza a porta `8080`, salvo configuração diferente.

### 4. Executar o frontend

Após a implementação do frontend, entre no diretório correspondente e execute:

```bash
npm install
npm run dev
```

Esses comandos pressupõem um projeto React configurado com um script `dev`, como ocorre em projetos criados com Vite.

## 🧪 Testes

O projeto prevê a utilização de testes automatizados para verificar o comportamento das funcionalidades e aumentar a confiabilidade da aplicação.

Tecnologias previstas:

- **JUnit** — execução de testes automatizados em Java.
- **Mockito** — criação de mocks para testes isolados.

## 📈 Objetivos de desenvolvimento

- Aprofundar os conhecimentos em Java e Spring Boot.
- Aplicar os conceitos de Programação Orientada a Objetos.
- Desenvolver APIs REST organizadas e consistentes.
- Trabalhar com persistência de dados utilizando JPA e MySQL.
- Implementar testes automatizados.
- Integrar frontend e backend.
- Aplicar boas práticas de arquitetura e organização de código.

## 👨‍💻 Autor

**Gustavo Tavares**

Desenvolvedor com foco em backend Java e Spring Boot, com conhecimentos em desenvolvimento frontend utilizando React.

[GitHub — GustavoTavares256](https://github.com/GustavoTavares256)
>>>>>>> origin/main
