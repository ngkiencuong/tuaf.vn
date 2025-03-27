"use client";

import { Loading } from "@/components/Loading";
import { fetchSeo } from "@/ultil/seo";
import ReactHtmlParser from "html-react-parser";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useEffect, useState } from "react";
import { replaceSeoRM } from "@/ultil/seoRankMath";

const LichKg = dynamic(
  () => import("@/features/lich-khai-giang").then((mod) => mod.LichKg),
  {
    loading: () => <Loading />
  }
);

interface IPostPage {
  head: string;
}

export const getServerSideProps: GetServerSideProps = async () => {
  const api_rm_url = process.env.API_RMS_URL || "";
  const api_url_seo = `${api_rm_url}/lich-khai-giang`;;

  try {
    const reseo = await fetchSeo({ url: api_url_seo, revalidate: 3600 });
    if (!reseo.ok) {
      throw new Error(`SEO fetch failed with status: ${reseo.statusText}`);
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
  const [list, setList] = useState<string[]>([
    "Lịch khai giảng tại Hồ Chí Minh: 15/10/2023",
    "Lịch khai giảng tại Hồ Chí Minh: 15/10/2023"
  ]);
  const [isLoading, setIsLoading] = useState(true);
  const [page_content, setPageContent] = useState<any>(null);
  const getTitleFromMeta = (head: string) => {
    const match = head.match(/<meta\s+property="og:title"\s+content="([^"]*)"/);
    return match ? match[1] : null;
  };

  // Lấy nội dung từ thẻ meta
  const ogTitleContent = props.head ? getTitleFromMeta(props.head) : null;
  
  useEffect(() => {
    const getLichKg = async () => {
      try {
        const res = await fetch("/api/data-lichKg");
        if (!res.ok) {
          throw new Error(`Posts fetch failed with status: ${res.statusText}`);
        }
        const data = await res.json();
        const list: string[] = data?.list || [];
        const content: any[] = data?.content || [];
        content?.length > 0 && setPageContent(content[0]);
        list?.length > 0 && setList(list);
      } catch (error) {
        console.log(error);
      }
      setIsLoading(false);
    };

    getLichKg();
  }, []);

  
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
      <LichKg list={list} isLoading={isLoading} page_content={page_content} />
    </>
  );
};

export default Page;
