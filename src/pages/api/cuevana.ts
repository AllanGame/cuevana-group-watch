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
        const tomatometelaAnonymizer = cheerio.load(
          tomatometelaAnonymizerResponse.data
        );

        const cuevanaAnonymizerResponse = await axios({
          method: "get",
          url:
            "https://apialfa.tomatomatela.com/ir/" +
            tomatometelaAnonymizer("a.link").attr("href"),
        });
        const cuevanaAnonymizer = cheerio.load(cuevanaAnonymizerResponse.data);

        const firstRedirectionFormData = new FormData();
        firstRedirectionFormData.append(
          "url",
          cuevanaAnonymizer("#url").attr("value")
        );

        const firstRedirectionResponse = await axios.post(
          "https://api.cuevana3.io/ir/rd.php",
          firstRedirectionFormData,
          {
            headers: firstRedirectionFormData.getHeaders(),
          }
        );

        const firstRedirection = cheerio.load(firstRedirectionResponse.data);

        const secondRedirectionFormData = new FormData();
        secondRedirectionFormData.append(
          "url",
          firstRedirection("#url").attr("value")
        );
        const secondRedirectionResponse = await axios.post(
          "https://api.cuevana3.io/ir/redirect_ddh.php",
          secondRedirectionFormData,
          {
            headers: secondRedirectionFormData.getHeaders(),
          }
        );

        const videoUrlResponse = await axios({
          url:
            "https://tomatomatela.com/details.php?v=" +
            secondRedirectionResponse.request.res.responseUrl.split("#")[1],
          method: "get",
        });

        return res.status(200).json({ src: videoUrlResponse.data.file });
      } catch (error) {
        return res.status(500).json({ error });
      }

    default:
      res.status(500).json({ error: "Unsupported operation." });
  }
}
