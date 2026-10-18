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
