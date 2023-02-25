import { PreviewContent } from "@/components/Explore/previewContent";
import { FetchedContentRecord } from "@/lib/types";
import Head from "next/head";
import { NextPageWithLayout } from "./_app";
import AppLayout from "@/layouts/AppLayout";
import Search from "@/layouts/search";
import { MasonryLayout } from "@/components/Explore/masonryLayout";
import { useState } from "react";
import axios from "axios";
import useSWR, { Fetcher } from "swr";
import { useRouter } from "next/router";

const fetcher: Fetcher<FetchedContentRecord[]> = async (url: string) => {
  const { data } = await axios.get(url);
  return data;
};

const ContentPage = ({
  index,
  search,
  newLimit,
  isLast,
}: {
  index?: number;
  search?: string;
  newLimit: () => void;
  isLast: boolean;
}) => {
  const { data, error, isLoading } = useSWR<FetchedContentRecord[]>(
    `/api/explore?page=${index}` + (search ? `&search=${search}` : ``),
    fetcher
  );
  if (error) return <div>failed to load</div>;
  if (isLoading || !data) return <></>;
  return (
    <>
      {data.map((item: FetchedContentRecord, i) => (
        <PreviewContent
          isLast={i === data.length - 1 && isLast}
          newLimit={newLimit}
          key={item.id}
          content={item}
        />
      ))}
    </>
  );
};

interface ExplorePageQuery {
  search?: string;
  page?: number;
}

const ExplorePage: NextPageWithLayout = () => {
  const { query } = useRouter();
  const { search, page: pageQuery }: ExplorePageQuery = query;
  const [page, setPage] = useState(pageQuery || 1);
  const newLimit = () => setPage((prev) => prev + 1);
  const pages = [];
  for (let i = 1; i <= page; i++) {
    pages.push(
      <ContentPage
        index={i}
        newLimit={newLimit}
        isLast={i === page}
        key={i}
        search={search as string}
      />
    );
  }
  return (
    <>
      <Head>
        <title>Explore photos, videos</title>
      </Head>
      <main className="space-y-14">
        <div className="space-y-8">
          <h3 className="font-bold hero-text-2 text-[40px] leading-[60.24px] w-fit mx-auto">
            Explore community curated content
          </h3>
          <Search center={true} defaultValue={search} />
        </div>
        <MasonryLayout>{pages}</MasonryLayout>
      </main>
    </>
  );
};

ExplorePage.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default ExplorePage;
