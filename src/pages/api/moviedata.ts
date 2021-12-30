import type { NextApiRequest, NextApiResponse } from "next";
import cheerio from "cheerio";
import axios from "axios";

type Data = {};


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Data>
) {
    const videoUrl = req.query.url as string;

    if (!videoUrl) {
        res.status(400).json({ error: "invalid url" });
        return;
    }

    switch(req.method) {
        case "GET":
            let originRequestResponse = await axios({
                method: 'GET',
                url: videoUrl
            });

            let cuevanaOrigin = cheerio.load(originRequestResponse.data);
            let title = cuevanaOrigin("h1.Title").text();
            let poster = cuevanaOrigin("img.lazy").attr('data-src')
            return res.status(200).json({title, poster})
        default:
           return res.status(500).json("Unsupported operation")
    }
}