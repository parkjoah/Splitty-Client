export default function UserInfoSkeleton() {
  return (
    <div className="flex justify-between  py-4 border-b border-[#F2F2F2] ">
      <div className="flex gap-2 items-center">
        <div className="rounded-[100px] w-[40px] h-[40px] bg-[#F2F2F2]" />
        <div className=" flex flex-col gap-1">
          <h4 className="bg-[#F2F2F2] w-[146px] h-[18px]"></h4>
          <p className="bg-[#F2F2F2] w-[57px] h-4"></p>
        </div>
      </div>
      <div className="flex flex-col items-end gap-[2px]">
        <p className=" bg-[#F2F2F2] w-10 h-[18px]"></p>
        <p className="bg-[#F2F2F2] w-[28px] h-3"></p>
      </div>
    </div>
  );
}
