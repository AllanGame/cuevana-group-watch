import type { NextApiRequest, NextApiResponse } from "next";
import cheerio from "cheerio";
import axios from "axios";
import FormData from "form-data";

type Data = {};

/**
 * Gets data from a cuevana URL
 */
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    // TODO: this code is shit
    case "GET":
      const videoUrl = req.query.url;

      if (!videoUrl) {
        res.status(400).json({ error: "invalid url" });
        return;
      }

      try {
        const cuevanaClientResponse = await axios({
          method: "get",
          url: videoUrl,
        } as any);
        const cuevanaClient = cheerio.load(cuevanaClientResponse.data);

        const tomatometelaAnonymizerResponse = await axios({
          method: "get",
          url:
            "https:" + cuevanaClient("div#OptL1 > iframe.no-you").attr("data-src"),
        });


        return res.status(200).json({
          url: `https:${cuevanaClient("div#OptL1 > iframe.no-you").attr("data-src")}`,
          test: `https:${cuevanaClient("div#OptL1 > iframe.no-you").attr("src")}`,
          res: tomatometelaAnonymizerResponse.data
        })
      } catch (error) {
        return res.status(500).json({ error });
      }

    default:
      res.status(500).json({ error: "Unsupported operation." });
  }
}
