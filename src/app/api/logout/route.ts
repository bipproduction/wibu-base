import { EnvServer } from "@/lib/server/EnvServer";
import { sessionDelete } from "wibu";

EnvServer.init(process.env as any);
export async function POST(req: Request) {
   sessionDelete({
        sessionKey: EnvServer.env.NEXT_PUBLIC_WA_SERVER_SESSION_KEY
    });
    
    return new Response("ok");
}