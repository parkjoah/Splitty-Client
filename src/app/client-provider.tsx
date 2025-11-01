"use client";

import { useEffect } from "react";
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "@/lib/firebase-config";
import { apiFetch } from "@/app/api";

export default function ClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  useEffect(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/firebase-messaging-sw.js")
        .then(() => requestPermission())
        .catch((e) => console.error(">>> SW 등록 실패:", e));
    }

    let unsubscribe = () => {};
    if (messaging) {
      unsubscribe = onMessage(messaging, (payload) => {
        console.log("새 FCM 메시지:", payload);

        const title = payload.notification?.title || "새 알림";
        const body = payload.notification?.body || "";
        const icon = "/logoIcons/icon512_rounded.png";
        const data = payload.data;

        if (Notification.permission === "granted") {
          new Notification(title, {
            body,
            icon,
            data,
          });
        } else {
          console.warn("알림 권한이 거부됨");
        }
      });
    }

    return () => unsubscribe();
  }, []);

  const requestPermission = async () => {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return console.warn("알림 권한 거부됨");

    if (!messaging) {
      console.warn("FCM messaging not initialized");
      return;
    }

    try {
      const token = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
      });
      console.log(" FCM 토큰:", token);

      await apiFetch("/member/me/fcm-token", {
        method: "PATCH",
        body: JSON.stringify({ token }),
      });
      console.log("FCM 토큰 서버 전송 성공");
    } catch (err) {
      console.error("FCM 토큰 전송 실패:", err);
    }
  };

  return <>{children}</>;
}
