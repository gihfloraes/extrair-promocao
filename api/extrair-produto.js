import axios from 'axios';
import cheerio from 'cheerio';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método não permitido. Use POST.' });
  }

  const { url } = req.body;

  if (!url) {
    return res.status(400).json({ error: 'URL não fornecida.' });
  }

  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const titulo = $('h1').first().text().trim();

    res.status(200).json({ titulo });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao extrair dados.' });
  }
}
