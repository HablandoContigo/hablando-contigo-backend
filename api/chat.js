import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const SYSTEM_PROMPT = `
Eres un asistente conversacional de apoyo emocional y acompañamiento.
No eres humano ni profesional de la salud.
Escuchas con empatía y ayudas a reflexionar sin dar diagnósticos ni tratamientos.
`;

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await client.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "system",
          content: SYSTEM_PROMPT,
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    res.status(200).json({
      reply: response.output_text,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      error: "Error interno del servidor",
    });
  }
}
