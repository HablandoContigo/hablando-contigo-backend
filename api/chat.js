import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
Eres un asistente conversacional de apoyo emocional y acompañamiento.
Tu rol es escuchar y responder con empatía, sin actuar como terapeuta
ni profesional de la salud.

Reglas:
- No eres humano.
- No entregas diagnósticos ni tratamientos.
- No das instrucciones peligrosas.
- Recomiendas ayuda profesional si hay riesgo.
`;

export default async function handler(req, res) {

  // 🔹 PRUEBA DE VIDA (MUY IMPORTANTE)
  if (req.method === "GET") {
    return res.status(200).json({
      status: "API viva",
      message: "La función /api/chat está funcionando correctamente"
    });
  }

  // 🔹 SOLO POST PERMITIDO PARA CHAT
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({
        error: "Message is required"
      });
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: SYSTEM_PROMPT
        },
        {
          role: "user",
          content: message
        }
      ]
    });

    return res.status(200).json({
      reply: response.output_text
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Error interno del servidor"
    });
  }
}
