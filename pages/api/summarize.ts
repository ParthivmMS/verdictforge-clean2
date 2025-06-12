// File: pages/api/summarize.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ message: 'Invalid request body' });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'openai/gpt-3.5-turbo', // or any supported one you us
        messages: [
          {
            role: 'system',
            content: `You are a legal AI assistant. Given a court judgment, reply strictly in this format:

Legal Summary: <brief legal summary>

Plain English Summary: <simplified version>

Do not add anything before or after. Headings must be exact.`
          },
          {
            role: 'user',
            content: text
          }
        ]
      })
    });

    const result = await response.json();
    const content = result?.choices?.[0]?.message?.content?.trim() || '';

    console.log("[AI RAW OUTPUT]:", content);

    const match = content.match(/Legal Summary:\s*(.*?)\s*Plain English Summary:\s*(.*)/is);
    const legal = match?.[1]?.trim() || '[Could not extract legal summary]';
    const plain = match?.[2]?.trim() || '[Could not extract plain summary]';

    return res.status(200).json({ legal, plain, raw: content });

  } catch (error) {
    console.error("API error:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
