"use client";

import { getChatList } from "@/app/api/chat";
import ChatListItem from "@/components/chat-list-item";
import { chatListItem } from "@/types/chat";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const categories = ["판매", "구매"] as const;
const role = { 판매: "SELLER", 구매: "BUYER" } as const;

export default function ChatPage() {
  const [selectedCat, setSelectedCat] = useState<"판매" | "구매">("판매");

  const queryKey = ["chatList", role[selectedCat]];
  const queryFn = () => getChatList({ role: role[selectedCat] });
  const { data } = useQuery({ queryKey, queryFn });

  return (
    <div className="flex flex-col">
      <div className="fixed top-0 pt-[27px] w-full bg-white z-10">
        <div className="flex px-4 py-3 justify-between ">
          <div className="typo-b18 ">채팅</div>
        </div>
        <div className=" px-4 typo-r14 flex py-4 overflow-x-auto gap-2 whitespace-nowrap scroll-smooth [scrollbar-width:none] border-b border-[#F2F2F2]">
          {categories.map((cat, idx) => (
            <div
              className={`py-2 px-3 border-[1px] border-[#F2F2F2] rounded-[100px] cursor-pointer ${
                selectedCat === cat
                  ? "bg-[#000] text-white"
                  : "text-[#000] bg-white"
              }`}
              key={idx}
              onClick={() => setSelectedCat(cat)}
            >
              {cat}
            </div>
          ))}
        </div>
      </div>

      <div className="py-[125px] ">
        {data?.map((c: chatListItem) => (
          <ChatListItem
            chatListData={c}
            key={c.goodsId}
            // className={c.goodsId === sampleChatList.length ? "mb-14" : ""}
          />
        ))}
      </div>
    </div>
  );
}
