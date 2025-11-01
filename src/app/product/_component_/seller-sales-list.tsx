"use client";
import nextIcon from "@/assets/icons/product_next.svg";

import Image from "next/image";
import ItemBox from "./itemBox";
import Link from "next/link";

import { useEffect, useState } from "react";
import { useCursorMemberSales } from "../../../hooks/useCursorMemberSales";

export default function SellerSalesList({
  sellerInfo,
}: {
  sellerInfo: { id: number; username: string };
}) {
  const [memberId, setMemberId] = useState<number>(0);
  useEffect(() => {
    if (!sellerInfo) return;
    setMemberId(sellerInfo?.id);
  }, [sellerInfo]);

  const { data } = useCursorMemberSales(memberId!);
  const salesItems = data?.pages[0]?.items?.slice(0, 6) ?? [];

  return (
    <section className="mx-4 py-4 gap-4 flex flex-col">
      <div className="flex justify-between items-center">
        <h3 className="typo-b14">{sellerInfo?.username}님의 판매 상품</h3>
        <Link href={`/sellerDetail/${sellerInfo?.id}`}>
          <Image src={nextIcon} alt="더보기" width={16} height={16} />
        </Link>
      </div>
      <div className="gap-4 w-full">
        <div className="col-span-2 grid grid-cols-2 gap-4">
          {salesItems.map(
            (product: {
              id: number;
              imageName: string;
              name: string;
              price: number;
              imageUrlPrefix: string;
            }) => (
              <ItemBox
                p={{
                  id: product?.id,
                  thumbImg: product?.imageUrlPrefix + product?.imageName,
                  title: product?.name,
                  price: product?.price,
                }}
                key={product?.id}
              />
            )
          )}
        </div>
      </div>
    </section>
  );
}
