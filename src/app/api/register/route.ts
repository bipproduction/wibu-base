import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function POST(req: Request) {
  const data: Prisma.UserGetPayload<{
    select: {
      name: true;
      email: true;
      password: true;
    };
  }> = await req.json();

  if (!data.name || !data.email || !data.password) {
    return new Response(JSON.stringify({ error: "Missing data" }), {
      status: 500
    });
  }

  // find user
  const user = await prisma.user.findUnique({
    where: {
      email: data.email
    }
  });

  if (user) {
    return new Response(JSON.stringify({ error: "User already exists" }), {
      status: 500
    });
  }

  const create = await prisma.user.create({
    data: {
      name: data.name,
      email: data.email,
      password: data.password
    }
  });

  return new Response(JSON.stringify({ data: create }));
}
