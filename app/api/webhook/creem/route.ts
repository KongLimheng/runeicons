import { Webhook } from "@creem_io/nextjs";

export const POST = Webhook({
  webhookSecret: process.env.CREEM_WEBHOOK_SECRET!,
  onGrantAccess: async ({ customer }) => {
    console.log("Grant access", customer.id);
  },
  onRevokeAccess: async ({ customer }) => {
    console.log("Revoke access", customer.id);
  },
});
