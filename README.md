# 🔍 Scraper de Produtos da Amazon (Bun + Vite)

Este projeto é uma aplicação fullstack com backend em **Bun** e frontend em **Vite**. A aplicação realiza scraping de produtos da **Amazon.com** com base em uma palavra-chave digitada pelo usuário.

---

## 📦 Tecnologias utilizadas

- [Bun](https://bun.sh) — Backend (servidor e scraping)
- [Vite](https://vitejs.dev/) — Frontend com HTML/CSS/JS
- [Express (via Bun compatível)](https://expressjs.com/) — API
- [Axios](https://axios-http.com/) — Requisições HTTP
- [jsdom](https://github.com/jsdom/jsdom) — Manipulação de DOM no backend

---

## 📁 Estrutura do Projeto

raiz-do-projeto/
│
├── backend/ # API em Bun
│ └── index.ts # Rota /api/scrape
│
├── frontend/ # Projeto Vite
│ ├── index.html
│ ├── main.js # Código de interação com a API
│ └── style.css # Estilos
│
└── README.md

## 🚀 Como rodar o projeto

### Backend (Bun)

1. Instale o Bun:
   ```bash
   curl -fsSL https://bun.sh/install | bash

Acesse a pasta backend e instale as dependências:
bun install
Inicie o servidor: bun index.ts
O backend estará disponível em:  http://localhost:3000/api/scrape?keyword=notebook - Isso faz um GET na API e retorna a lista de produtos que está sendo enviada para o front
O keyword pode ser substituido por qualquer produto que queria achar

### FrontEnd (Vite) 
1. Acesse a pasta do FrontEnd e inicie com o bash 
2. Instale as dependêcnias usando:
    ```bash
   npm install 
3. Inicie o projeto usando:
    ```bash
   npm run dev
A interface estará disponível em: 
http://localhost:5173

Como usar
Digite uma palavra-chave no campo e clique em "Buscar". O frontend faz uma requisição para http://localhost:3000/api/scrape?keyword=..., e os produtos são exibidos com:

🛍️ Título

⭐ Avaliação

🗣️ Número de avaliações

🖼️ Imagem com link da imagem e produto disponibilizado

⚠️ Aviso
Este projeto é apenas para fins educacionais. O scraping da Amazon pode violar os termos de uso da plataforma. Use com responsabilidade.
