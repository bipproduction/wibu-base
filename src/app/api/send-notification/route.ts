/* eslint-disable @typescript-eslint/no-explicit-any */
import prisma from "@/lib/prisma";
import { EnvServer } from "@/lib/server/EnvServer";
import webpush from "web-push";

EnvServer.init(process.env as any);
// Set VAPID details for web-push
webpush.setVapidDetails(
  "mailto:bip.production.js@gmail.com",
  EnvServer.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY,
  EnvServer.env.VAPID_PRIVATE_KEY
);

export async function POST(req: Request) {

  const json = await req.json();
  const data: { title: string; body: string } | null = json.data;

  if (!data) {
    return new Response(
      JSON.stringify({ error: "Invalid subscription data" }),
      { status: 400 }
    );
  }

  try {
    // Fetch all subscriptions from your database
    const subscriptions = await prisma.subscription.findMany();

    if (!subscriptions || subscriptions.length === 0) {
      console.error("No subscriptions available to send notification");
      return new Response(JSON.stringify({ error: "No subscriptions found" }), {
        status: 400
      });
    }

    let successCount = 0;
    let failureCount = 0;

    // Loop through all subscriptions and send notifications
    for (const sub of subscriptions) {
      // Notification payload
      const notificationPayload = JSON.stringify({
        title: data.title || "Test Notification",
        body: data.body || "This is a test notification",
        icon: "/icon-192x192.png",
        badge: "/icon-192x192.png",
        image: "/icon-192x192.png",
        endpoint: sub.id,
        link: "https://localhost:3000?greet=apakabar"
      });

      try {
        const subscriptionData = sub.data as any;

        await webpush.sendNotification(subscriptionData, notificationPayload);
        // console.log(
        //   `Notification sent successfully to ${subscriptionData.endpoint}`
        // );
        successCount++;
      } catch (error: any) {
        console.error(
          `Error sending push notification to subscription ${sub.id}:`,
          error
        );
        failureCount++;
      }
    }

    // Return a success or failure response
    return new Response(
      JSON.stringify({
        message: `Notifications sent: ${successCount}, Failed: ${failureCount}`,
        success: failureCount === 0
      }),
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error during notification process:", error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message || "Failed to process notifications"
      }),
      { status: 500 }
    );
  }
}
