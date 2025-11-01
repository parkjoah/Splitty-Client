"use client";
import CloseButton from "@/components/close-button";
import NoticeItemBox from "./_component_/notice-item-box";
import { useEffect, useRef } from "react";
import { useCursorNoticfications } from "@/hooks/useCursorNoticfications";

export default function NoticePage() {
  const observerRef = useRef<HTMLDivElement | null>(null);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useCursorNoticfications();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    });

    const el = observerRef.current;
    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div>
      <div className="px-4 py-3 fixed top-0 h-[95px] w-full bg-[white] pt-[27px] flex flex-col   ">
        <CloseButton />
        <h2 className="py-[21px] border-b border-[#F2F2F2] typo-b18">
          알림내역
        </h2>
      </div>
      <div className="pt-[100px] pb-[40px] px-4 ">
        {data?.pages.map((page) =>
          page.data?.map(
            (n: {
              body: string;
              createdAt: string;
              id: number;
              imageName: string;
              imageUrlPrefix: string;
              title: string;
              redirectUrl: string;
            }) => <NoticeItemBox key={n.id} {...n} />
          )
        )}
        <div ref={observerRef}></div>
      </div>
    </div>
  );
}
