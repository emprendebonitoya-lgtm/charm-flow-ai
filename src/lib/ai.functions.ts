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

type Input = z.infer<typeof InputSchema>;

function stringifyMessageContent(content: z.infer<typeof MessageSchema>['content']) {
  if (typeof content === "string") return content;
  return content
    .map((item) => {
      if (typeof item === "string") return item;
      if (item.type === "text") return item.text;
      if (item.type === "image_url") return item.image_url.url;
      return "";
    })
    .join(" ");
}

function extractPromptText(messages: Input["messages"]) {
  return messages
    .map((message) => {
      if (message.role === "assistant") return "";
      return stringifyMessageContent(message.content);
    })
    .filter(Boolean)
    .join(" \n");
}

function parseCount(text: string, fallback = 5) {
  const match = text.match(/array JSON (?:with|con) (\d+)/i)
    || text.match(/(\d+) aperturas/i)
    || text.match(/(\d+) respuestas/i);
  return match ? Number(match[1]) : fallback;
}

function createMockResponse(data: Input) {
  const systemText = stringifyMessageContent(data.messages.find((m) => m.role === "system")?.content ?? "");
  const userText = extractPromptText(data.messages.filter((m) => m.role === "user"));
  const count = parseCount(systemText + " " + userText, 5);
  const isRescue = /rescate|rescat[eé]|2 respuestas|respuestas/i.test(systemText + " " + userText);
  const isScan = /coach de carisma|abridores|aperturas|escáner|perfil/i.test(systemText + " " + userText);

  const rescueOptions = [
    "Ok, no le des más vueltas al silencio. Mandale: ‘Te dejé esto en caso de que quieras seguir con buena onda 😎’.",
    "Si querés recuperar la conversación, probá: ‘A veces el silencio dice más de lo que parece. ¿Qué tal si arrancamos con algo divertido?’",
    "Algo directo y seguro: ‘Si querés, te paso una idea para que la próxima entrada sea ganadora.’",
    "Mostrá confianza suave: ‘Hola, no te molesto demasiado, solo quería ver si te copa seguir con algo más interesante.’",
    "Mantenelo ligero: ‘Veo que la última quedó en pausa. ¿Seguimos con un plan rápido y efectivo?’",
  ];

  const scanOpenings = [
    "Hola, me llama la atención tu estilo. ¿Cuál fue el mejor plan que hiciste este mes?",
    "Tu perfil tiene buena onda. Si tuviera que elegir una entrada, arranco con: ‘¿Sos más de charla intensa o humor tranqui?’",
    "Me gustó tu vibra. Podés empezar con: ‘Si te diera tres opciones para salir, ¿cuál elegirías?’",
    "Se nota que tenés mucha onda. Abrí con: ‘Buen perfil, me gustaría saber qué te motiva de verdad.’",
    "Tu foto transmite confianza. Podés decir: ‘Tienes un estilo interesante. Contame qué búsqueda estás disfrutando más ahora.’",
    "Arranca con algo simple y directo: ‘Vi tu perfil y pensé: con vos la conversación puede ser distinta. ¿Qué buscás?’",
    "Tu bio sugiere que te gusta lo auténtico. Podés escribir: ‘Quedé con ganas de conocer la historia detrás de tu mejor foto.’",
    "Si querés algo más picante: ‘Muy buen perfil. ¿Cuál fue la última cosa que te hizo reír de verdad?’",
    "Línea segura: ‘No suelo escribir así, pero tu perfil merecía un mensaje diferente. ¿Te copa la buena onda?’",
    "Un gancho directo: ‘Me quedó dando vueltas tu bio. ¿Qué preferís: una cita relajada o algo con más energía?’",
  ];

  return JSON.stringify(
    Array.from({ length: count }, (_, index) => {
      if (isRescue) {
        return rescueOptions[index % rescueOptions.length];
      }

      if (isScan) {
        return scanOpenings[index % scanOpenings.length];
      }

      const generic = [
        "Esto es un respaldo para que la app siga funcionando sin conexión a Lovable.",
        "Usá este resultado como ejemplo hasta que tengas la API de Lovable activa.",
        "Si querés, podés reemplazar esto por respuestas generadas en vivo cuando el backend esté conectado.",
      ];
      return generic[index % generic.length];
    }),
  );
}

export const chatCompletion = createServerFn({ method: "POST" })
  .validator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const apiKey = process.env.LOVABLE_API_KEY;
    if (!apiKey) {
      return { content: createMockResponse(data), mock: true as const };
    }

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
    return { content: json.choices?.[0]?.message?.content ?? "", mock: false as const };
  });
