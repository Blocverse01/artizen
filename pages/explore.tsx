import { DisplayImageContent } from "@/components/Explore/displayImageContent";
import { FetchedContentRecord } from "@/lib/types";
import { getXataClient } from "@/xata";
import Head from "next/head";
import { NextPageWithLayout } from "./_app";
import AppLayout from "@/layouts/AppLayout";
import { GetServerSidePropsContext } from "next";
import Search from "@/layouts/search";

interface Props {
  content: FetchedContentRecord[];
  search?: string;
}

const ExplorePage: NextPageWithLayout<Props> = ({ content, search }: Props) => {
  return (
    <>
      <Head>
        <title>Explore photos, videos</title>
      </Head>
      <main>
        <h3 className="font-bold hero-text-2 text-[40px] leading-[60.24px] mb-8">
          Explore community curated content
        </h3>
        <Search center={false} defaultValue={search} />
        {search && (
          <p className="text-white text-xl mt-8 mb-8">
            Search results for: {search}
          </p>
        )}
        <div className="grid gap-6 mt-8 lg:grid-cols-3">
          {content.map((content) => (
            <DisplayImageContent content={content} key={content.rootCid} />
          ))}
        </div>
      </main>
    </>
  );
};

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const { query } = context;
  const search = query.search;
  const xata = getXataClient();
  let content;
  if (search) {
    content = await xata.db.content.search(search as string, {
      target: ["description"],
    });
  } else {
    content = await xata.db.content.getAll();
  }

  return {
    props: {
      content: JSON.parse(JSON.stringify(content)),
      search: search ? search : null,
    },
  };
}

ExplorePage.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default ExplorePage;
