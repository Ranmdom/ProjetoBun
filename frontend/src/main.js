const searchBtn = document.getElementById('searchBtn');
const keywordInput = document.getElementById('keyword');
const resultsDiv = document.getElementById('results');
const loader = document.getElementById('loader');

let allProducts = [];
let currentIndex = 0;

searchBtn.addEventListener('click', async () => {
  const keyword = keywordInput.value.trim();
  if (!keyword) return alert('Digite uma palavra-chave.');

  // Mostra loader e limpa resultados
  loader.style.display = 'flex';
  resultsDiv.innerHTML = '';
  currentIndex = 0;
  allProducts = [];

  try {
    const res = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`);
    allProducts = await res.json();
    allProducts = allProducts.filter(p =>
      p.title && p.stars && p.reviews && p.image &&
      typeof p.title === 'string' &&
      typeof p.stars === 'string' &&
      typeof p.reviews === 'string' &&
      typeof p.image === 'string' &&
      p.image.includes('http')
    );

    loader.style.display = 'none'; // Esconde loader

    if (!allProducts.length) {
      resultsDiv.innerHTML = 'Nenhum produto encontrado.';
      return;
    }

    showNextProducts();
    addLoadMoreButton();
  } catch (err) {
    loader.style.display = 'none'; // Esconde loader
    resultsDiv.innerHTML = 'Erro ao buscar produtos.';
    console.error(err);
  }
});

function showNextProducts(count = 10) {
  const nextItems = allProducts.slice(currentIndex, currentIndex + count);
  nextItems.forEach(product => {
    const div = document.createElement('div');
    div.innerHTML = `
      <img src="${product.image || ''}" width="100" />
      <h3>${product.title || 'Sem título'}</h3>
      <p>Estrelas: ${product.stars || 'N/A'} | Avaliações: ${product.reviews || 'N/A'}</p>
      <hr />
    `;
    resultsDiv.appendChild(div);
  });

  currentIndex += count;

  // Verifica se já mostrou todos os produtos
  if (currentIndex >= allProducts.length) {
    const btn = document.querySelector('#loadMoreContainer button');
    if (btn) btn.remove();
  }
}


function addLoadMoreButton() {
  const container = document.getElementById('loadMoreContainer');
  container.innerHTML = ''; // Limpa botão anterior, se existir

  const btn = document.createElement('button');
  btn.textContent = 'Carregar mais';

  btn.addEventListener('click', () => {
    showNextProducts();
    if (currentIndex >= allProducts.length) {
      btn.remove();
    }
  });

  container.appendChild(btn);
}

