"server only";

import { Box, Image } from "@chakra-ui/react";
import { GetServerSideProps } from "next";
import { NextSeo } from "next-seo";
import Head from "next/head";
import { ReactElement } from "react";

export const getServerSideProps: GetServerSideProps = async () => {
  const api_url = process.env.API_URL || "";
  try {
    const res = await fetch(`${api_url}/landing/?slug=he-dai-hoc-tu-xa`, {
      next: { revalidate: 3600 },
    });
    const posts = (await res.json()) || "";
    const post: any = posts ? posts[0] : null;

    return {
      props: { post: post || null },
    };
  } catch (error) {
    console.error("Error in fetching slug", error);
    return {
      props: { post: null },
    };
  }
};

interface IPostPage {
  post: any;
}

const Page = ({ post }: IPostPage) => {
  return (
    <>
      <NextSeo
        title="Chương trình đào tạo từ xa Đại học Nông Lâm Thái Nguyên"
        description="Thông tin về hệ đại học từ xa"
        noindex={true}
        nofollow={true}
        openGraph={{
          title: "Chương trình đào tạo từ xa Đại học Nông Lâm Thái Nguyên",
          url: "https://tuaf.vn/he-dai-hoc-tu-xa",
          images: [
            {
              url: "/logo_ehou",
              width: 1200,
              height: 630,
              alt: "Hệ đại học từ xa",
            },
          ],
        }}
      />

      <Head>
        <meta name="robots" content="noindex, nofollow" />
      </Head>

      {post?.acf?.landing ? (
        <div
          dangerouslySetInnerHTML={{
            __html: post?.acf?.landing,
          }}
        />
      ) : (
        <Box display={"flex"} justifyContent={"center"}>
          <Image src="/snapedit_1702603916913.png" alt="Dang-xay-dung" />
        </Box>
      )}
    </>
  );
};

// 🔥 Thêm phương thức này để loại bỏ Layout
Page.getLayout = function getLayout(page: ReactElement) {
  return page; // Không bọc Layout
};

export default Page;
