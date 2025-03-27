// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { fetchAuth } from "@/ultil/fetchAuth";
import type { NextApiRequest, NextApiResponse } from "next";

type Data = {
  list: string[];
  content: any[];
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  //lấy dữ liệu form từ wordpress
  const api_url = process.env.API_URL || "";
  let filteredLines: string[] = [];
  let content: any[] = [];
  try {
    const responeWordpress = await fetchAuth({
      url: `${api_url}/lich-khai-giang/?id=21581`,
      revalidate: 10
    });
    if (!responeWordpress.ok) {
      throw new Error(
        `Posts fetch failed with status: ${responeWordpress.statusText}`
      );
    }
    const data: any[] = await responeWordpress.json();

    //lấy ra chuỗi formHTML
    const htmlString = data?.length > 0 ? data[0]?.content?.rendered : ``;

    // Loại bỏ các thẻ HTML từ chuỗi
    const textContent = htmlString.replace(/(&#8211;|<[^>]*>)/g, "");

    // Tách các chuỗi bằng dấu xuống dòng
    const lines = textContent.split("\n");
    content = data;
    // Loại bỏ các chuỗi trống và khoảng trắng
    filteredLines = lines?.filter((line: string) => line.trim() !== "");
    filteredLines = filteredLines?.map((line: string) => line?.trim());
  } catch (error) {
    console.log(error);
  }

  if (req.method === "GET") {
    res.status(200).json({
      list: filteredLines || [],
      content: content || []
    });
  }
}
