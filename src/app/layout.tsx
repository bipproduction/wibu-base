/* eslint-disable @typescript-eslint/no-explicit-any */
// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";

import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { EnvClientProvider } from "@/lib/client/EnvClient";
import { NotificationManager } from "@/lib/notification/NotificationManager";
import { EnvServer } from "@/lib/server/EnvServer";

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
        <MantineProvider defaultColorScheme="dark">
          <NotificationManager
            publicKey={EnvServer.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY}
          />
          <EnvClientProvider env={JSON.stringify(env)} />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
