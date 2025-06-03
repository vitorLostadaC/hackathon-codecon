/// <reference types="vite/types/importMeta.d.ts" />

import { z } from "zod";

const envSchema = z.object({
  VITE_OPENAI_API_KEY: z.string(),
  VITE_API_URL: z.string(),
});

export const env = envSchema.parse(import.meta.env);
