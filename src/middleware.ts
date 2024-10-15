/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest } from "next/server";
import { apies, pages } from "./lib/routes";
import { EnvServer } from "./lib/server/EnvServer";
import { wibuMiddleware } from "./lib/wibu_middleware";

EnvServer.init(process.env as any);
export const middleware = (req: NextRequest) =>
  wibuMiddleware(req as any, {
    publicRoutes: [
      pages["/"],
      pages["/login"],
      pages["/register"],
      apies["/api/register"],
      apies["/api/login"]
    ],
    encodedKey: EnvServer.env.NEXT_PUBLIC_BASE_TOKEN_KEY,
    sessionKey: EnvServer.env.NEXT_PUBLIC_BASE_SESSION_KEY,
    validationApiRoute: apies["/api/validate"],
    log: false
  });

export const config = {
  matcher: ["/((?!_next|static|favicon.ico).*)"]
};
