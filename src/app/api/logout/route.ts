/* eslint-disable @typescript-eslint/no-explicit-any */
import { EnvServer } from "@/lib/server/EnvServer";
import { sessionDelete } from "@/lib/session_delete";
EnvServer.init(process.env as any);
export async function POST() {
  sessionDelete({
    sessionKey: EnvServer.env.NEXT_PUBLIC_BASE_SESSION_KEY
  });

  return new Response("ok");
}
