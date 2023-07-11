// ! This does not work idk why EVERYTHING seems to be correct, but it does not work. FIX IN THE FUTURE

import type { WebhookEvent } from "@clerk/nextjs/api";
import { Webhook } from "svix";
import { headers } from "next/headers";
import { env } from "@/env.mjs";

const webhookSecret = env.WEBHOOK_SECRET;

async function handler(req: Request) {
  const payload = await req.json();
  const payloadString = JSON.stringify(payload);
  const headerPayload = headers();
  const svixId = headerPayload.get("svix-id");
  const svixIdTimeStamp = headerPayload.get("svix-timestamp");
  const svixSignature = headerPayload.get("svix-signature");
  if (!svixId || !svixIdTimeStamp || !svixSignature) {
    console.log("svixId", svixId);
    console.log("svixIdTimeStamp", svixIdTimeStamp);
    console.log("svixSignature", svixSignature);
    return new Response("Error occured", {
      status: 400,
    });
  }
  const svixHeaders = {
    "svix-id": svixId,
    "svix-timestamp": svixIdTimeStamp,
    "svix-signature": svixSignature,
  };
  const wh = new Webhook(webhookSecret);
  let evt: WebhookEvent | null = null;

  try {
    evt = wh.verify(payloadString, svixHeaders) as WebhookEvent;
  } catch (_) {
    console.log("error");
    return new Response("Error occured", {
      status: 400,
    });
  }

  const { id } = evt.data;
  // Handle the webhook
  const evtType = evt.type;
  if (evtType === "user.created" || evtType === "user.updated") {
    const { email_addresses, primary_email_address_id } = evt.data;
    const emailObject = email_addresses?.find((email) => {
      return email.id === primary_email_address_id;
    });
    if (!emailObject) {
      return new Response("Error locating user", {
        status: 400,
      });
    }
  }
  console.log(`User ${id} was ${evtType}`);
  return new Response("", {
    status: 201,
  });
}

export const GET = handler;
export const POST = handler;
export const PUT = handler;
