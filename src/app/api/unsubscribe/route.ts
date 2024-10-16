import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const json = await req.json();
  const data: PushSubscription = json.data;
  const del = await prisma.subscription.delete({
    where: {
      id: data.endpoint
    }
  });
  return new Response(JSON.stringify({ data: del }));
}
