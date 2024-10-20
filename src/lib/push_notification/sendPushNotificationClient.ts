
import { apies } from "../routes";
import { devLog } from "../devLog";
import { PushNotificationDataSend } from "@/types/PushNotificationDataSend";

export async function sendPushNotificationClient({
  data,
  log = false
}: {
  data: PushNotificationDataSend;
  log?: boolean;
}) {
  const printLog = devLog(log);
  try {
    printLog("Sending push notification");
    const res = await fetch(apies["/api/send-notification"], {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        data
      })
    });

    if (!res.ok) {
      printLog("Failed to send push notification");
      return {
        success: false,
        message: "Failed to send notification:"
      };
    }

    printLog("Push notification sent");
    const json = await res.json();
    return json.data;
  } catch (error) {
    console.error("Notification error:", error);
    return {
      success: false,
      message: "Failed to process notifications",
      error
    };
  }
}
