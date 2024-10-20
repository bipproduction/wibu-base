"use client";

import { Button, Group, Stack } from "@mantine/core";
import { usePWAInstall } from "../usePWAInstall";
import { stateNotif } from "../state/stateNotif";
import { useHookstate } from "@hookstate/core";
import { WibuConfigVariant } from "@/types/WibuConfigVariant";
import { usePushNotifications } from "./usePushNotifications";
import { sendPushNotificationClient } from "./sendPushNotificationClient";

export function NotificationManager({
  variant,
  publicKey
}: {
  variant: WibuConfigVariant;
  publicKey: string;
}) {
  const { subscription } = usePushNotifications(publicKey);
  const { handleInstallClick } = usePWAInstall();
  const { value: notif } = useHookstate(stateNotif);

  const sendTestNotification = async () => {
    if (!subscription) return console.error("No subscription available");
    const notif = await sendPushNotificationClient({
      data: {
        title: "test title",
        body: "ini adalah test",
        variant: "notification",
        link: "https://www.google.com",
        endpoint:subscription.endpoint
      }
    });

    if (!notif.success) return alert(notif.message);
   
  };

  if (variant === "test") return null;

  return (
    <Stack p={"md"}>
      {notif}
      <Group>
        <Stack>
          <Button onClick={sendTestNotification}>kirim</Button>
          <Button onClick={handleInstallClick}>install</Button>
        </Stack>
      </Group>
    </Stack>
  );
}
