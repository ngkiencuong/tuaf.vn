"server only";

import Layout from "@/layouts";
import { fetchAuth } from "@/ultil/fetchAuth";
import { fetchSeo } from "@/ultil/seo";
import { replaceSeoRM } from "@/ultil/seoRankMath";
import ReactHtmlParser from "html-react-parser";
import { GetServerSideProps } from "next";
import dynamic from "next/dynamic";
import Head from "next/head";
import { ReactElement } from "react";

const ErrorBoundary = dynamic(() => import("@/components/ErrorBoundary"));
const Post = dynamic(() => import("@/features/post").then((mod) => mod.Post));
const LayoutPost = dynamic(() =>
  import("@/layouts/layoutPost").then((mod) => mod.LayoutPost)
);

export const getServerSideProps: GetServerSideProps = async (context: any) => {
  const api_url = process.env.API_URL || "";
  const url = process.env.API_RMS_URL || "";
  try {
    const params = context.params;
    const slug = params?.slug || "";
    const res = await fetchAuth({
      url: `${api_url}/posts?slug=${slug}`,
      revalidate: 3600
    });
    if (!res.ok) {
      throw new Error(`Posts fetch failed with status: ${res.statusText}`);
    }
    const resSeo = await fetchSeo({
      url: `${url}/${slug}`,
      revalidate: 3600
    });
    if (!resSeo.ok) {
      throw new Error(`Posts fetch failed with status: ${resSeo.statusText}`);
    }
    const head = await resSeo.json();
    const posts = await res.json();
    const post = posts ? posts[0] : null;

    return {
      props: { post: post || null, head: head.head || null }
    };
  } catch (error) {
    console.log(error);
    return {
      props: { post: null, head: null }
    };
  }
};

interface IPostPage {
  post: any;
  head: string;
}

const Page = (props: IPostPage) => {
  const { post, head } = props;
  return (
    <>
      {head && (
        <div>
          <Head>{ReactHtmlParser(replaceSeoRM(head))}</Head>
        </div>
      )}
      <ErrorBoundary fallback={<h1>Lỗi phía máy chủ</h1>}>
        <Post post={post} />
      </ErrorBoundary>
    </>
  );
};

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout><LayoutPost>{page}</LayoutPost></Layout>;

};

export default Page;
