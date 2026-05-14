import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) return new Response("Missing webhook secret", { status: 400 });

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature)
    return new Response("Missing svix headers", { status: 400 });

  const payload = await req.json();
  const body = JSON.stringify(payload);
  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch {
    return new Response("Invalid webhook signature", { status: 400 });
  }

  if (evt.type === "user.created") {
    const { id, email_addresses, username, image_url } = evt.data;
    const email = email_addresses[0]?.email_address;
    await prisma.user.create({
      data: { clerkId: id, email, username: username ?? email.split("@")[0], imageUrl: image_url },
    });
  }

  if (evt.type === "user.updated") {
    const { id, email_addresses, username, image_url } = evt.data;
    const email = email_addresses[0]?.email_address;
    await prisma.user.update({
      where: { clerkId: id },
      data: { email, username: username ?? email.split("@")[0], imageUrl: image_url },
    });
  }

  if (evt.type === "user.deleted") {
    await prisma.user.delete({ where: { clerkId: evt.data.id as string } });
  }

  return new Response("OK", { status: 200 });
}
