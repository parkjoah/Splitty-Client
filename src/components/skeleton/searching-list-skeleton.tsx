export default function SearchingSkeleton() {
  return new Array(10).fill(0).map((_, idx) => (
    <div key={idx}>
      <div className="px-4 animate-pulse flex justify-between ">
        <div className="flex gap-2 flex-1">
          <p className="bg-[#f2f2f2] w-5 h-5"></p>
          <p className="bg-[#f2f2f2] w-50 h-5"></p>
        </div>
        <p className="bg-[#f2f2f2] w-5 h-5"></p>
      </div>
    </div>
  ));
}
