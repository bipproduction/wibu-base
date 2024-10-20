import { useShallowEffect } from "@mantine/hooks";
import { useState } from "react";
import { urlB64ToUint8Array } from "./urlB64ToUint8Array";
import { saveEndpointToIndexedDB } from "./saveEndpointToIndexedDB";
import { stateNotif } from "../state/stateNotif";
import { useHookstate } from "@hookstate/core";
import { devLog } from "../devLog";

const printLog = devLog(true);
export function usePushNotifications(publicKey: string) {
  const [subscription, setSubscription] = useState<PushSubscription | null>(
    null
  );
  const { set: setNotif } = useHookstate(stateNotif);

  useShallowEffect(() => {
    const registerServiceWorker = async () => {
      try {
        const registration = await navigator.serviceWorker.register(
          "/wibu_worker.js",
          {
            scope: "/",
            updateViaCache: "none"
          }
        );
        if (!registration) {
          printLog("failed to register service worker");
          return;
        }

        let sub = await registration.pushManager.getSubscription();

        if (!sub) {
          sub = await registration.pushManager.subscribe({
            userVisibleOnly: true,
            applicationServerKey: urlB64ToUint8Array(publicKey)
          });
        }

        const res = await fetch("/api/set-subscribe", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ data: sub.toJSON() })
        });

        if (res.ok) {
          printLog("Push notifications subscribed");
          setSubscription(sub);
          // Simpan ke IndexedDB
          return saveEndpointToIndexedDB(sub.endpoint);
        }

        printLog(`failed to subscribe ${res.statusText}`);
      } catch (error) {
        console.error("Service Worker registration failed:", error);
      }
    };

    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      return console.log("Push notifications not supported");
    }

    // Tangani pesan dari service worker
    navigator.serviceWorker.addEventListener("message", (event) => {
      if (event.data && event.data.type === "PUSH_RECEIVED") {
        setNotif(JSON.stringify(event.data));
      }
    });

    const tm = setTimeout(() => {
      registerServiceWorker();
    }, 500);

    return () => clearTimeout(tm);
  }, []);

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
