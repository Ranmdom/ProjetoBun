// Importa os módulos necessários
import express from 'express' // Framework para criar o servidor HTTP
import axios from 'axios'     // Cliente HTTP para fazer requisições a outros sites
import { JSDOM } from 'jsdom' // Permite manipular HTML como se fosse o DOM de um navegador
import cors from 'cors'       // Middleware para habilitar o CORS (Cross-Origin Resource Sharing)

// Inicializa a aplicação Express
const app = express();
app.use(cors()); // Permite requisições de qualquer origem (importante para aplicações frontend como React)
const PORT = 3000;
app.use(express.json()); // Habilita o uso de JSON no corpo das requisições

// Define a rota GET para fazer o scraping da Amazon
app.get('/api/scrape', async (req, res) => {
    const keyword = req.query.keyword; // Obtém o termo de busca da query string

    // Se não for fornecida a keyword, retorna erro
    if (!keyword){
        return res.status(404).json({ error: 'Parâmetro: "Keyword" é obrigatório' });
    }

    // Monta a URL de pesquisa da Amazon com o termo fornecido
    const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;

    try {
        // Faz uma requisição GET para a página da Amazon com headers simulando um navegador real
        const { data: html } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Referer': 'https://www.google.com/',
                'DNT': '1',
            },
        });

        // Cria uma instância do DOM com o HTML retornado
        const dom = new JSDOM(html);
        const document = dom.window.document;

        // Array onde os produtos serão armazenados
        const products = [];

        // Itera sobre todos os elementos que representam produtos na Amazon
        document.querySelectorAll('div.s-result-item[data-asin]').forEach(item => {
            // Tenta extrair o título do produto de várias formas (ajuste para diferentes estruturas HTML)
            const title = item.querySelector('h2 a span')?.textContent?.trim()
                        || item.querySelector('h2 span')?.textContent?.trim()
                        || item.querySelector('h2')?.textContent?.trim();

            // Pega a avaliação em estrelas
            const stars = item.querySelector('.a-icon-alt')?.textContent?.trim();

            // Pega o número de avaliações
            const reviews = item.querySelector('.a-size-base.s-underline-text')?.textContent?.trim();

            // Pega o link da imagem
            const image = item.querySelector('img.s-image')?.src;

            // Filtra itens que possuem título e imagem válidos e ignora resultados irrelevantes
            if (title && image && !reviews?.includes('Prime Video') && !title.includes('More results') && !title.includes('Need help?')) {
                products.push({ title, stars, reviews, image });
            }

            // Loga o item extraído para depuração
            console.log({ title, stars, reviews, image });
        });

        // Filtra os produtos para garantir que todos os campos essenciais estejam presentes
        const resultadosFiltrados = products.filter(prod => 
            typeof prod.title === 'string' &&
            prod.title.length > 0 &&
            typeof prod.stars === 'string' &&
            typeof prod.reviews === 'string' &&
            typeof prod.image === 'string' &&
            prod.image.includes('https') // garante que é um link válido
        );

        // Retorna os produtos como JSON
        res.json(resultadosFiltrados);

    } catch (error){
        // Em caso de erro, loga no console e responde com erro 500
        console.error(error.message);
        res.status(500).json({ error: 'Erro ao buscar dados da Amazon.' });
    }
});

// Inicia o servidor na porta definida
app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
});
