"use client";
import Image from "next/image";

import gpsIcon from "@/assets/icons/gpsIcon.svg";
import { postLocation } from "@/app/api/member";
import { useQueryClient } from "@tanstack/react-query";
import SettingNotificationBtn from "./settingNotificationBtn";

export default function MyLocation() {
  const queryClient = useQueryClient();
  const sendLocation = async () => {
    if (!navigator.geolocation) {
      console.log("오류가 발생했습니다");
      return;
    }
    navigator.geolocation.getCurrentPosition(async (p) => {
      const latitude = p.coords.latitude;
      const longitude = p.coords.longitude;
      try {
        await postLocation({ latitude, longitude });
        await queryClient.invalidateQueries({ queryKey: ["me"] }); // -> me 무효화
      } catch (e) {
        console.log(e);
      }
    });
  };
  return (
    <section className="bg-white mx-4 px-4 py-[14px] rounded-[10px] flex flex-col gap-[14px] typo-r14 ">
      <h2 className="typo-b12">설정</h2>
      <div className="flex gap-4 items-center" onClick={sendLocation}>
        <Image src={gpsIcon} alt="위치설정" />
        <p>내 지역 설정</p>
      </div>
      <SettingNotificationBtn />
    </section>
  );
}
