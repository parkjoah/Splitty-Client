import LikePopBtn from "@/components/like-pop-btn";
import { useJoinTrade } from "@/hooks/useStatus";
import { useRouter } from "next/navigation";
import { useState } from "react";

const statusInfo = {
  OPEN: { text: "참여하기", url: "" },
  CLOSED: { text: "모집완료", url: "" },
  COMPLETED: { text: "거래완료", url: "" },
  JOINED: { text: "참여중...", url: "" },
};

export default function ProductDetailBottomSection({
  price,
  rest,
  goodsId,
  status,
}: {
  price: string;
  rest: number;
  goodsId: number;
  status: keyof typeof statusInfo;
}) {
  const currentStatus = statusInfo[status] ?? statusInfo.OPEN;
  const isDisabled = status === "CLOSED" || status === "COMPLETED";
  const router = useRouter();
  const { mutate } = useJoinTrade();
  const [showModal, setShowModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [isJoining, setIsJoining] = useState(false);

  const handleButtonClick = () => {
    if (status === "OPEN") {
      setShowModal(true);
    } else if (status === "JOINED") {
      router.push("/chatlist");
    }
  };

  const handleJoin = () => {
    if (isJoining) return;
    setIsJoining(true);

    const joinQuantity = Math.min(quantity, rest);

    mutate(
      { goodsId, quantity: joinQuantity },
      {
        onSettled: () => {
          setShowModal(false);
          setIsJoining(false);
          setQuantity(1);
          router.push(`/chat/${goodsId}`);
        },
      }
    );
  };

  const handleCancel = () => {
    setShowModal(false);
    setQuantity(1);
  };

  const handleDecrease = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleIncrease = () => {
    setQuantity((prev) => Math.min(rest, prev + 1));
  };

  return (
    <div>
      <div className="fixed bottom-0 bg-white flex  w-full typo-r12 items-center align-center px-4 pb-[29px] py-2 border-t border-[#F2F2F2] h-[80px] justify-between ">
        <div className="flex gap-4 items-center">
          <LikePopBtn goodsId={goodsId} />
          <div className="flex flex-col border-l pl-4 border-[#F2F2F2]">
            <p className="typo-b14">{`1개당 가격 ${Number(
              price
            ).toLocaleString()}`}</p>
            <p className="typo-b12 text-[#8C8C8C]">{`${rest}개 남음`}</p>
          </div>
        </div>
        <button
          className={`typo-b14 px-[14px] py-2 rounded-[4px] ${
            isDisabled
              ? "bg-[#E0E0E0] text-[#A1A1A1] cursor-not-allowed"
              : "bg-[#4F4DF8] text-white hover:bg-[#3c3ae6]"
          }`}
          disabled={isDisabled}
          onClick={handleButtonClick}
          type="button"
        >
          {currentStatus.text}
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-[9999]">
          <div className="bg-white rounded-lg p-6 w-[300px] shadow-lg flex flex-col gap-4">
            <h3 className="text-[18px] font-semibold text-center">참여하기</h3>

            <div className="flex justify-center gap-4 items-center">
              <button
                type="button"
                onClick={handleDecrease}
                disabled={quantity <= 1}
                className={`w-8 h-8 rounded-full text-[20px] font-bold ${
                  quantity <= 1
                    ? "bg-[#f2f2f2] text-[white]"
                    : "bg-[#E0E0E0] text-[#4F4F4F]"
                }`}
              >
                -
              </button>

              <input
                id="quantity"
                type="number"
                min={1}
                max={rest}
                value={quantity}
                onChange={(e) =>
                  setQuantity(
                    Math.min(rest, Math.max(1, Number(e.target.value)))
                  )
                }
                className="border border-[#E0E0E0] rounded-md px-2 py-1 w-[70px] text-center"
              />

              <button
                type="button"
                onClick={handleIncrease}
                disabled={quantity >= rest}
                className={`w-8 h-8 rounded-full text-[20px] font-bold ${
                  quantity >= rest
                    ? "bg-[#f2f2f2] text-[white]"
                    : "bg-[#E0E0E0] text-[#4F4F4F]"
                }`}
              >
                +
              </button>
            </div>

            <div className="flex justify-end gap-2 mt-3">
              <button
                type="button"
                onClick={handleCancel}
                className="typo-b14 text-[#8C8C8C] px-3 py-2 flex-1 bg-[#F2F2F2] rounded-md"
              >
                취소
              </button>
              <button
                type="button"
                onClick={handleJoin}
                disabled={isJoining}
                className={`typo-b14 px-3 py-2 rounded-md flex-1 ${
                  isJoining
                    ? "bg-[#A1A1A1] text-white"
                    : "bg-[#4F4DF8] text-white hover:bg-[#3c3ae6]"
                }`}
              >
                확인
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
