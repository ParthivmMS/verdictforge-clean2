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
            content: `You are a legal AI summarizer. ONLY reply in this exact format — no introductions or explanations:

Legal Summary: <one short paragraph summarizing legal points>

Plain English Summary: <one short paragraph in simple English for laypersons>

Do NOT add anything else before or after. Strictly follow this structure.`
          },
          {
            role: 'user',
            content: text
          }
        ]
      })
    });

    const result = await openrouterRes.json();
    const content = result?.choices?.[0]?.message?.content || '';

    // Safe fallback parsing
    const flattened = content.replace(/\r?\n|\r/g, ' ');
    const match = flattened.match(/Legal Summary:\s*(.+?)\s*Plain English Summary:\s*(.+)/i);

    const legal = match?.[1]?.trim() || '[Could not extract legal summary]';
    const plain = match?.[2]?.trim() || '[Could not extract plain summary]';

    if (!legal || !plain || legal.includes('[Could not') || plain.includes('[Could not')) {
      return res.status(500).json({ message: 'Summary not generated. Please try again.' });
    }

    return res.status(200).json({ legal, plain });

  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
