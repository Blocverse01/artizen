import { FetchedContentRecord } from "@/lib/types";
import Image from "next/image";

type DisplayContentProps = {
  content: FetchedContentRecord;
};

const DisplayImageContent = ({ content }: DisplayContentProps) => {
  const previewUrl = content.preview_url!;

  return (
    <div className="h-[300px] w-full relative">
      <Image
        fill
        src={`/api/imageProxy?imageUrl=${previewUrl}`}
        className="rounded-lg object-cover"
        alt={"photo"}
      />
    </div>
  );
};

export { DisplayImageContent };
