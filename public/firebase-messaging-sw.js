importScripts(
  "https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyDl0uPWyB9_9m9nN4g3GK-e0nfBHVK4Vrk",
  authDomain: "splitty-9deb5.firebaseapp.com",
  projectId: "splitty-9deb5",
  messagingSenderId: "905792801670",
  appId: "1:905792801670:web:cb4173dba3db73476eba07",
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log("[firebase-messaging-sw.js] 백그라운드 메시지 수신:", payload);

  const notificationTitle = payload.notification?.title || "새 알림";
  const notificationOptions = {
    body: payload.notification?.body || "새 알림을 확인해보세요!",
    icon: "/logoIcons/icon512_rounded.png",
    data: payload.data,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const urlToOpen = event.notification.data?.redirectUrl || "/";
  event.waitUntil(clients.openWindow(urlToOpen));
});

onMessage(messaging, (payload) => {
  console.log("포어그라운드", payload);

  new Notification(payload.notification?.title || "새 알림", {
    body: payload.notification?.body,
    icon: "/logoIcons/icon512_rounded.png",
  });
});
