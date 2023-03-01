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
import ContentModal from "@/components/Explore/contentModal";
import useIsMounted from "@/hooks/useIsMounted";
import EventsStreamer from "@/components/eventsStream";
import useGlobalStore from "@/store/globalStore";
import { BigNumber } from "ethers";
import { useAccount } from "wagmi";
import { PropagateLoader } from "react-spinners";

const fetcher: Fetcher<FetchedContentRecord[]> = async (url: string) => {
  const { data } = await axios.get(url);
  return data;
};

const ContentPage = ({
  index,
  search,
  newLimit,
  isLast,
  expandContent,
}: {
  index?: number;
  search?: string;
  newLimit: () => void;
  isLast: boolean;
  expandContent: (content: FetchedContentRecord) => void;
}) => {
  const { data, error, isLoading } = useSWR<FetchedContentRecord[]>(
    `/api/explore?page=${index}` + (search ? `&search=${search}` : ``),
    fetcher
  );
  if (error)
    return (
      <>
        <div className="absolute bottom-0 text-lg text-slate-300 left-0 right-0 h-fit flex justify-center">
          ⚠️ Error loading content
        </div>
      </>
    );
  if (isLoading || !data)
    return (
      <>
        <div className="absolute bottom-0 left-0 right-0 h-fit flex justify-center">
          <PropagateLoader color="#30FFB4" />
        </div>
      </>
    );
  return (
    <>
      {data.map((item: FetchedContentRecord, i) => (
        <PreviewContent
          isLast={i === data.length - 1 && isLast}
          newLimit={newLimit}
          key={item.id}
          content={item}
          onClick={() => expandContent(item)}
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
  const isMounted = useIsMounted();
  const { query } = useRouter();
  const { search, page: pageQuery }: ExplorePageQuery = query;
  const [page, setPage] = useState(pageQuery || 1);
  const [selectedContent, setSelectedContent] =
    useState<FetchedContentRecord>();

  const { address } = useAccount();
  const licenses = useGlobalStore((state) => state.licenses);

  const newLimit = () => setPage((prev) => prev + 1);
  const pages = [];

  const handleContentSelection = (content: FetchedContentRecord) => {
    setSelectedContent(content);
  };

  for (let i = 1; i <= page; i++) {
    pages.push(
      <ContentPage
        index={i}
        newLimit={newLimit}
        isLast={i === page}
        key={i}
        search={search as string}
        expandContent={handleContentSelection}
      />
    );
  }
  if (!isMounted) return null;
  return (
    <>
      <EventsStreamer />
      <Head>
        <title>Explore photos, videos</title>
      </Head>
      <main className="space-y-14">
        <div className="space-y-8">
          <h3 className="font-bold hero-text-2 text-center text-3xl lg:text-[40px] lg:leading-[60.24px] w-fit mx-auto">
            Explore community curated content
          </h3>
          <Search center={true} defaultValue={search} />
        </div>
        <MasonryLayout>{pages}</MasonryLayout>
      </main>
      {selectedContent && (
        <ContentModal
          content={selectedContent}
          license={
            licenses.find(
              (license) =>
                license.licensee === address &&
                license.contentId.eq(BigNumber.from(selectedContent.cipherId!))
            ) || null
          }
        />
      )}
    </>
  );
};

ExplorePage.getLayout = (page) => <AppLayout>{page}</AppLayout>;

export default ExplorePage;
