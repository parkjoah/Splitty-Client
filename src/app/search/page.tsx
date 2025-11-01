"use client";
import clock from "@/assets/icons/searchClock.svg";
import close from "@/assets/icons/searchClose.svg";
import ProductItem from "@/components/product-item";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { getMySearchRec } from "../api/search";
import { useSearchProducts } from "@/hooks/useSearchProducts";
import { useEffect, useRef } from "react";
import { productType } from "@/types/product";
import { apiFetch } from "../api";
import ProductListItemSkeleton from "@/components/skeleton/product-list-skeleton";

export default function SearchPage() {
  const queryKey = ["searchedRec"];
  const queryFn = () => getMySearchRec();
  const { data: searchRec, isLoading: isSearching } = useQuery({
    queryKey,
    queryFn,
  });
  const recentList = searchRec || [];
  const queryClient = useQueryClient();

  const searchParams = useSearchParams();
  const keyword = searchParams.get("q") || "";

  const { data, fetchNextPage, hasNextPage, isLoading } =
    useSearchProducts(keyword);

  const observerRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!hasNextPage) return;
    const el = observerRef.current;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },
      { threshold: 1.0 }
    );

    if (el) observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, fetchNextPage]);

  const handleDeleteOneSearchHistory = async (searchHistoryId: number) => {
    await apiFetch(`/member/me/search/${searchHistoryId}`, {
      method: "DELETE",
    });
    queryClient.invalidateQueries({ queryKey });
  };
  const handleDeleteAllSearchHistory = async () => {
    await apiFetch(`/member/me/search`, {
      method: "DELETE",
    });
    queryClient.invalidateQueries({ queryKey });
  };

  return (
    <div>
      {!keyword && (
        <div>
          {keyword}
          <div className="flex justify-between px-4 py-3">
            <h2 className="typo-b16 font-bold text-[16px]">최근검색</h2>
            <button
              className="typo-r12 text-[#8C8C8C]"
              onClick={() => handleDeleteAllSearchHistory()}
            >
              전체 삭제
            </button>
          </div>
          <div className="flex gap-2 flex-col typo-r16 text-[#757575]">
            {recentList.length > 0 ? (
              recentList?.map((r: { id: number; keyword: string }) => (
                <div key={r.id} className="flex px-4 gap-2 ">
                  <Image src={clock} alt="최근" width={16} height={16} />
                  <p className="flex-1 ">{r.keyword}</p>
                  <Image
                    src={close}
                    alt="삭제"
                    width={15}
                    height={15}
                    onClick={() => handleDeleteOneSearchHistory(r.id)}
                  />
                </div>
              ))
            ) : isSearching ? (
              <div></div>
            ) : (
              <p className="text-gray-400 px-4">최근 검색어가 없습니다.</p>
            )}
          </div>
        </div>
      )}

      {keyword && (
        <div>
          {isLoading && <ProductListItemSkeleton count={10} />}
          {data?.pages.map((page, pageIdx) =>
            page?.map((product: productType) => (
              <ProductItem key={`${pageIdx}-${product.id}`} product={product} />
            ))
          )}
          <div
            ref={observerRef}
            className="h-12 flex justify-center items-center"
          ></div>
        </div>
      )}
    </div>
  );
}
