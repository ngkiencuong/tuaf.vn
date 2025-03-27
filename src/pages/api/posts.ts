// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { fetchAuth } from "@/ultil/fetchAuth";
import type { NextApiRequest, NextApiResponse } from "next";
type Data = {
  posts: any[];
  totalPosts: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  //lấy dữ liệu form từ wordpress
  const type = req?.query?.type || "";
  const page = req?.query?.page || "";
  const api_url = process.env.API_URL || "";

  let posts: any[] = [];
  let totalPosts: string = "0";

  try {
    //get all categories
    // const resCats = await fetch(`${api_url}/categories`, {
    //   next: { revalidate: 1800 },
    // });
    // const cats: any[] = (await resCats.json()) || [];
    // const newCat = cats?.find((cat) => cat.name === "Tin Tức");
    // const idNew = 216;
    // const notifiCat = cats?.find((cat) => cat.name === "Thông báo");
    const idNotifi = 54;
    const id = type === "notifis" ? idNotifi : null;
    const endPoint = id
      ? `${api_url}/posts?_embed&per_page=10&status=publish&page=${page}&categories=${id}`
      : `${api_url}/posts?_embed&per_page=10&status=publish&page=${page}`;

    //get posts category==='tin-tuc'
    const res = await fetchAuth({ url: endPoint, revalidate: 1 });
    if (!res.ok) {
      throw new Error(`Posts fetch failed with status: ${res.statusText}`);
    }
    const totalPostsAll = res.headers?.get("X-WP-Total") || "0";

    //loại bỏ catefory data trong tổng bài viết
    totalPosts = String(Number(totalPostsAll) - 4);

    const postsNotFeatureImageAll: any[] = (await res?.json()) || [];

    //loại bỏ catefory data
    const postsNotFeatureImage: any[] = postsNotFeatureImageAll.filter(
      (post) =>
        post?.slug !== "gioi-thieu" &&
        post?.slug !== "lich-khai-giang" &&
        post?.slug !== "form-poup" &&
        post?.slug !== "form-main"
    );
    posts =
      postsNotFeatureImage?.length > 0
        ? postsNotFeatureImage?.map((post: any) => {
            const featured_image =
              post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;

            return {
              ...post,
              featured_image
            };
          })
        : [];
  } catch (error) {
    console.log(error);
  }

  if (req.method === "GET") {
    res.status(200).json({
      posts,
      totalPosts
    });
  }
}
