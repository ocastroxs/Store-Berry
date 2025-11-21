# 🍓 Store Berry

**Store Berry** é uma plataforma de e-commerce moderna e responsiva, especializada em produtos à base de morango. O projeto combina um design intuitivo com funcionalidades robustas de sistema de vendas, oferecendo uma experiência fluida para clientes.

> 🍇 **Slogan:** *"Sabor e tecnologia no ponto certo!"*

---

## 📋 Índice

- [Visão Geral](#visão-geral)
- [Tecnologias](#tecnologias)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Pré-requisitos](#pré-requisitos)
- [Instalação](#instalação)
- [Como Executar](#como-executar)
- [Funcionalidades](#funcionalidades)
- [Fluxo de Usuário](#fluxo-de-usuário)
- [Endpoints da API](#endpoints-da-api)
- [Autenticação](#autenticação)
- [Segurança](#segurança)
- [Contribuição](#contribuição)
- [Licença](#licença)

---

## 🎯 Visão Geral

O **Store Berry** é um sistema completo de vendas online que permite aos usuários:

- 🛍️ Explorar catálogo de produtos (doces, bebidas, conservas)
- 🛒 Gerenciar carrinho de compras em tempo real
- 👤 Criar conta e fazer login seguro
- 📱 Acessar a plataforma em qualquer dispositivo (totalmente responsivo)
- 📊 Visualizar detalhes dos produtos com modais interativas

---

## 🛠️ Tecnologias

### Frontend
- **HTML5** — Estrutura semântica das páginas
- **CSS3** — Estilização responsiva e animações fluidas
- **JavaScript (ES6+)** — Lógica interativa, gerenciamento de sessão
- **Bootstrap 5** — Componentes de interface

### Backend
- **Node.js** — Runtime JavaScript no servidor
- **Express.js v5.1.0** — Framework web leve e eficiente
- **Express-Session** — Gerenciamento de sessões de usuário
- **Bcrypt** — Hash seguro de senhas

### Data Storage
- **Arquivos JSON** — Armazenamento local de dados (usuários e carrinho)

---

## 📁 Estrutura do Projeto

```
Store-Berry/
├── Back-End/
│   ├── index.js                    # Arquivo principal do servidor
│   ├── Middlewares/
│   │   ├── autenticacao.js         # Middleware de autenticação
│   │   └── logger.js               # Middleware de logs
│   ├── Routes/
│   │   ├── routerHome.js           # Rota da página inicial
│   │   ├── routerCardapio.js       # Rota do cardápio
│   │   ├── routerCarrinho.js       # Rota do carrinho
│   │   ├── routerConta.js          # Rota de autenticação
│   │   └── routerSobre.js          # Rota sobre nós
│   └── data/
│       ├── users.json              # Dados de usuários
│       ├── carrinho.json           # Dados do carrinho
│       └── cardapio.json           # Catálogo de produtos
├── Front-End/
│   ├── HTML/
│   │   ├── cardapio.html           # Página do cardápio
│   │   ├── carrinho.html           # Página do carrinho
│   │   ├── entrar-conta.html       # Página de login
│   │   ├── criar-conta.html        # Página de cadastro
│   │   └── sobre.html              # Página sobre nós
│   ├── CSS/
│   │   ├── index.css               # Estilos da home
│   │   ├── cardapio.css            # Estilos do cardápio
│   │   ├── carrinho.css            # Estilos do carrinho
│   │   ├── conta.css               # Estilos de autenticação
│   │   ├── sobre.css               # Estilos da página sobre
│   │   └── toast.css               # Estilos de notificações
│   ├── JS/
│   │   ├── cardapio.js             # Lógica do cardápio
│   │   ├── carrinho.js             # Lógica do carrinho
│   │   ├── conta.js                # Lógica de autenticação
│   │   └── auth-check.js           # Verificação de sessão
│   ├── Images/                     # Imagens e ícones
│   └── Fonts/                      # Fontes customizadas
├── index.html                      # Página home
├── package.json                    # Dependências do projeto
└── .gitignore                      # Arquivos ignorados pelo Git
```

---

## 📦 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (v18 ou superior) - [Download](https://nodejs.org/)
- **npm** (gerenciador de pacotes) - Vem com Node.js
- Um navegador moderno (Chrome, Firefox, Safari, Edge)

---

## 🚀 Instalação

### 1. Clone o repositório

```bash
git clone https://github.com/seu-usuario/store-berry.git
cd store-berry
```

### 2. Instale as dependências

```bash
npm install
```

Isso instalará todos os pacotes necessários listados em `package.json`:
- express
- express-session
- bcrypt
- nodemon

### 3. Verificar estrutura de pastas

Certifique-se de que as pastas existem:

```bash
mkdir -p Back-End/data
```

---

## ▶️ Como Executar

### Modo Desenvolvimento (com Nodemon)

```bash
npm run dev
```

Nodemon monitora mudanças nos arquivos e reinicia o servidor automaticamente.

### Modo Produção

```bash
node Back-End/index.js
```

O servidor iniciará em: **http://localhost:3000**

### 🌐 Acessar a Aplicação

Abra seu navegador e navegue para:

```
http://localhost:3000
```

---

## ✨ Funcionalidades

### 🏠 Página Inicial
- Banner hero com chamada para ação
- Seção de benefícios (Frescor, Entrega, Qualidade)
- Exploração de categorias de produtos
- Mapa de localização integrado
- Informações de contato

### 📖 Cardápio
- Visualização de todos os produtos em grid responsivo
- Categorias: Doces & Sobremesas, Bebidas, Conservas
- Filtros por categoria
- Modal detalhado para cada produto
- Botão "Adicionar ao Carrinho" com validação de login

### 🛒 Carrinho
- Listagem de itens adicionados
- Controle de quantidade (+/-)
- Remoção de itens
- Cálculo automático de subtotal e total
- Resumo do pedido em tempo real
- Botão para finalizar compra
- Carrinho sincronizado entre página e localStorage

### 👤 Autenticação
- **Criar Conta:** Registro com CPF, Email e Senha
- **Entrar:** Login com CPF/Email e Senha
- **Validações:** CPF válido, email único, senha hasheada com bcrypt
- **Sessão:** Mantém usuário logado por 24 horas
- **Logout:** Limpa sessão e carrinho

### 📱 Responsividade
- Layout adaptável para mobile, tablet e desktop
- Menu responsivo
- Grid de produtos ajustável
- Textos e imagens otimizadas para todos os tamanhos

### 🔔 Notificações (Toast)
- Sucesso, erro, aviso e informação
- Animações suaves de entrada/saída
- Auto-desaparição após 3 segundos
- Empilhamento automático de múltiplas notificações

---

## 🔄 Fluxo de Usuário

```
1. Usuário acessa http://localhost:3000 (Home)
   ↓
2. Navega para /cardapio (Explorar produtos)
   ↓
3. Clica "Adicionar ao Carrinho" → Redireciona para login se não autenticado
   ↓
4. Faz login ou cria conta em /conta/entrar ou /conta/criar
   ↓
5. Retorna ao cardápio e adiciona itens
   ↓
6. Acessa /carrinho para revisar compra
   ↓
7. Clica "Finalizar Pedido" (limpa carrinho)
   ↓
8. Pode fazer logout pelo menu
```

---

## 🔌 Endpoints da API

### Autenticação

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/conta/api/registrar` | Criar nova conta |
| POST | `/conta/api/login` | Fazer login |
| GET | `/conta/api/verificar` | Verificar se está logado |
| POST | `/conta/api/logout` | Fazer logout |

### Carrinho

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/carrinho/api` | Obter itens do carrinho |
| POST | `/carrinho/api` | Adicionar item ao carrinho |
| DELETE | `/carrinho/api/:nome` | Remover item do carrinho |

### Páginas

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/` | Página inicial |
| GET | `/cardapio` | Página de cardápio |
| GET | `/carrinho` | Página do carrinho |
| GET | `/conta/entrar` | Página de login |
| GET | `/conta/criar` | Página de cadastro |
| GET | `/sobre` | Página sobre nós |

---

## 🔐 Autenticação

### Fluxo de Login

1. Usuário envia CPF/Email e senha para `/conta/api/login`
2. Sistema busca usuário no `users.json`
3. Valida senha com bcrypt.compare()
4. Se válido, cria sessão com ID e nome do usuário
5. Sessão dura 24 horas
6. Cookie httpOnly contém ID da sessão (seguro)

### Fluxo de Registro

1. Usuário envia CPF, Email e Senha para `/conta/api/registrar`
2. Sistema valida campos e verifica duplicatas
3. Hash da senha com bcrypt (salt rounds = 10)
4. Novo usuário salvo em `users.json`
5. Usuário pode fazer login imediatamente

### Proteção

- ✅ Senhas hasheadas com bcrypt
- ✅ Cookies httpOnly (não acessível via JavaScript)
- ✅ Session ID gerado automaticamente
- ✅ Token simples de API (pode ser melhorado com JWT)

---

## 🛡️ Segurança

### Implementado

- **Bcrypt:** Hash de senhas com salt rounds = 10
- **Sessions:** Gerenciamento com express-session
- **HttpOnly Cookies:** Proteção contra XSS
- **Validação:** CPF, email e campos obrigatórios
- **CORS:** Está aberto (considere restringir em produção)

### Melhorias Futuras

- Implementar JWT tokens
- Adicionar rate limiting
- Proteger rotas sensíveis
- Validação de entrada mais robusta
- HTTPS em produção
- Migrar de JSON para banco de dados real (MySQL, MongoDB)

---

## 📝 Variáveis de Ambiente (Futuro)

Criar arquivo `.env` para produção:

```env
NODE_ENV=production
PORT=3000
SESSION_SECRET=your-secret-key
BCRYPT_ROUNDS=10
```

---

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

---

## 📋 Checklist de Desenvolvimento

- [x] Setup do servidor Express
- [x] Autenticação com bcrypt
- [x] Gerenciamento de carrinho
- [x] Páginas responsivas
- [x] Notificações toast
- [x] Filtros de categoria
- [x] Modal de detalhes de produtos
- [ ] Integração com banco de dados real
- [ ] Sistema de pagamento
- [ ] Email de confirmação
- [ ] Dashboard de administrador

---

## 📞 Contato

**Store Berry** — Encomende sua comida aqui!

- 📧 Email: storeberry@gmail.com
- 📱 WhatsApp: +55 (11) 94537-9675
- 🏢 Endereço: R. Santo André, 680 - Boa Vista, São Caetano do Sul - SP

---

## 📄 Licença

Este projeto está sob a licença **ISC**. Veja `package.json` para mais detalhes.

---

## 🎉 Agradecimentos

Desenvolvido com ❤️ para os amantes de morangos frescos e sabor autêntico.

**© 2025 Store Berry. Todos os direitos reservados. CNPJ: 41.895.006/0001-51**
