import Image from "next/image";
import Link from "next/link";
import sampleImg from "@/assets/imgs/sampleProduct.jpg";
import bagIcon from "@/assets/icons/bagIcon.svg";
import likeIcon from "@/assets/icons/likeIcon.svg";
import { productType } from "@/types/product";

import { apiFetch } from "@/app/api";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { useRouter } from "next/navigation";

const btnsList = {
  sales: {
    OPEN: { label: "거래 및 수량 확정" },
    CLOSED: { label: "거래완료" },
    COMPLETED: { label: "리뷰 작성하기" },
  },
  purchases: {
    OPEN: { label: "거래 나가기" },
    CLOSED: null,
    COMPLETED: { label: "리뷰 작성하기" },
  },
} as const satisfies Record<
  "sales" | "purchases",
  Partial<Record<"OPEN" | "CLOSED" | "COMPLETED", { label: string } | null>>
>;

export default function HistoryItemBox({
  product,
  className = "",
  kind,
}: {
  product: productType;
  className?: string;
  kind: "sales" | "purchases";
}) {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [status, setStatus] = useState<"OPEN" | "CLOSED" | "COMPLETED">(
    product.status
  );

  const currParticipants =
    product.currParticipants == -1 ? 1 : product.currParticipants;

  const { mutate } = useMutation({
    mutationFn: async (next: "CLOSED" | "COMPLETED") =>
      apiFetch(`/trade/change-status`, {
        method: "PATCH",
        body: JSON.stringify({
          goodsId: product.id,
          tradeStatus: next,
        }),
      }),
    onSuccess: (_, next) => {
      setStatus(next);
      if (next === "CLOSED")
        queryClient.invalidateQueries({
          queryKey: ["history", "sales", "OPEN"],
        });
    },
    onError: (err) => {
      console.error(err);
      alert("상태 변경에 실패했습니다.");
    },
  });

  const { mutate: leaveTrade } = useMutation({
    mutationFn: async () =>
      apiFetch(`/trade/leave?goodsId=${product.id}`, {
        method: "PUT",
      }),
    onSuccess: () => {
      alert("거래에서 나갔습니다.");
      queryClient.invalidateQueries({
        queryKey: ["history", "purchases", "OPEN"],
      });
    },
    onError: (err) => {
      console.error(err);
      alert("거래 나가기에 실패했습니다.");
    },
  });

  const handleAction = () => {
    if (kind === "sales") {
      switch (status) {
        case "OPEN":
          router.push(`/confirm/${product?.id}`);
          break;
        case "CLOSED":
          mutate("COMPLETED");
          break;
        case "COMPLETED":
          router.push(`/review/${product?.id}`);
          break;
      }
    } else if (kind === "purchases") {
      switch (status) {
        case "OPEN":
          leaveTrade();
          break;
        case "COMPLETED":
          router.push(`/review/${product?.id}`);
          break;
        default:
          break;
      }
    }
  };
  const IMAGE_BASE_URL =
    "https://splitty-bucket.s3.ap-northeast-2.amazonaws.com/";
  const imageUrl = product.imageName
    ? `${IMAGE_BASE_URL}${product.imageName}`
    : sampleImg;

  const handleChatBtn = () => {
    router.push(`/chat/${product.id}`);
  };
  return (
    <div
      className={`mx-4  py-4 flex flex-col gap-4 border-b border-[#F2F2F2] ${className} cursor-pointer`}
    >
      <Link href={`/product/${product.id}`} className={` flex gap-4 `}>
        <Image
          src={imageUrl}
          alt={product.name}
          width={110}
          height={110}
          className="w-[110px] h-[110px] rounded-[4px] object-cover "
        />
        <div className="flex flex-col justify-between flex-1">
          <div className="flex flex-col gap-1">
            <h2 className="typo-r14">{product.name}</h2>
            <p className="typo-r12 text-[#8C8C8C]">{`${product.neighName} ・ ${currParticipants}명 참여중`}</p>
            <h3 className="text-[15px] font-bold">
              {product.price.toLocaleString()}원
            </h3>
          </div>
          <div className="flex justify-end typo-r12 text-[#8C8C8C] items-center gap-[2px]">
            <Image src={bagIcon} alt="bag" />
            {product.leftQuantity}/{product.quantity}
            <Image src={likeIcon} alt="like" className="pl-[2px]" />
            {product.totalWishlist}
          </div>
        </div>
      </Link>
      <div className="typo-b12 gap-2 flex">
        <button
          className="bg-[#F2F2F2] w-full rounded-[4px] py-2"
          onClick={handleChatBtn}
        >
          채팅보기
        </button>

        {btnsList[kind]?.[status] && (
          <button
            className={`bg-[#F2F2F2] w-full rounded-[4px] py-2 ${
              product.reviewed
                ? "bg-[#F2F2F2] text-[#DADADA] "
                : " bg-[#F2F2F2]"
            } `}
            onClick={handleAction}
            disabled={product?.reviewed}
          >
            {!product.reviewed
              ? btnsList[kind]?.[status]?.label
              : "리뷰 작성완료"}
          </button>
        )}
      </div>
    </div>
  );
}
