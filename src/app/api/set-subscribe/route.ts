/* eslint-disable @typescript-eslint/no-explicit-any */
import webpush from "web-push";
import prisma from "@/lib/prisma";
import { EnvServer } from "@/lib/server/EnvServer";


EnvServer.init(process.env as any);
webpush.setVapidDetails(
  "mailto:bip.production.js@gmail.com",
  EnvServer.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  EnvServer.env.VAPID_PRIVATE_KEY!
);

export async function POST(req: Request) {
  const json = await req.json();
  const data: PushSubscription = json.data;
  if (!data || !data.endpoint) {
    console.error("Invalid subscription object");
    return new Response(
      JSON.stringify({ error: "Invalid subscription object" }),
      { status: 400 }
    );
  }

  const create = await prisma.subscription.upsert({
    create: {
      id: data.endpoint,
      data: data as any
    },
    update: {
      data: data as any
    },
    where: {
      id: data.endpoint
    }
  });

  return new Response(JSON.stringify({ data: create, success: true }));
}
