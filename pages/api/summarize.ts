import type { NextApiRequest, NextApiResponse } from 'next';
import { jsonrepair } from 'jsonrepair';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { text } = req.body;

  if (!text || typeof text !== 'string') {
    return res.status(400).json({ message: 'Invalid request body' });
  }

  try {
    const openrouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY || ''}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mistral/mistral-7b-instruct',
        messages: [
          {
            role: 'system',
            content: `You are a legal AI summarizer. Given an Indian court judgment, return ONLY this JSON:

{
  "legal": "Legal summary for lawyers",
  "plain": "Plain English summary for non-lawyers"
}

Do not add extra explanation. Just return JSON.`
          },
          {
            role: 'user',
            content: text
          }
        ]
      })
    });

    const result = await openrouterRes.json();
    const raw = result?.choices?.[0]?.message?.content?.trim() || '';

    // Repair & parse
    const fixed = jsonrepair(raw);
    const parsed = JSON.parse(fixed);
    const legal = parsed.legal || '[Could not extract legal summary]';
    const plain = parsed.plain || '[Could not extract plain summary]';

    return res.status(200).json({ legal, plain });

  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
