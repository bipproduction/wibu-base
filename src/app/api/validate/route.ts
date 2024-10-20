/* eslint-disable @typescript-eslint/no-explicit-any */
// generate by wibu
import { decrypt } from "@/lib/auth/decrypt";
import prisma from "@/lib/prisma";
import { EnvServer } from "@/lib/server/EnvServer";

EnvServer.init(process.env as any);
export async function GET(req: Request) {
  return apiValidate({
    req,
    encodedKey: EnvServer.env.NEXT_PUBLIC_BASE_TOKEN_KEY
  });
}

async function apiValidate({
  req,
  encodedKey
}: {
  req: Request;
  encodedKey: string;
}) {
  const token = req.headers.get("authorization")?.split(" ")[1];
  if (!token) {
    return new Response(JSON.stringify({ error: "Missing token" }), {
      status: 401
    });
  }
  const dec = await decrypt({
    token,
    encodedKey
  });

  if (!dec) {
    return new Response(JSON.stringify({ error: "Invalid token" }), {
      status: 401
    });
  }
  const user = await prisma.user.findUnique({
    where: {
      id: dec.id
    }
  });

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 500
    });
  }

  return new Response("ok");
}
