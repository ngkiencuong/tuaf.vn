"server only";

import { NextSeo } from "next-seo";
import dynamic from "next/dynamic";

const ErrorBoundary = dynamic(() => import("@/components/ErrorBoundary"));
const Search = dynamic(() =>
  import("@/features/search").then((mod) => mod.Search)
);

const Page = () => {
  return (
    <>
      <NextSeo
        title="Tin tức và thông báo tuyển sinh - Học viện Công nghệ Bưu chính Viễn thông"
        description="Học viện Công nghệ Bưu chính Viễn thông tuyển sinh năm 2023 - tổng hợp các tin tức tuyển sinh mới nhất của Học viện Công nghệ Bưu chính Viễn thông"
      />
      <ErrorBoundary fallback={<h1>Lỗi server</h1>}>
        <Search />
      </ErrorBoundary>
    </>
  );
};

export default Page;
