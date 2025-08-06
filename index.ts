import express from 'express'
import axios from 'axios'
import { JSDOM } from 'jsdom'
import cors from 'cors'

const app = express();
app.use(cors()); //permite todas as origens (inclusive 5173)
const PORT = 3000;
app.use(express.json());

app.get('/api/scrape', async (req, res) => {
    const keyword = req.query.keyword;

    if (!keyword){
        return res.status(404).json({ error: 'Parâmetro: "Keyword é obrigatório' });
    }

    const url = `https://www.amazon.com/s?k=${encodeURIComponent(keyword)}`;

    try {
        const { data: html } = await axios.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                'Accept-Language': 'en-US,en;q=0.9',
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
                'Referer': 'https://www.google.com/',
                'DNT': '1',
            },
        });

        const dom = new JSDOM(html);
        const document = dom.window.document;
        const products = [];

        document.querySelectorAll('div.s-result-item[data-asin]').forEach(item => {
            const title = item.querySelector('h2 a span')?.textContent?.trim()
                        || item.querySelector('h2 span')?.textContent?.trim()
                        || item.querySelector('h2')?.textContent?.trim();

            const stars = item.querySelector('.a-icon-alt')?.textContent?.trim();
            const reviews = item.querySelector('.a-size-base.s-underline-text')?.textContent?.trim();
            const image = item.querySelector('img.s-image')?.src;

            if (title && image && !reviews?.includes('Prime Video') && !title.includes('More results') && !title.includes('Need help?')) {
                products.push({ title, stars, reviews, image });
            }

            console.log({ title, stars, reviews, image });
        });

        const resultadosFiltrados = products.filter(prod => 
            typeof prod.title === 'string' &&
            prod.title.length > 0 &&
            typeof prod.stars === 'string' &&
            typeof prod.reviews === 'string' &&
            typeof prod.image === 'string' &&
            prod.image.includes('https')
        );

        res.json(resultadosFiltrados);

    } catch (error){
        console.error(error.message);
        res.status(500).json({ error: 'Erro ao buscar dados da Amazon.' });
    }
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`)
});
