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
            content: `You are a legal AI summarizer. Return two sections:
            
Legal Summary: <short paragraph>

Plain English Summary: <simplified version>

Do not include any headings besides those.`
          },
          {
            role: 'user',
            content: text
          }
        ]
      })
    });

    const result = await openrouterRes.json();

    console.log('[DEBUG] OpenRouter raw response:', JSON.stringify(result, null, 2)); // ✅ Log entire response

    const content = result?.choices?.[0]?.message?.content?.trim();

    if (!content) {
      return res.status(500).json({ message: 'No content received from AI.', raw: JSON.stringify(result, null, 2) });
    }

    return res.status(200).json({
      legal: '[DEBUG MODE]',
      plain: '[DEBUG MODE]',
      raw: content
    });

  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
