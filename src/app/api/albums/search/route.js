import axios from 'axios';
import * as cheerio from 'cheerio';
import { v4 as uuidv4 } from 'uuid';

export async function GET(req) {
    try {
        const { searchParams } = new URL(req.url, 'http://localhost:3000'); // Update for Next.js 15
        const q = searchParams.get("q");

        if (!q) {
            return Response.json({ error: 'Query parameter "q" is required' }, { status: 400 });
        }

        const albums = [];
        const pageNumbers = [1, 2, 3];

        const requests = pageNumbers.map(async (i) => {
            const URL = `https://www7.hiphopkit.com/search?q=${q}&folder=album&p=${i}`;
            const { data } = await axios.get(URL);
            const $ = cheerio.load(data);

            $('.result').each((_, element) => {
                const image = $(element).find('.result-img img').attr("src") || 
                    "https://png.pngtree.com/png-vector/20221217/ourmid/pngtree-vinyl-disc-png-image_6527519.png";
                const link = $(element).find('.result-info h3 a').attr("href");
                const title = $(element).find('.result-info h3 a').text().trim();

                if (link && title) {
                    albums.push({ id: uuidv4(), link, title, image });
                }
            });
        });

        await Promise.all(requests);

        return Response.json({
            total: albums.length,
            data: albums
        }, { status: 200 });

    } catch (error) {
        console.error('Error scraping albums:', error);
        return Response.json({ error: 'Failed to scrape albums' }, { status: 500 });
    }
}
