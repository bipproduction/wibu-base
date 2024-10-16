"use client";
import { usePushNotifications } from "@/lib/usePushNotifications";
import { Button, Group, Stack } from "@mantine/core";
import { usePWAInstall } from "../usePWAInstall";

export function NotificationManager({ publicKey }: { publicKey: string }) {
  const { subscription } = usePushNotifications(publicKey);
  const { deferredPrompt, isAppInstalled, handleInstallClick } =
    usePWAInstall();
  // const [message, setMessage] = useState("halo apa kabar");

  const sendTestNotification = async () => {
    if (!subscription) return console.error("No subscription available");

    try {
      const res = await fetch("/api/send-notification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data: { title: "test title", body: "ini adalah test" } })
      });

      if (!res.ok) {
        console.error("Failed to send notification:", res.statusText);
      }
    } catch (error) {
      console.error("Notification error:", error);
    }
  };

  return (
    <Stack p={"md"}>
      <Group>
        <Stack>
          <Button onClick={sendTestNotification}>kirim</Button>
          <Button onClick={handleInstallClick}>install</Button>
        </Stack>
      </Group>
    </Stack>
  );
}
