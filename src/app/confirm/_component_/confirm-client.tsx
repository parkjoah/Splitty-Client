"use client";

import CloseButton from "@/components/close-button";

import Image from "next/image";
import minisIcon from "@/assets/icons/minus.svg";
import plusIcon from "@/assets/icons/plus.svg";

import ConfirmItemBox from "../_component_/confirm-item-box";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { getTradeQuantity } from "../../api/confirm";
import { summaryProductInfo } from "@/app/api/chat";

import { confirmTradeQuantity } from "@/app/api/status";
import { useRouter } from "next/navigation";
import { QuantityUser } from "@/types/confirm-review";

export default function ConfirmClient({ id }: { id: string }) {
  const goodsId = Number(id);
  const router = useRouter();

  const queryKey = ["productSummary", goodsId];
  const queryFn = () => summaryProductInfo(goodsId);
  const { data: productInfo } = useQuery({ queryKey, queryFn });

  const pricePerItem = productInfo?.price ?? 0;

  const { data } = useQuery({
    queryKey: ["getTradeQuantity", goodsId],
    queryFn: () => getTradeQuantity(goodsId),
  });
  const [users, setUsers] = useState<QuantityUser[]>([]);

  useEffect(() => {
    if (data?.quantities) {
      setUsers(data.quantities);
    }
  }, [data]);

  const handleChange = (index: number, delta: number) => {
    setUsers((prev) =>
      prev.map((u, i) =>
        i === index ? { ...u, quantity: Math.max(0, u.quantity + delta) } : u
      )
    );
  };
  const handleInputChange = (index: number, newValue: string) => {
    const newQ = parseInt(newValue, 10);
    if (isNaN(newQ)) return;
    setUsers((prev) =>
      prev.map((u, i) =>
        i === index ? { ...u, quantity: Math.max(0, newQ) } : u
      )
    );
  };

  const handleConfirm = async () => {
    try {
      await confirmTradeQuantity(
        goodsId,
        users.map(({ memberId, quantity }) => ({ memberId, quantity }))
      );

      alert("수량 등록 되었습니다");
      router.push("/history/sales");
    } catch (err) {
      console.error(err);
      alert("거래 완료 중 오류가 발생했습니다.");
    }
  };
  return (
    <div>
      <div className="relative flex flex-col gap-4">
        <div className="flex justify-center items-center py-[14px] border-b border-[#F2F2F2] relative">
          <div className="absolute left-4">
            <CloseButton />
          </div>
          <h2 className="typo-b18">모집완료 및 수량 확정</h2>
        </div>
        <ConfirmItemBox product={productInfo} />
        <div className="flex flex-col py-3 gap-2 px-4">
          {users.map((u, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between bg-[#F2F2F2] rounded-[10px] px-[18px] py-[14px]"
            >
              <div className="flex items-center text-[#DADADA] rounded-full text-center">
                <Image
                  src={u.profileImageUrl}
                  alt={u.username}
                  width={40}
                  height={40}
                  className="object-cover rounded-full"
                />
                <h4 className="typo-b14 pl-4 text-[#4F4F4F]">{u.username}님</h4>
                <div className=" pl-2 text-[#8C8C8C] typo-r12">
                  {(pricePerItem * u.quantity).toLocaleString()}원
                </div>
              </div>
              <div className="flex w-[120px] items-center gap-1 justify-end">
                <button onClick={() => handleChange(idx, -1)}>
                  <Image src={minisIcon} alt="-" width={25.54} height={25.54} />
                </button>
                <input
                  className="w-10 text-center focus:outline-[#F2F2F2] typo-r14"
                  value={`${u.quantity}개`}
                  onChange={(e) => handleInputChange(idx, e.target.value)}
                />
                <button onClick={() => handleChange(idx, +1)}>
                  <Image src={plusIcon} alt="+" width={25.54} height={25.54} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="fixed bottom-0 bg-white flex  w-full typo-r12 items-center align-center px-4 pb-[29px] py-2 border-t border-[#F2F2F2] h-[80px] justify-end">
        <button
          className="typo-b14 px-[14px] py-2 bg-[#4F4DF8] text-[white] rounded-[4px]"
          onClick={handleConfirm}
        >
          거래 및 수량 확정
        </button>
      </div>
    </div>
  );
}
