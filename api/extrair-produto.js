import axios from 'axios';
import * as cheerio from 'cheerio';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido' });
  }

  const { url } = req.body;

  if (!url) return res.status(400).json({ error: 'URL não fornecida' });

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const nome = $('title').text().trim().substring(0, 100);
    const preco = $('meta[property="product:price:amount"]').attr('content') ||
                  $('[class*=preco], [class*=price], [id*=preco]').first().text().trim();
    const imagem = $('meta[property="og:image"]').attr('content') ||
                   $('img').first().attr('src');

    return res.status(200).json({
      nome: nome || "Produto",
      preco: preco || "Preço não disponível",
      imagem: imagem || null
    });
  } catch (err) {
    return res.status(500).json({ error: "Erro ao extrair dados" });
  }
}
