"use client";
import Image from "next/image";
import homeWhite from "@/assets/icons/homeWhite.svg";
import homebk from "@/assets/icons/homebkBig.svg";

import Link from "next/link";
import BackBtn from "../../../components/backBtn";
import SellerInfo from "../_component_/seller-section";
import ImgSection from "../_component_/img-section";
import ProductDetailBottomSection from "../_component_/bottom-section";
import { getHasJoined, getProductDetail } from "@/app/api/product";
import { useQuery } from "@tanstack/react-query";
import BackBkBtn from "@/components/back-bk-btn";
import { useEffect, useState } from "react";
import SellerSalesList from "./seller-sales-list";
import ProductInfoSection from "./product-info-section";
import UserInfoSkeleton from "@/components/skeleton/user-info-skeletion";
import ProductDetilSkeleton from "@/components/skeleton/product-detil-skeleton";
import ProductDetailBottomSkeleton from "./product-detail-bottom-skeleton";
import ProductDetailSellerSaleSkeleton from "@/components/skeleton/product-detail-sellerSale-skeleton";

export default function ProductDetailClient({ id }: { id: number }) {
  const goodsId = id;
  const { data: product, isLoading } = useQuery({
    queryKey: ["goodsId", goodsId],
    queryFn: () => getProductDetail(goodsId),
  });

  const [status, setStatus] = useState<
    "OPEN" | "JOINED" | "CLOSED" | "COMPLETED"
  >(product?.status ?? "OPEN");

  const { data } = useQuery({
    queryKey: ["hasJoined", goodsId],
    queryFn: () => getHasJoined(goodsId),
    refetchOnMount: true,
  });

  useEffect(() => {
    if (product?.status === "COMPLETED") {
      setStatus("COMPLETED");
    } else if (data?.hasJoined === true) {
      setStatus("JOINED");
    } else {
      setStatus(product?.status);
    }
  }, [data, product?.status]);

  const isBlank = !product?.images || product.images.length == 0;

  return (
    <div className="-mt-[47px] typo-r12 relative mb-[80px]">
      {/* 하단 고정 바 */}
      <div className="absolute top-[47px] left-4 z-11 flex gap-4">
        {isBlank ? <BackBkBtn /> : <BackBtn />}
        <Link href={`/home`} className="flex ">
          <Image
            src={isBlank ? homebk : homeWhite}
            alt="home"
            width={20}
            height={20}
          />
        </Link>
      </div>
      {/* 사진영역 */}
      <ImgSection
        productTitle={product?.name}
        imageUrls={product?.imageName || []}
      />
      {/* 정보영역 */}

      {isLoading ? (
        <>
          <section className="mx-4 ">
            <UserInfoSkeleton />
            <ProductDetilSkeleton />
          </section>
          <ProductDetailSellerSaleSkeleton />
          <ProductDetailBottomSkeleton />
        </>
      ) : (
        <>
          {" "}
          <section className="mx-4 ">
            {/* 1- 판매자 정보 */}
            <SellerInfo info={product?.seller} />
            {/* 2- 상세정보 */}
            <ProductInfoSection product={product} />
          </section>
          {/* 판매상품 목록*/}
          <SellerSalesList sellerInfo={product?.seller} />
          <ProductDetailBottomSection
            price={product?.unitPrice}
            rest={product?.leftQuantity}
            goodsId={goodsId}
            status={status}
          />
        </>
      )}
    </div>
  );
}
