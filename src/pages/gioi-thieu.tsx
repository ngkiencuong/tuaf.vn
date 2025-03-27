"use client";

import { Loading } from "@/components/Loading";
import { fetchSeo } from "@/ultil/seo";
import { replaceSeoRM } from "@/ultil/seoRankMath";
import ReactHtmlParser from "html-react-parser";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useEffect, useState } from "react";

export const getServerSideProps: GetServerSideProps = async () => {
  const api_rm_url = process.env.API_RMS_URL || "";
  const api_url = `${api_rm_url}/gioi-thieu`;

  try {
    const res = await fetchSeo({ url: api_url, revalidate: 3600 });
    if (!res.ok) {
      throw new Error(`Posts fetch failed with status: ${res.statusText}`);
    }
    const head = await res.json();
    return {
      props: {
        head: head?.head || null
      }
    };
  } catch (error) {
    return {
      props: {
        head: null
      }
    };
  }
};

const About = dynamic(
  () => import("@/features/about").then((mod) => mod.About),
  {
    loading: () => <Loading />
  }
);

const Page = (props: any) => {
  const [isLoading, setIsLoading] = useState(true);
  const [page_content, setPageContent] = useState<any>(null);

  useEffect(() => {
    const getPageContent = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/content-page/?type=gioi-thieu`, {
          next: { revalidate: 3 }
        });
        if (!res.ok) {
          throw new Error(`Posts fetch failed with status: ${res.statusText}`);
        }
        const data = await res.json();
        setPageContent(data?.posts[0]);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
      }
      setIsLoading(false);
    };
    getPageContent();
  }, []);
  return (
    <>
      {props.head && (
        <div>
          <Head>{ReactHtmlParser(replaceSeoRM(props.head))}</Head>
        </div>
      )}
      {isLoading && <Loading />}
      {!isLoading && <About content={page_content} />}
    </>
  );
};

export default Page;
