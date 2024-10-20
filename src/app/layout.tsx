/* eslint-disable @typescript-eslint/no-explicit-any */
// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";

import { EnvClientProvider } from "@/lib/client/EnvClient";
import { EnvServer } from "@/lib/server/EnvServer";
import { ColorSchemeScript, MantineProvider } from "@mantine/core";
// import { PushNotificationProvider } from "@/lib/push_notification/PushNotificationProvider";
import { apies } from "@/lib/routes";
import { Push } from "wibu";

export const metadata = {
  title: "Wibu Base",
  description: "Base Wibu Project"
};

const env = process.env;
EnvServer.init(env as any);

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <ColorSchemeScript defaultColorScheme="dark" />
      </head>
      <body suppressHydrationWarning>
        <EnvClientProvider env={JSON.stringify(env)} />
        <Push.PushNotificationProvider
          log
          pushNotificationSubscribeEndpoint={apies["/api/set-subscribe"]}
          pushNotificationSendEndpoint={apies["/api/send-notification"]}
          vapidPublicKey={EnvServer.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY}
          wibuWorker="/wibu_worker.js"
        />
        {/* <PushNotificationProvider
          log
          pushNotificationSubscribeEndpoint={apies["/api/set-subscribe"]}
          pushNotificationSendEndpoint={apies["/api/send-notification"]}
          vapidPublicKey={EnvServer.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY}
          wibuWorker="/wibu_worker.js"
        /> */}
        <MantineProvider defaultColorScheme="dark">{children}</MantineProvider>
      </body>
    </html>
  );
}
