import axios from "axios";
import * as cheerio from "cheerio";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url, process.env.NEXT_PUBLIC_BASE_URL);
    const link = searchParams.get("link");

    if (!link) {
      return Response.json({ message: "URL must be provided" }, { status: 400 });
    }

    const { data } = await axios.get(link);
    const $ = cheerio.load(data);

    // Extract album title and image
    const title = $(".mu-o h3").first().text().trim() || "Unknown Title";
    const image = $(".song-thumbnail img").attr("src") || null;

    let songs = [];

    $(".mu-o").each((index, element) => {
       
      $(element)
        .find(".mu-o-title a")
        .each((i, el) => {
          const songName = $(el).text().trim();
          const link = $(el).attr("href") || null; // Song details link

          // Extract corresponding music download link
          const musicLink = $(element)
            .find(".mu-o-act a")
            .eq(i)
            .attr("href") || null;

          if (songName) {
            songs.push({ songName, link, musicLink });
          }
        });
    });

    const albumData = { title, image, songs };

    if (songs.length === 0) {
      return Response.json({ message: "No songs found." }, { status: 404 });
    }

    return Response.json({ msg: "ok", data: albumData });
  } catch (err) {
    console.error("Scraping error:", err);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
