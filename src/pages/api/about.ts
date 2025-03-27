// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { clean } from "@/lib/sanitizeHtml";
import { fetchAuth } from "@/ultil/fetchAuth";
import type { NextApiRequest, NextApiResponse } from "next";
type Data = {
  content: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  //lấy dữ liệu form từ wordpress
  const api_url = process.env.API_URL || "";
  let content = "";
  try {
    const responeWordpress = await fetchAuth({
      url: `${api_url}/posts/?slug=gioi-thieu`,
      revalidate: 10
    });
    if (!responeWordpress.ok) {
      throw new Error(
        `Posts fetch failed with status: ${responeWordpress.statusText}`
      );
    }
    const posts: any[] = await responeWordpress.json();
    const post = posts?.length > 0 ? posts[0] : null;
    if (post?.content?.rendered) content = clean(post?.content?.rendered);
  } catch (error) {
    console.log(error);
  }

  if (req.method === "GET") {
    res.status(200).json({
      content
    });
  }
}
