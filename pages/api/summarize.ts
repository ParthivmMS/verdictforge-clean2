// File: pages/api/summarize.ts

import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ error: 'Invalid input' });
  }

  try {
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mistralai/mixtral-8x7b',
        messages: [
          {
            role: 'system',
            content: `You are a legal judgment summarizer specialized in Indian court decisions. Return a clear and professional summary with two sections:
            
📘 Legal Summary: [a formal explanation suitable for lawyers and law students]

💬 Plain English Summary: [a simplified summary for non-lawyers]`
          },
          {
            role: 'user',
            content: text
          }
        ]
      })
    });

    const json = await response.json();
    const content = json.choices?.[0]?.message?.content || '';

    // ✅ FIXED REGEX: works without needing ES2018 target
    const match = content.match(/Legal Summary:\s*([\s\S]+?)\s*Plain English Summary:\s*([\s\S]+)/i);

    const legal = match?.[1]?.trim() || '';
    const plain = match?.[2]?.trim() || '';

    return res.status(200).json({ legal, plain });
  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({ error: 'Failed to generate summary' });
  }
}
