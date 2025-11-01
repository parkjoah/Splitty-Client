"use client";

import rateIcon from "@/assets/icons/staricon.svg";
import samplePrf from "@/assets/icons/samplePrf.svg";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { getMyInfo, getUserInfo } from "@/app/api/member";
import UserInfoSkeleton from "@/components/skeleton/user-info-skeletion";

export default function UserInfo({ memberId }: { memberId?: number }) {
  const queryKey = memberId ? ["member", memberId] : ["me"];
  const queryFn = memberId ? () => getUserInfo(memberId) : getMyInfo;
  const { data, isLoading } = useQuery({ queryKey, queryFn });

  return (
    <>
      {isLoading && (
        <div className="bg-white px-4 mx-4 rounded-[10px]">
          <UserInfoSkeleton />
        </div>
      )}
      {data && (
        <section className="bg-white mx-4 px-4 py-[14px] rounded-[10px] flex items-center justify-between ">
          <div className="flex gap-2 items-center ">
            <div className="w-10 h-10 rounded-[100px] overflow-hidden">
              <Image
                src={data?.profileImageUrl || samplePrf}
                alt="profile"
                width={40}
                height={40}
                className="object-cover"
              />
            </div>
            <div className="flex flex-col gap-[2px]">
              <p className="typo-b14">{data?.username}</p>
              <p className="typo-r12 text-[#4F4F4F]">
                {data?.neighName || "내 지역을 설정해주세요"}
              </p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-[2px]">
            <div className="flex text-[#4F4DF8] typo-b14">
              {data?.rating}
              <Image
                src={rateIcon}
                alt="rate"
                className=""
                width={16}
                height={16}
              />
            </div>
            <p className="text-[#8C8C8C] text-[10px]">신뢰도</p>
          </div>
        </section>
      )}{" "}
    </>
  );
}
