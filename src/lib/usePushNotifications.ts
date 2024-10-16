import { useShallowEffect } from "@mantine/hooks";
import { useState } from "react";
import { urlB64ToUint8Array } from "./urlB64ToUint8Array";
import { saveEndpointToIndexedDB } from "./saveEndpointToIndexedDB";

function printLog(log: boolean = true, text: string) {
  if (log) console.log("==>", text);
}
export function usePushNotifications(publicKey: string, log: boolean = true) {
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );

  useShallowEffect(() => {
    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register(
          "/wibu_worker.js",
          {
            scope: "/",
            updateViaCache: "none",
          }
        );
        if (!registration) {
          printLog(log, "failed to register service worker");
          return;
        }
  
        let sub = await registration.pushManager.getSubscription();
  
        if (!sub) {
          sub = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlB64ToUint8Array(publicKey),
          });
        }
  
        const res = await fetch("/api/set-subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: sub.toJSON() }),
        });
  
        if (res.ok) {
          printLog(log, "Push notifications subscribed");
          setSubscription(sub);
          // Simpan ke IndexedDB
          return saveEndpointToIndexedDB(sub.endpoint);
        }
  
        printLog(log, `failed to subscribe ${res.statusText}`);
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
    };
  
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      return console.log("Push notifications not supported");
    }
  
    registerServiceWorker();
  }, []);

  // const registerServiceWorker = async () => {
  //   try {
  //     const registration = await navigator.serviceWorker.register(
  //       "/wibu_worker.js",
  //       {
  //         scope: "/",
  //         updateViaCache: "none"
  //       }
  //     );

  //     if (!registration) {
  //       printLog(log, "failed to register service worker");
  //       return;
  //     }

  //     let sub: PushSubscription | null =
  //       await registration.pushManager.getSubscription();

  //     if (!sub) {
  //       sub = await registration.pushManager.subscribe({
  //         userVisibleOnly: true,
  //         applicationServerKey: urlB64ToUint8Array(publicKey)
  //       });
  //     }

  //     const res = await fetch("/api/set-subscribe", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       body: JSON.stringify({ data: sub.toJSON() })
  //     });

  //     if (res.ok) {
  //       printLog(log, "Push notifications subscribed");
  //       setSubscription(sub);
  //       // simpan ke local storage
  //       return saveEndpointToIndexedDB(sub.endpoint);
  //     }

  //     printLog(log, `failed to subscribe ${res.statusText}`);
  //   } catch (error) {
  //     console.error("Service Worker registration failed:", error);
  //   }
  // };

  const unsubscribeFromPush = async () => {
    if (subscription) {
      await subscription.unsubscribe();
      setSubscription(null);
      await fetch("/api/unsubscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: subscription.toJSON() })
      });
    }
  };

  return {
    subscription,
    unsubscribeFromPush
  };
}
