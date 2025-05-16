import axios from 'axios';
import * as cheerio from 'cheerio';

async function extrairProduto(url) {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const nome = $('title').text().trim().substring(0, 100);
    const preco = $('meta[property="product:price:amount"]').attr('content') ||
                  $('[class*=preco], [class*=price], [id*=preco]').first().text().trim();
    const imagem = $('meta[property="og:image"]').attr('content') ||
                   $('img').first().attr('src');

    console.log({
      nome: nome || "Produto",
      preco: preco || "Preço não disponível",
      imagem: imagem || null
    });
  } catch (error) {
    console.error("Erro:", error.message);
  }
}

// Troque o link abaixo por qualquer link de produto:
const link = "https://www.exemplo.com/produto";
extrairProduto(link);
