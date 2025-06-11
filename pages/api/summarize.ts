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
            content: `You are a legal AI summarizer. Given an Indian court judgment, generate two sections:

Legal Summary: <summary for lawyers>
Plain English Summary: <simplified summary for non-lawyers>

Use exactly these headings: "Legal Summary:" and "Plain English Summary:".`
          },
          {
            role: 'user',
            content: text
          }
        ]
      })
    });

    const result = await openrouterRes.json();
    const raw = JSON.stringify(result, null, 2);
    console.log('[DEBUG] Full OpenRouter Response:\n', raw);

    const content = result?.choices?.[0]?.message?.content?.trim() || '';

    return res.status(200).json({
      legal: '[DEBUG MODE]',
      plain: '[DEBUG MODE]',
      raw: content
    });

  } catch (err) {
    console.error('[ERROR] summarize.ts:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
