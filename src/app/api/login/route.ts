/* eslint-disable @typescript-eslint/no-explicit-any */
import { sessionCreate } from "@/lib/auth/session_create";
import prisma from "@/lib/prisma";
import { EnvServer } from "@/lib/server/EnvServer";


EnvServer.init(process.env as any);
export async function POST(req: Request) {
  const { data } = await req.json();

  if (!data.email || !data.password) {
    return new Response(
      JSON.stringify({ error: "Missing email or password" }),
      { status: 500 }
    );
  }

  const user = await prisma.user.findUnique({
    where: {
      email: data.email
    }
  });

  if (!user) {
    return new Response(JSON.stringify({ error: "User not found" }), {
      status: 500
    });
  }

  if (user.password !== data.password) {
    return new Response(JSON.stringify({ error: "Wrong password" }), {
      status: 500
    });
  }

  const token = await sessionCreate({
    user: {
      id: user.id,
      name: user.name
    },
    encodedKey: EnvServer.env.NEXT_PUBLIC_BASE_TOKEN_KEY,
    sessionKey: EnvServer.env.NEXT_PUBLIC_BASE_SESSION_KEY
  });

  if (!token) {
    return new Response(JSON.stringify({ error: "Failed to create session" }), {
      status: 500
    });
  }

  const userToken = await prisma.userToken.create({
    data: {
      userId: user.id,
      token
    }
  });

  if (!userToken) {
    return new Response(JSON.stringify({ error: "Failed to create token" }), {
      status: 500
    });
  }

  return Response.json({ success: true, token });
}
