"server only";

import { fetchSeo } from "@/ultil/seo";
import { replaceSeoRM } from "@/ultil/seoRankMath";
import ReactHtmlParser from "html-react-parser";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";

const ErrorBoundary = dynamic(() => import("@/components/ErrorBoundary"));
const Posts = dynamic(() =>
  import("@/features/posts").then((mod) => mod.Posts)
);

export const getServerSideProps: GetServerSideProps = async () => {
  const api_rm_url = process.env.API_RMS_URL || "";
  const api_url = `${api_rm_url}/tin-tuc`;

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

const Page = (props: any) => {
  return (
    <>
      {props.head && (
        <div>
          <Head>{ReactHtmlParser(replaceSeoRM(props.head))}</Head>
        </div>
      )}
      <ErrorBoundary fallback={<h1>Lỗi server</h1>}>
        <Posts />
      </ErrorBoundary>
    </>
  );
};

export default Page;
