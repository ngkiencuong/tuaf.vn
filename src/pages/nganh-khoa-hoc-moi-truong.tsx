"use client";

import { Loading } from "@/components/Loading";
import { fetchAuth } from "@/ultil/fetchAuth";
import { fetchSeo } from "@/ultil/seo";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import ReactHtmlParser from "html-react-parser";
import { replaceSeoRM } from "@/ultil/seoRankMath";


const Khmt = dynamic(
  () => import("@/features/nganh-khmt").then((mod) => mod.Khmt),
  {
    loading: () => <Loading />
  }
);

interface IPostPage {
  head: string;
  home_content: any;
}
export const getServerSideProps: GetServerSideProps = async () => {
  const type = "khmt";
  const api_url = process.env.API_URL || "";
  const api_rm_url = process.env.API_RMS_URL || "";
  const api_url_seo = `${api_rm_url}/nganh-khoa-hoc-moi-truong`;

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
      <Khmt khmt={props.home_content?.acf?.khmt} />
    </>
  );
};

export default Page;
