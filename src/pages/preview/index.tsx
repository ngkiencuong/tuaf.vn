import dynamic from "next/dynamic";

const DraftPosts = dynamic(() =>
  import("@/features/draft-post").then((mod) => mod.DraftPosts)
);

const Page = () => {
  return (
    <>
      <DraftPosts />
    </>
  );
};

export default Page;
