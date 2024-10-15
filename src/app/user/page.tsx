/* eslint-disable @typescript-eslint/no-explicit-any */
import { EnvServer } from "@/lib/server/EnvServer";
import { Flex, Stack, Text } from "@mantine/core";
import { cookies } from "next/headers";
import { LogoutButton } from "./_component/LogoutButton";

EnvServer.init(process.env as any);
const sessionKey = EnvServer.env.NEXT_PUBLIC_BASE_SESSION_KEY;

export default function Page() {
  const cookiesData = cookies();
  const token = cookiesData.get(sessionKey)?.value;
  return (
    <Stack p={"md"}>
      <Flex justify={"space-between"}>
        <Text>user</Text>
        <LogoutButton token={token!} />
      </Flex>
      <Text style={{
        wordBreak:"break-word"
      }}>{token}</Text>
    </Stack>
  );
}
