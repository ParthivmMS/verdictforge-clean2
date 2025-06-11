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

Use the exact heading "Legal Summary:" and "Plain English Summary:".`
          },
          {
            role: 'user',
            content: text
          }
        ]
      })
    });

    const result = await openrouterRes.json();
    const content = result?.choices?.[0]?.message?.content?.trim() || '';

    console.log('[DEBUG] Full AI Output:', content);

    // ✅ FIXED extraction logic
    let legal = '[Could not extract legal summary]';
    let plain = '[Could not extract plain summary]';

    if (content.includes('Plain English Summary:')) {
      const parts = content.split(/Plain English Summary:/i);
      legal = parts[0].replace(/Legal Summary:/i, '').trim();
      plain = parts[1].trim();
    }

    return res.status(200).json({ legal, plain });

  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
