import { config } from "dotenv";

config({ path: "./.env" });

export const {
  JWT_SECRET,
  DATABASE_URL,
  PORT,
  BREVO_API_KEY,
  FRONTEND_URL,
  NODE_ENV,
  JWT_REFRESH_SECRET,
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = process.env;
