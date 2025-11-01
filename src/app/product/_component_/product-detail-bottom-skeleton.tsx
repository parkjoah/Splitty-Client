import { Heart } from "lucide-react";

export default function ProductDetailBottomSkeleton() {
  return (
    <div className="fixed bottom-0 bg-white flex  w-full  items-center align-center px-4 pb-[29px] py-2 border-t border-[#F2F2F2] h-[80px] justify-between">
      <div className="flex gap-4 items-center">
        <Heart className={"text-gray-400"} size={25} />
        <div className="flex flex-col border-l pl-4 border-[#F2F2F2] gap-[2px]">
          <p className=" w-[111px] h-[18px] bg-[#F2F2F2]"></p>
          <p className=" bg-[#F2F2F2] w-10 h-4"></p>
        </div>
      </div>
      <div
        className={` px-[14px] py-2 rounded-[4px] bg-[#4F4DF8] w-[77px] h-[34px]
        `}
      ></div>
    </div>
  );
}
