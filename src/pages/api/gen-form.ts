import { fetchAuth } from "@/ultil/fetchAuth";
import type { NextApiRequest, NextApiResponse } from "next";

type FormData = {
  type: "form-getfly" | "form-sam" | "form-google" | "unknown";
  url: string;
  uuid?: string;
  divId: string;
  divClass?: string;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<FormData>
) {
  const type = req.query.type || "form-main"; // Default form type
  const api_url = process.env.API_URL;

  if (!api_url) {
    res.status(500).json({
      type: "unknown",
      url: "",
      divId: "",
      error: "API_URL is not defined"
    });
    return;
  }

  let url = "";
  let divId = "";

  try {
    const responseWordpress = await fetchAuth({
      url: `${api_url}/form`,
      revalidate: 1
    });
    const data: any[] = await responseWordpress.json();
    const htmlString = data?.length > 0 ? data[0]?.acf?.[String(type)] : "";

    if (!htmlString) {
      res.status(404).json({
        type: "unknown",
        url: "",
        divId: "",
        error: "No form data found"
      });
      return;
    }

    if (htmlString.includes("google.com/forms")) {
      // Form Type 3
      const iframeRegex = /<iframe[^>]+src="([^"]+)"[^>]*>/;
      const iframeMatch = htmlString.match(iframeRegex);
      url = iframeMatch?.[1] || "";
      divId = "google-form-container";

      res.status(200).json({ type: "form-google", url, divId });
    } else if (htmlString.includes("GetForm")) {
      // Form Type 2 logic (kept for reference)
      const getFormRegex = /GetForm\("([^"]+)", "([^"]+)"\)/;
      const divRegex = /<div id="([^"]+)" class="([^"]+)"/;
      const getFormMatch = htmlString.match(getFormRegex);
      const divMatch = htmlString.match(divRegex);

      url = getFormMatch?.[1] || "";
      const uuid = getFormMatch?.[2] || "";
      divId = divMatch?.[1] || "";
      const divClass = divMatch?.[2] || "";

      res.status(200).json({ type: "form-sam", url, uuid, divId, divClass });
    } else {
      // Form Type 1 logic (kept for reference)
      const idRegex = /id="([^"]+)"/;
      const hrefRegex = /https:\/\/[^"]+/;
      const idMatch = htmlString.match(idRegex);
      const hrefMatch = htmlString.match(hrefRegex);

      const uuid = idMatch?.[1] || "";
      url = hrefMatch?.[0] || "";
      divId = uuid;
      const divClass = "formio_form_iframe_container";

      res.status(200).json({ type: "form-getfly", url, uuid, divId, divClass });
    }
  } catch (error) {
    console.error("Error fetching or parsing data:", error);
    res.status(500).json({
      type: "unknown",
      url: "",
      divId: "",
      error: "Internal Server Error"
    });
  }
}
