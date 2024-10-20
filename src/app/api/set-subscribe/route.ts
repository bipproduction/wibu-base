/* eslint-disable @typescript-eslint/no-explicit-any */
import { EnvServer } from "@/lib/server/EnvServer";
import { Push } from "wibu";

EnvServer.init(process.env as any);
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

  const create = await Push.pushNotificationSubscribeFromServer({
    endpoint: data.endpoint,
    data: data,
    WIBU_PUSH_DB_TOKEN: EnvServer.env.WIBU_PUSH_DB_TOKEN
  })

  return new Response(JSON.stringify({ data: create, success: true }));
}
