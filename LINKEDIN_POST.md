# 📝 Post para LinkedIn - Projeto Finanças

---

## Texto do Post

🚀 **Finalizei meu projeto full stack: Finanças - Controle Financeiro Pessoal**

Depois de semanas de desenvolvimento, consegui entregar uma aplicação completa de controle de receitas, despesas e dashboard financeiro. O front-end (React + Vite) já existia, então o desafio foi construir um back-end robusto em **Spring Boot 3 + Java 17** que se integrasse perfeitamente.

---

### 🛠 **Stack Tecnológica**

**Back-end:**
☕ Java 17 | 🍃 Spring Boot 3.2.5 | 🗄️ Spring Data JPA | ✅ Bean Validation | 🐬 MySQL 8 | 📦 Maven

**Front-end:**
⚛️ React 18 | ⚡ Vite 6 | 📡 Axios | 📊 Recharts | 🎨 Lucide Icons

**Qualidade & Padrões:**
📋 ProblemDetail (RFC 7807) | 🔄 DTO Pattern | 📄 Paginação Spring Data | 🌐 CORS Configurado | 🔒 Validação Server-side

---

### 💡 **O que aprendi / Decisões Técnicas**

1. **Front-first design** → O back-end serve o front. Mapeei todos os contratos esperados (`/api/movimentacoes`, parâmetros `pagina/tamanho/ordenacao`, formato Spring Page) e adaptei a API.

2. **DTO ≠ Entity** → Desacoplar API do banco evita vazamento de estrutura e facilita evolução independente.

3. **BigDecimal para dinheiro** → Nunca use float/double. Precisão monetária é inegociável.

4. **ProblemDetail (RFC 7807)** → Padronizei erros: 400 com `{erros: {campo: "msg"}}`, 404 com `{detail: "..."}`, 500 genérico. Front trata tudo com uma função única.

5. **Validação declarativa** → `@NotBlank`, `@DecimalMin("0.01")`, `@PastOrPresent`, `@Pattern` no DTO. Server-side always.

6. **Alias de rotas** → Mantive `/api/transacoes` (original) e criei `/api/movimentacoes` (esperado pelo front) = zero breaking changes.

---

### ✨ **Funcionalidades**

✅ CRUD completo de Movimentações (Receitas/Despesas)  
✅ Filtros combinados: tipo, categoria, período, busca + paginação  
✅ Dashboard com totais, saldo, gráficos por categoria  
✅ CRUD de Categorias com cor hexadecimal  
✅ Validação robusta + mensagens de erro claras  
✅ Health check + CORS configurado

---

### 📸 **Resultado**

Dashboard responsivo, lista paginada com filtros em tempo real, modais de criação/edição, gráficos interativos. Tudo consumindo API REST real, sem mocks.

---

### 🎯 **Próximos passos**

→ Testes automatizados (JUnit + Mockito)  
→ Swagger/OpenAPI docs  
→ Flyway Migrations  
→ Docker Compose  
→ CI/CD GitHub Actions

---

### 💭 **Reflexão**

Construir o back-end para um front já existente me ensinou que **API design é product design**. Cada endpoint, parâmetro e formato de resposta impacta diretamente a experiência do desenvolvedor front-end e, consequentemente, do usuário final.

O código está no GitHub: [link-do-repo]

#Java #SpringBoot #React #FullStack #Desenvolvimento #Portfolio #AprendizadoContinuo

---

## 📎 Hashtags Sugeridas

#Java #SpringBoot #React #FullStackDeveloper #DesenvolvimentoWeb #Portfolio #AprendizadoContinuo #TechBrasil #Programacao #Backend #Frontend #MySQL #APIDesign #CleanCode #ProblemDetail #RFC7807

---

## 🖼️ Imagens para anexar (sugestão)

1. **Print do Dashboard** (cards + gráficos)
2. **Print da Lista de Movimentações** (tabela + filtros)
3. **Print do Postman/Insomnia** (collection de endpoints)
4. **Print do Código** (arquitetura em camadas ou GlobalExceptionHandler)

---

## 💬 Call to Action (final do post)

> "Qual decisão técnica você tomaria diferente? Deixa nos comentários! 👇
> 
> Se você também está construindo seu portfólio full stack, bora trocar ideia!"