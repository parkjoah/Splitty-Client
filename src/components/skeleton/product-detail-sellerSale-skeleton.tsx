export default function ProductDetailSellerSaleSkeleton() {
  const arr = new Array(6).fill(0);
  return (
    <section className="mx-4 py-4 gap-4 flex flex-col">
      <div className="flex justify-between items-center">
        <h3 className="bg-[#f2f2f2] w-[176px] h-5"></h3>

        <div className="w-4 h-4 bg-[#f2f2f2]"></div>
      </div>
      <div className="gap-4 w-full">
        <div className="col-span-2 grid grid-cols-2 gap-4">
          {arr.map((_, idx) => (
            <div className="rounded-[4px]" key={idx}>
              <div className="flex flex-col gap-5 w-full h-auto relative aspect-square rounded-[4px] ">
                <div className="rounded-[4px] object-cover w-full h-full bg-[#f2f2f2]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
