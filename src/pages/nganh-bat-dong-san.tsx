"use client";

import { Loading } from "@/components/Loading";
import { fetchAuth } from "@/ultil/fetchAuth";
import { fetchSeo } from "@/ultil/seo";
import { replaceSeoRM } from "@/ultil/seoRankMath";
import ReactHtmlParser from "html-react-parser";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
const Bds = dynamic(
  () => import("@/features/nganh-bds").then((mod) => mod.Bds),
  {
    loading: () => <Loading />
  }
);
interface IPostPage {
  head: string;
  home_content: any;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const type = "bds";
  const api_url = process.env.API_URL || "";
  const api_rm_url = process.env.API_RMS_URL || "";
  const api_url_seo = `${api_rm_url}/nganh-bat-dong-san`;
  try {
    const reseo = await fetchSeo({ url: api_url_seo, revalidate: 3600 });
    if (!reseo.ok) {
      throw new Error(`SEO fetch failed with status: ${reseo.statusText}`);
    }
    const res = await fetchAuth({
      url: `${api_url}/${type}`,
      revalidate: 3600
    });
    if (!res.ok) {
      throw new Error(`Posts fetch failed with status: ${res.statusText}`);
    }
    const head = await reseo.json();
    const data = await res.json();
    const home_content = data ? data[0] : null;

    return {
      props: {
        head: head?.head || null,
        home_content
      }
    };
  } catch (error) {
    console.log(error);
    return {
      props: {
        head: null,
        home_content: null
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
      <Bds bds={props.home_content?.acf} />
    </>
  );
};

export default Page;
