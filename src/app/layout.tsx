// Import styles of packages that you've installed.
// All packages except `@mantine/hooks` require styles imports
import "@mantine/core/styles.css";

import { ColorSchemeScript, MantineProvider } from "@mantine/core";
import { EnvClientProvider } from "@/lib/client/EnvClient";

export const metadata = {
  title: "Wibu Base",
  description: "Base Wibu Project"
};

const env = process.env;

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
          <EnvClientProvider env={JSON.stringify(env)} />
          {children}
        </MantineProvider>
      </body>
    </html>
  );
}
