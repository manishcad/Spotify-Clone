import axios from 'axios';
import * as cheerio from 'cheerio';
import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';

export async function GET(req) {
    try {
        // Correctly parse search parameters from the request URL
        const { searchParams } = new URL(req.nextUrl);
        let page = parseInt(searchParams.get('page')) || 1;
        let limit = parseInt(searchParams.get('limit')) || 10;

        const albums = [];
        const albumsURL = `https://www7.hiphopkit.com/music/album/page/${page}/`; // Renamed from 'URL' to 'albumsURL'
        
        const userAgents = [
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36',
            'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36',
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/108.0.0.0 Safari/537.36'
        ];
        const userAgent = userAgents[Math.floor(Math.random() * userAgents.length)];

        const { data } = await axios.get(albumsURL, {
            headers: {
                'User-Agent': userAgent,
                'Referer': 'https://www.google.com/',
                'Accept-Language': 'en-US,en;q=0.9'
            }
        });

        const $ = cheerio.load(data);

        $('.myfile').each((index, element) => {
            if (albums.length >= limit) return; // Stop when limit is reached

            const uuid = uuidv4();
            const image = $(element).find('.image img').attr("data-src") || 
                "https://png.pngtree.com/png-vector/20221217/ourmid/pngtree-vinyl-disc-png-image_6527519.png";
            const link = $(element).find('.infohome h3 a').attr('href');
            const title = $(element).find('.infohome h3 a').text().trim();

            if (link && image) {
                albums.push({ link, title, image, id: uuid });
            }
        });

        return NextResponse.json({
            page,
            limit,
            total: albums.length,
            data: albums
        });

    } catch (error) {
        console.error('Error scraping albums:', error);
        return NextResponse.json({ error: 'Failed to scrape albums' }, { status: 500 });
    }
}
