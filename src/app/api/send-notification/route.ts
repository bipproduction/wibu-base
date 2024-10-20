/* eslint-disable @typescript-eslint/no-explicit-any */
import { EnvServer } from "@/lib/server/EnvServer";
import { PushNotificationDataSend } from "@/types/PushNotificationDataSend";
import { Push } from "wibu";

EnvServer.init(process.env as any);

export async function POST(req: Request) {
  const json = await req.json();
  const data: PushNotificationDataSend | null = json.data;

  if (!data) {
    return new Response(
      JSON.stringify({ error: "Invalid subscription data" }),
      { status: 400 }
    );
  }

  // const sendNotif = await sendPushNotification({
  //   data: {
  //     body: data.body,
  //     title: data.title,
  //     variant: data.variant,
  //     link: data.link,
  //     endpoint: data.endpoint
  //   },
  //   vapidPrivateKey: EnvServer.env.VAPID_PRIVATE_KEY!,
  //   vapidPublicKey: EnvServer.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
  // });

  const sendNotif = await Push.pushNotificationSendFromServer({
    data: data,
    WIBU_PUSH_DB_TOKEN: EnvServer.env.WIBU_PUSH_DB_TOKEN,
    vapidPrivateKey: EnvServer.env.VAPID_PRIVATE_KEY!,
    vapidPublicKey: EnvServer.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!
  });

  if (!sendNotif.success)
    return new Response(JSON.stringify({ error: sendNotif.error }), {
      status: 500
    });

  return new Response(JSON.stringify({ data: sendNotif }));
}
