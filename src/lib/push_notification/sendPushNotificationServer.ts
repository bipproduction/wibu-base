
/* eslint-disable @typescript-eslint/no-explicit-any */

import webpush from "web-push";
import prisma from "../prisma";
import { PushNotificationDataSend } from "@/types/PushNotificationDataSend";

export async function sendPushNotification({
  data,
  vapidPublicKey,
  vapidPrivateKey
}: {
  data: PushNotificationDataSend;
  vapidPublicKey: string;
  vapidPrivateKey: string;
}) {
  // Set VAPID details
  webpush.setVapidDetails(
    "mailto:bip.production.js@gmail.com",
    vapidPublicKey,
    vapidPrivateKey
  );

  const listDataNotif: any[] = []; // Pindahkan di dalam function

  try {
    // Fetch all subscriptions
    const subscriptions = await prisma.subscription.findMany();

    if (!subscriptions || subscriptions.length === 0) {
      console.error("No subscriptions available to send notification");
      return { error: "No subscriptions found", status: 400 };
    }

    // Process notifications in parallel
    const notificationPromises = subscriptions.map(async (sub) => {
      const notificationPayload = JSON.stringify({
        title: data.title ?? "Test Notification",
        body: data.body ?? "This is a test notification",
        endpoint: data.endpoint,
        link: data.link,
        variant: data.variant,
        createdAt: new Date()
      });

      try {
        const subscriptionData = sub.data as any;
        await webpush.sendNotification(subscriptionData, notificationPayload);

        listDataNotif.push({
          success: true,
          notificationPayload,
          status: "success"
        });
      } catch (error: any) {
        console.error(
          `Error sending push notification to subscription ${sub.id}:`,
          error
        );
        listDataNotif.push({
          success: false,
          notificationPayload,
          status: "failure",
          error: error.message || error
        });
      }
    });

    await Promise.all(notificationPromises);

    return {
      success: true,
      message: "Notifications sent",
      data: listDataNotif
    };
  } catch (error: any) {
    console.error("Error during notification process:", error);
    return {
      success: false,
      message: "Failed to process notifications",
      error: error.message || error
    };
  }
}
