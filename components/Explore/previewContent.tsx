import { useObserver } from "@/hooks/useObserver";
import { FetchedContentRecord } from "@/lib/types";
import Image from "next/image";
import { useRef } from "react";
import BlurImage from "./blurImage";

type PreviewContentProps = {
  content: FetchedContentRecord;
  isLast: boolean;
  newLimit: () => void;
  onClick: () => void;
};

const PreviewContent = ({
  content,
  isLast,
  newLimit,
  onClick,
}: PreviewContentProps) => {
  const previewUrl = content.preview_url!;
  const imageExtensions = ["jpg", "jpeg", "png", "gif", "webp"];
  const extFromUrl = previewUrl.split(".").pop();
  const isImage = imageExtensions.includes(extFromUrl!);
  const { width, height } = content.dimension! || {};
  const ref = useRef<HTMLImageElement>(null);

  useObserver(ref, isLast, newLimit);

  return (
    <>
      {isImage && (
        <label htmlFor="content-modal" className="block cursor-pointer" onClick={onClick}>
          <Image
            ref={ref}
            src={`/api/imageProxy?imageUrl=${previewUrl}`}
            className="rounded-lg image-full"
            alt={"photo"}
            height={height!}
            width={width!}
            blurDataURL={BlurImage}
          />
          {""}
        </label>
      )}
    </>
  );
};

export { PreviewContent };
