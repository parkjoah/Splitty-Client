import Image from "next/image";
import personIcon from "@/assets/icons/product_person.svg";
import locationIcon from "@/assets/icons/product_location.svg";

export default function ProductInfoSection({
  product,
}: {
  product: {
    categoryId: number;
    name: string;
    description: string;
    totalPrice: number;
    totalQuantity: number;
    leftQuantity: number;
    preferredLocation: string;
    imageNames: string[];
    currParticipants: number;
    category: string;
    totalWishlist: number;
    viewCount: number;
  };
}) {
  return (
    <div className="py-4 gap-4 flex flex-col border-b border-[#F2F2F2]  ">
      <div className="flex flex-col gap-1">
        <h2 className="typo-b18">{product?.name}</h2>
        <p className="typo-r12 text-[#8C8C8C]">{product?.category}</p>
      </div>
      <div className="typo-r12">
        <p className="flex gap-1">
          <Image src={personIcon} alt="person" />
          {`${product?.currParticipants}명 참여중`}
        </p>
        <p className="flex gap-1">
          <Image src={locationIcon} alt="location" />
          {`${product?.preferredLocation}`}
        </p>
      </div>
      <div className="typo-r14">{product?.description}</div>
      <div className="text-[#8C8C8C]">{`관심 ${product?.totalWishlist} · 조회 ${product?.viewCount}`}</div>
    </div>
  );
}
