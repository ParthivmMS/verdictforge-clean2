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
            content: `You are a legal AI assistant. Your job is to return the following format only:

Legal Summary: <summary for lawyers>
Plain English Summary: <summary for non-lawyers>

No introduction, no title, just those two labeled parts.`
          },
          {
            role: 'user',
            content: text
          }
        ]
      })
    });

    const result = await openrouterRes.json();
    const aiText = result?.choices?.[0]?.message?.content?.trim() || '';

    // 👇 Split manually instead of regex (more reliable)
    const legalStart = aiText.indexOf('Legal Summary:');
    const plainStart = aiText.indexOf('Plain English Summary:');

    const legal = legalStart !== -1 && plainStart !== -1
      ? aiText.slice(legalStart + 14, plainStart).trim()
      : '[Could not extract legal summary]';

    const plain = plainStart !== -1
      ? aiText.slice(plainStart + 23).trim()
      : '[Could not extract plain summary]';

    return res.status(200).json({ legal, plain });

  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
