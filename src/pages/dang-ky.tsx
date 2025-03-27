"use client";

import { Loading } from "@/components/Loading";
import { fetchSeo } from "@/ultil/seo";
import { replaceSeoRM } from "@/ultil/seoRankMath";
import ReactHtmlParser from "html-react-parser";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";

const Dangky = dynamic(
  () => import("@/features/dang-ky").then((mod) => mod.Dangky),
  {
    loading: () => <Loading />
  }
);
interface IPostPage {
  head: string;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const api_rm_url = process.env.API_RMS_URL || "";
  const api_url_seo = `${api_rm_url}/dang-ky`;;

  try {
    const reseo = await fetchSeo({ url: api_url_seo, revalidate: 3600 });
    if (!reseo.ok) {
      throw new Error(`Posts fetch failed with status: ${reseo.statusText}`);
    }
    const head = await reseo.json();

    return {
      props: {
        head: head?.head || null,
      }
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        head: null,
      }
    };
  }
};

const Page = (props: IPostPage) => {
  const getTitleFromMeta = (head: string) => {
    const match = head.match(/<meta\s+property="og:title"\s+content="([^"]*)"/);
    return match ? match[1] : null;
  };

  // Lấy nội dung từ thẻ meta
  const ogTitleContent = props.head ? getTitleFromMeta(props.head) : null;

  return (
    <>
          {props.head && (
          <div>
            <Head>
              {ReactHtmlParser(replaceSeoRM(props.head))}
              <title>{ogTitleContent}</title>
            </Head>
          </div>
        )}
      <Dangky />
    </>
  );
};

export default Page;
