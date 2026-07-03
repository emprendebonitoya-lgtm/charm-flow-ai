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

const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 20;
const rateLimitBucket = new Map<string, { count: number; resetAt: number }>();

function getClientKey(context: unknown) {
  const ctx = context as { request?: Request } | undefined;
  const request = ctx?.request;
  if (request) {
    const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
    const ua = request.headers.get("user-agent")?.slice(0, 80);
    return `${ip ?? "unknown"}:${ua ?? "na"}`;
  }
  return "anonymous";
}

function enforceRateLimit(key: string) {
  const now = Date.now();
  const previous = rateLimitBucket.get(key);
  if (!previous || previous.resetAt <= now) {
    rateLimitBucket.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return;
  }

  if (previous.count >= RATE_LIMIT_MAX_REQUESTS) {
    throw new Error("Límite temporal alcanzado. Intentá nuevamente en unos segundos.");
  }

  previous.count += 1;
  rateLimitBucket.set(key, previous);
}

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

function lastUserMessage(messages: Input["messages"]) {
  const users = messages.filter((m) => m.role === "user");
  const last = users[users.length - 1];
  if (!last) return "";
  return stringifyMessageContent(last.content);
}

function extractPersonaReply(systemText: string, userText: string) {
  const lower = systemText.toLowerCase();
  const user = userText.trim();

  if (lower.includes("sos valentina")) {
    return `jaja, ${user ? `eso que dijiste de "${user.slice(0, 40)}"` : "esa energía"} me dio curiosidad. ¿Qué plan tranqui propondrías?`;
  }
  if (lower.includes("sos mía") || lower.includes("sos mia")) {
    return `jajaja me caés bien. Si mantenés ese ritmo, te digo: ¿plan con música o algo más improvisado esta noche?`;
  }
  if (lower.includes("sos lucía") || lower.includes("sos lucia")) {
    return `Interesante. Si vas en serio, decime una idea que te haya cambiado la forma de ver relaciones.`;
  }
  if (lower.includes("sos camila")) {
    return `Ok, te leo seguro. ¿Qué tenés de diferente además de hablar bien? Convenceme en una línea.`;
  }

  return null;
}

function createMockResponse(data: Input) {
  const systemText = stringifyMessageContent(data.messages.find((m) => m.role === "system")?.content ?? "");
  const userText = extractPromptText(data.messages.filter((m) => m.role === "user"));
  const combined = `${systemText} ${userText}`.toLowerCase();
  const count = parseCount(systemText + " " + userText, 5);
  const latestUser = lastUserMessage(data.messages);
  const isRescue = /rescate|rescat[eé]|2 respuestas|chat enfriado/.test(combined);
  const isScan = /coach de carisma|abridores|aperturas|escáner|escaner|perfil/.test(combined);
  const isDatePlanner = /planificador de citas|fases son|apertura|conexi[oó]n|cierre|3 fases/.test(combined);
  const isFeedbackJson = /devolv[eé]\s+exactamente\s+un\s+json|"score"|"interest"|"tips"/.test(combined);
  const isAssistant = /asistente experto|coach de carisma y seducci[oó]n para hombres t[ií]midos|consejo personal/.test(combined);
  const isSimulator = /est[aá]s chateando por dm|100% en personaje|mostr[aá]s inter[eé]s gradual/.test(combined);

  if (isDatePlanner) {
    return JSON.stringify([
      {
        fase: "Apertura",
        titulo: "Plan breve con energía alta",
        detalle: "Arrancá en un lugar con movimiento. Abrí con una observación divertida de su estilo y proponé un mini reto para romper el hielo.",
      },
      {
        fase: "Conexión",
        titulo: "Conversación con historias cortas",
        detalle: "Alterná preguntas concretas sobre intereses y una anécdota tuya con humor. Buscá puntos en común para crear complicidad real.",
      },
      {
        fase: "Cierre",
        titulo: "Invitación clara al segundo encuentro",
        detalle: "Cerrá con una propuesta específica en dos opciones de día. Confirmá con tono seguro y dejá un mensaje corto de seguimiento.",
      },
    ]);
  }

  if (isFeedbackJson) {
    return JSON.stringify({
      score: 7,
      interest: 6,
      tips: [
        "Abrí con una observación personal en vez de una pregunta genérica.",
        "Mostrá dirección: proponé una micro-acción en la conversación.",
        "Cerrá cada bloque con una frase que invite respuesta emocional.",
      ],
    });
  }

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

  if (isRescue) {
    return JSON.stringify(
      Array.from({ length: Math.max(2, Math.min(count, 6)) }, (_, index) =>
        rescueOptions[index % rescueOptions.length],
      ),
    );
  }

  if (isScan) {
    return JSON.stringify(
      Array.from({ length: Math.max(3, Math.min(count, 10)) }, (_, index) =>
        scanOpenings[index % scanOpenings.length],
      ),
    );
  }

  if (isSimulator) {
    const personaReply = extractPersonaReply(systemText, latestUser);
    return personaReply ?? "Interesante. Dame un mensaje más concreto y te sigo el juego.";
  }

  if (isAssistant) {
    const base = latestUser || "tu situación";
    return [
      `Entiendo. Para ${base.toLowerCase()}, no te conviene sonar necesitado ni rebuscado.`,
      "Hacé esto: línea corta + validación breve + propuesta concreta en una frase.",
      "Ejemplo: 'Me gustó tu vibra. Si te copa, seguimos por acá con algo más interesante esta noche.'",
    ].join("\n\n");
  }

  return [
    "Estoy en modo respaldo local porque la API de IA no está conectada.",
    "Si querés respuestas totalmente personalizadas, activá LOVABLE_API_KEY en producción.",
    "Mientras tanto, mantené tus mensajes cortos, claros y con una invitación concreta.",
  ].join("\n\n");
}

export const chatCompletion = createServerFn({ method: "POST" })
  .validator((data: unknown) => InputSchema.parse(data))
  .handler(async (context) => {
    const { data } = context as { data: Input };
    enforceRateLimit(getClientKey(context));

    const apiKey = process.env.LOVABLE_API_KEY;
    if (apiKey) {
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
    }

    const groqApiKey = process.env.GROQ_API_KEY;
    if (groqApiKey) {
      const groqModel = process.env.GROQ_MODEL || "llama-3.1-8b-instant";
      const groqMessages = data.messages.map((message) => ({
        role: message.role,
        content: stringifyMessageContent(message.content),
      }));

      const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${groqApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: groqModel,
          messages: groqMessages,
          temperature: data.temperature ?? 0.9,
        }),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Groq ${res.status}: ${text.slice(0, 200)}`);
      }
      const json = (await res.json()) as {
        choices: { message: { content: string } }[];
      };
      return { content: json.choices?.[0]?.message?.content ?? "", mock: false as const };
    }

    return { content: createMockResponse(data), mock: true as const };
  });
