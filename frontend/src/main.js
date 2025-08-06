const searchBtn = document.getElementById('searchBtn');
const keywordInput = document.getElementById('keyword');
const resultsDiv = document.getElementById('results');

let allProducts = [];
let currentIndex = 0;

searchBtn.addEventListener('click', async () => {
  const keyword = keywordInput.value.trim();
  if (!keyword) return alert('Digite uma palavra-chave.');

  resultsDiv.innerHTML = 'Carregando...';
  currentIndex = 0;
  allProducts = [];

  try {
    const res = await fetch(`http://localhost:3000/api/scrape?keyword=${encodeURIComponent(keyword)}`);
    allProducts = await res.json();

    resultsDiv.innerHTML = '';

    if (!allProducts.length) {
      resultsDiv.innerHTML = 'Nenhum produto encontrado.';
      return;
    }

    showNextProducts();
    addLoadMoreButton();
  } catch (err) {
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
}

function addLoadMoreButton() {
  const btn = document.createElement('button');
  btn.textContent = 'Carregar mais';
  btn.style.marginTop = '1rem';
  btn.style.padding = '0.5rem 1rem';

  btn.addEventListener('click', () => {
    showNextProducts();
    if (currentIndex >= allProducts.length) {
      btn.remove();
    }
  });

  resultsDiv.appendChild(btn);
}
