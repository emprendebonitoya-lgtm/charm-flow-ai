import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const MessageSchema = z.object({
  role: z.enum(["system", "user", "assistant"]),
  content: z.union([
    z.string(),
    z.array(
      z.union([
        z.object({ type: z.literal("text"), text: z.string() }),
        z.object({
          type: z.literal("image_url"),
          image_url: z.object({ url: z.string() }),
        }),
      ]),
    ),
  ]),
});

const InputSchema = z.object({
  messages: z.array(MessageSchema).min(1),
  model: z.string().default("google/gemini-2.5-flash"),
  temperature: z.number().min(0).max(2).optional(),
});

export const chatCompletion = createServerFn({ method: "POST" })
  .inputValidator((data) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) throw new Error("LOVABLE_API_KEY not configured");

    const res = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: data.model,
        messages: data.messages,
        temperature: data.temperature ?? 0.9,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`AI Gateway ${res.status}: ${text.slice(0, 200)}`);
    }
    const json = (await res.json()) as {
      choices: { message: { content: string } }[];
    };
    return { content: json.choices?.[0]?.message?.content ?? "" };
  });
