import { apies, pages } from "@/lib/routes";
import { WibuConfig } from "@/types/WibuConfig";

export const wibuConfig: WibuConfig = {
  variant: "dev",
  publicRoutes: [
    pages["/"],
    pages["/login"],
    pages["/register"],
    apies["/api/register"],
    apies["/api/login"],
    apies["/api/set-subscribe"],
    apies["/api/send-notification"],
    "/wibu_worker.js",
    "/icon-192x192.png",
    "/icon-512x512.png"
  ],
  matcher: ["/((?!_next|static|favicon.ico|manifest).*)"]
};
