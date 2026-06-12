import { BrevoClient } from "@getbrevo/brevo";
import { BREVO_API_KEY } from "../config/env.js";

const client = new BrevoClient({ apiKey: BREVO_API_KEY });

export const sendEmail = async ({ to, subject, html }) => {
  try {
    await client.transactionalEmails.sendTransacEmail({
      sender: {
        email: "ousseynousow180@gmail.com",
        name: "Per Ankh",
      },
      to: [{ email: to }],
      subject,
      htmlContent: html,
    });
  } catch (error) {
    console.error("Email error:", error);
    throw error;
  }
};