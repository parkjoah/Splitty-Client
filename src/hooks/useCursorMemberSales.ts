import { getMemberSalesList } from "@/app/api/member";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useCursorMemberSales = (memberId: number) => {
  return useInfiniteQuery({
    queryKey: ["memberSalesList", memberId],
    queryFn: ({ pageParam }) =>
      getMemberSalesList({
        pageParam: pageParam ?? { lastId: null, memberId, lastCreatedAt: null },
      }),
    initialPageParam: { lastId: null, memberId, lastCreatedAt: null },
    getNextPageParam: (lastPage) => {
      return lastPage.hasNext
        ? {
            lastId: lastPage.nextCursor.lastId ?? null,
            memberId: memberId,
            lastCreatedAt: lastPage.nextCursor.lastCreatedAt ?? null,
          }
        : undefined;
    },
  });
};
