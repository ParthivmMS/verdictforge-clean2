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
            content: `You are a legal AI summarizer. You will be given an Indian court judgment. Your job is to return a JSON object ONLY like this:

{
  "legal": "Legal summary here",
  "plain": "Plain English summary here"
}

DO NOT add explanations. DO NOT add headings. DO NOT add anything else. Just return the JSON with two keys: "legal" and "plain".`
          },
          {
            role: 'user',
            content: text
          }
        ]
      })
    });

    const result = await openrouterRes.json();
    const raw = result?.choices?.[0]?.message?.content?.trim();

    console.log('[AI JSON OUTPUT]', raw);

    // ✅ Extract summary safely
    const parsed = JSON.parse(raw || '{}');
    const legal = parsed.legal || '[Could not extract legal summary]';
    const plain = parsed.plain || '[Could not extract plain summary]';

    return res.status(200).json({ legal, plain });

  } catch (err) {
    console.error('[API ERROR]', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
