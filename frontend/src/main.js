// Seleciona os elementos da interface
const searchBtn = document.getElementById('searchBtn');         // Botão de busca
const keywordInput = document.getElementById('keyword');        // Campo de texto onde o usuário digita a palavra-chave
const resultsDiv = document.getElementById('results');          // Div onde os resultados serão exibidos
const loader = document.getElementById('loader');               // Loader de carregamento (ex: spinner)

// Variáveis de controle
let allProducts = [];  // Armazena todos os produtos retornados da API
let currentIndex = 0;  // Índice atual dos produtos exibidos (para paginação)


// Adiciona evento de clique no botão de busca
searchBtn.addEventListener('click', async () => {
  const keyword = keywordInput.value.trim(); // Obtém o valor do input e remove espaços extras
  if (!keyword) return alert('Digite uma palavra-chave.'); // Alerta se estiver vazio

  // Mostra o loader e limpa os resultados anteriores
  loader.style.display = 'flex';
  resultsDiv.innerHTML = '';
  currentIndex = 0;
  allProducts = [];

  try {
    // Faz uma requisição para a API backend passando a keyword
    const res = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`);
    allProducts = await res.json();

    // Filtra produtos válidos (evita erros com dados incompletos ou inválidos)
    allProducts = allProducts.filter(p =>
      p.title && p.stars && p.reviews && p.image &&
      typeof p.title === 'string' &&
      typeof p.stars === 'string' &&
      typeof p.reviews === 'string' &&
      typeof p.image === 'string' &&
      p.image.includes('http') // garante que é uma URL de imagem válida
    );

    loader.style.display = 'none'; // Esconde o loader após carregar

    // Se nenhum produto for encontrado, exibe uma mensagem
    if (!allProducts.length) {
      resultsDiv.innerHTML = 'Nenhum produto encontrado.';
      return;
    }

    // Exibe os primeiros produtos e o botão "Carregar mais"
    showNextProducts();
    addLoadMoreButton();

  } catch (err) {
    loader.style.display = 'none'; // Esconde loader mesmo em caso de erro
    resultsDiv.innerHTML = 'Erro ao buscar produtos.';
    console.error(err); // Loga o erro no console
  }
});


// Função para exibir os próximos produtos (em blocos de 10 por padrão)
function showNextProducts(count = 10) {
  const nextItems = allProducts.slice(currentIndex, currentIndex + count); // Pega os próximos 10 produtos

  nextItems.forEach(product => {
    // Cria uma div para cada produto e insere as informações no HTML
    const div = document.createElement('div');
    div.innerHTML = `
      <img src="${product.image || ''}" width="100" />
      <h3>${product.title || 'Sem título'}</h3>
      <p>Estrelas: ${product.stars || 'N/A'} | Avaliações: ${product.reviews || 'N/A'}</p>
      <hr />
    `;
    resultsDiv.appendChild(div); // Adiciona a div no container de resultados
  });

  currentIndex += count; // Atualiza o índice para a próxima chamada

  // Se todos os produtos já foram exibidos, remove o botão "Carregar mais"
  if (currentIndex >= allProducts.length) {
    const btn = document.querySelector('#loadMoreContainer button');
    if (btn) btn.remove();
  }
}


// Função para adicionar o botão "Carregar mais"
function addLoadMoreButton() {
  const container = document.getElementById('loadMoreContainer');
  container.innerHTML = ''; // Remove botão anterior se existir

  const btn = document.createElement('button');
  btn.textContent = 'Carregar mais';

  // Ao clicar, carrega os próximos produtos
  btn.addEventListener('click', () => {
    showNextProducts();
    if (currentIndex >= allProducts.length) {
      btn.remove(); // Remove o botão se todos os produtos já foram exibidos
    }
  });

  container.appendChild(btn); // Adiciona o botão na tela
}
