export default function UploadBottomSection({
  price,
  onClick,
}: {
  price: string;
  onClick: () => void;
}) {
  return (
    <div className="fixed bottom-0 bg-white flex  w-full typo-r12 items-center align-center px-4 pb-[29px] py-2 border-t border-[#F2F2F2] h-[80px] justify-between">
      <div className="flex flex-col">
        <p className="typo-b12 text-[#8C8C8C]">1개당 가격</p>
        <p className="typo-b14">{price}</p>
      </div>
      <button
        className="typo-b14 px-[14px] py-2 bg-[#4F4DF8] text-[white] rounded-[4px]"
        onClick={onClick}
      >
        등록하기
      </button>
    </div>
  );
}
