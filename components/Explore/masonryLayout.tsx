import React from "react";

interface MasonryLayoutProps {
  children: React.ReactNode;
}

const MasonryLayout = ({ children }: MasonryLayoutProps) => {
  return (
    <section className="columns-2 lg:columns-3 xl:columns-4 gap-5 xl:gap-6 xl:space-y-6 space-y-5 mx-auto max-w-[80rem]">
      {children}
    </section>
  );
};

export { MasonryLayout };
