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
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'mistral/mistral-7b-instruct',
        messages: [
          {
            role: 'system',
            content: `You are a legal AI trained to summarize Indian court judgments.

Return **only these two sections** with exact headings:

Legal Summary:
<professional summary for lawyers>

Plain English Summary:
<simple summary for the public>

No intro, no closing.`
          },
          {
            role: 'user',
            content: text,
          },
        ],
      }),
    });

    const result = await openrouterRes.json();
    const content = result?.choices?.[0]?.message?.content?.trim() || '';

    console.log('[DEBUG] OpenRouter Output:', content);

    // Try matching with or without newline normalization
    const match =
      content.match(/Legal Summary:\s*([\s\S]+?)\s*Plain English Summary:\s*([\s\S]+)/i) ||
      content.replace(/\n/g, ' ').match(/Legal Summary:\s*(.*?)\s*Plain English Summary:\s*(.*)/i);

    const legal = match?.[1]?.trim() || '[Could not extract legal summary]';
    const plain = match?.[2]?.trim() || '[Could not extract plain summary]';

    return res.status(200).json({ legal, plain, raw: content });
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
