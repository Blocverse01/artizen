import { useObserver } from "@/hooks/useObserver";
import { FetchedContentRecord } from "@/lib/types";
import Image from "next/image";
import { useRef } from "react";
import BlurImage from "./blurImage";
import { motion } from "framer-motion";

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

  const variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };
  const whileHover = {
    scale: 1.1,
    transition: { duration: 0.2 },
  };
  const whileTap = {
    scale: 0.9,
    transition: { duration: 0.2 },
  };

  return (
    <>
      {isImage && (
        <motion.label
          variants={variants}
          initial="hidden"
          animate="visible"
          whileHover={whileHover}
          whileTap={whileTap}
          htmlFor="content-modal"
          className="block cursor-pointer"
          onClick={onClick}
        >
          <Image
            ref={ref}
            src={`/api/imageProxy?imageUrl=${previewUrl}`}
            className="rounded-lg image-full"
            alt={"photo"}
            height={height!}
            width={width!}
            blurDataURL={BlurImage}
            placeholder="blur"
          />
          {""}
        </motion.label>
      )}
    </>
  );
};

export { PreviewContent };
