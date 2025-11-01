"use client";
import { useEffect, useRef, useState } from "react";
import { Client } from "@stomp/stompjs";

import { ChatMessage, ChatUser } from "@/types/chat";
import Image from "next/image";
import sendIcon from "@/assets/icons/sendChatIcon.svg";
import samplePrf from "@/assets/icons/samplePrf.svg";
import ChatTopSection from "./chat-top-section";
import { useCursorChatMsg } from "@/hooks/useCursorChatMsg";

export default function Chat({ goodsId }: { goodsId: number }) {
  const [users, setUsers] = useState<ChatUser[]>([]);
  const [input, setInput] = useState("");
  const [myId, setMyId] = useState<number | null>(null);
  const clientRef = useRef<Client | null>(null);
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const { data } = useCursorChatMsg(goodsId);
  const topObserverRef = useRef<HTMLDivElement | null>(null);

  //내id
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedId = localStorage.getItem("myId");
      if (storedId) setMyId(Number(storedId));
    }
  }, []);
  //유저
  useEffect(() => {
    if (data?.pages?.[0]?.users) setUsers(data.pages[0].users);
  }, [data]);

  // websocket 연결
  useEffect(() => {
    const client = new Client({
      brokerURL: "wss://splitty.store/ws-connect",

      // 자동 재연결
      reconnectDelay: 5000,

      // heartbeat 활성화 (서버가 연결을 끊지 않게)
      heartbeatIncoming: 10000, // 서버에서 오는 하트비트
      heartbeatOutgoing: 10000, // 서버로 하트비트 보내기

      // 인증 헤더 추가 (Bearer 토큰)
      connectHeaders: {
        Authorization: `Bearer ${localStorage.getItem("accessToken") ?? ""}`,
      },

      // 로그 보기 (디버깅용)
      debug: (str) => console.log(">>>", str),

      //연결 성공??
      onConnect: () => {
        client.subscribe(`/sub/goods.${goodsId}/chat`, (message) => {
          const body = JSON.parse(message.body);
          setMessages((prev) => [...prev, body]);
          scrollRef.current?.scrollTo({
            top: scrollRef.current.scrollHeight,
            behavior: "smooth",
          });
        });
      },

      // 에러 처리
      onStompError: (frame) => {
        console.error("STOMP error:", frame);
      },
    });

    // 실제 연결 시작
    client.activate();
    clientRef.current = client;

    // cleanup
    return () => {
      console.log("WebSocket disconnected");
      client.deactivate();
    };
  }, [goodsId]);

  // 메세지 전송
  const sendMessage = () => {
    if (!input.trim() || !clientRef.current?.connected) return;
    const payload = { message: input, type: "TEXT" as const };
    clientRef.current.publish({
      destination: `/pub/goods.${goodsId}/chat`,
      body: JSON.stringify(payload),
      headers: {
        Authorization: `Bearer ${localStorage.getItem("accessToken")}`,
      },
    });
    setInput("");
  };

  // 처음 => 맨 아래로 스크롤
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [data]);

  const historyMessages: ChatMessage[] = data?.pages
    ? [...data.pages]
        .reverse()

        .flatMap((p) => [...p.messages].reverse())
    : [];
  let allMessages: ChatMessage[] = [...historyMessages, ...messages];

  allMessages = allMessages.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
  return (
    <div className="relative h-screen bg-white">
      {/* 상단 고정 */}
      <div className="fixed top-0 left-0 w-full bg-white z-10 border-b border-gray-200">
        <ChatTopSection goodsId={goodsId} />
      </div>

      {/* 메시지 영역 */}
      <div
        className="overflow-y-auto px-4 pt-[65px] pb-[80px] h-full space-y-3 scrollbar-hide"
        ref={scrollRef}
      >
        <div ref={topObserverRef}></div>
        {allMessages.map((msg) => {
          const user = users.find((u) => u.id === msg.senderId);
          const isMine = user?.id === myId;
          const userPrfImg = user?.profileImageUrl || samplePrf;
          const msgKey = msg.id ?? msg.createdAt ?? Math.random();

          if (msg.type === "ENTER" || msg.type === "LEAVE")
            return (
              <div
                key={msgKey}
                className="text-[#8C8C8C] typo-r14 flex justify-center py-3"
              >
                {msg.message}
              </div>
            );

          return (
            <div
              key={msgKey}
              className={`flex ${
                isMine ? "justify-end" : "justify-start"
              } gap-2`}
            >
              {!isMine && (
                <div className="flex items-start ">
                  <Image
                    src={userPrfImg}
                    alt="profile"
                    width={30}
                    height={30}
                    className="w-8 h-8 rounded-full "
                  />
                </div>
              )}
              <div
                className={`text-[12px] text-[#8C8C8C] mt-1 flex items-end `}
              >
                {isMine &&
                  new Date(msg.createdAt).toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
              </div>

              <div className="flex flex-col">
                {!isMine && (
                  <div className="text-[#4F4F4F] typo-b12 mb-1">
                    {user?.username}
                  </div>
                )}
                <div
                  className={`px-3 py-2 text-sm ${
                    isMine
                      ? "bg-[#4F4DF8] text-white rounded-[10px]"
                      : "bg-[#F2F2F2] text-gray-900 rounded-[10px]"
                  }`}
                >
                  {msg.message}
                </div>
              </div>

              <div className={`text-[12px] text-[#8C8C8C] mt-1 items-end flex`}>
                {!isMine &&
                  new Date(msg.createdAt).toLocaleTimeString("ko-KR", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
              </div>
            </div>
          );
        })}
      </div>

      {/* 입력창*/}
      <div className="fixed bottom-0 left-0 w-full bg-white px-4 py-3  pb-5  flex items-center gap-2 border-t border-gray-200">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 rounded-[10px] px-4 py-3 typo-r16 focus:outline-none focus:ring focus:ring-gray-200 bg-[#F2F2F2]"
          placeholder="메세지 보내기"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="text-white text-sm rounded-full"
        >
          <Image src={sendIcon} alt="전송" width={30} height={30} />
        </button>
      </div>
    </div>
  );
}
