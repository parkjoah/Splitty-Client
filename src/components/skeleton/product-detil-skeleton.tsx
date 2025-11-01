export default function ProductDetilSkeleton() {
  return (
    <div className="py-4 gap-4 flex flex-col border-b border-[#F2F2F2]  ">
      <div className="flex flex-col gap-1">
        <h2 className="bg-[#F2F2F2] w-[186px] h-7"></h2>
        <p className="bg-[#f2f2f2] w-[42px] h-4"></p>
      </div>
      <div className="gap-1 flex flex-col">
        <div className="flex gap-1 ">
          <p className="w-4 h-4 bg-[#f2f2f2]"></p>
          <p className="w-[115px] h-4 bg-[#f2f2f2]"></p>
        </div>
        <div className="flex gap-1">
          <p className="w-4 h-4 bg-[#f2f2f2]"></p>
          <p className="w-[115px] h-4 bg-[#f2f2f2]"></p>
        </div>
      </div>
      <div className="bg-[#f2f2f2] w-[354px] h-[18px]"></div>
      <div className="bg-[#f2f2f2] w-25 h-4"></div>
    </div>
  );
}
