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

  const apiKey = process.env.OPENROUTER_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ message: 'Missing OpenRouter API Key' });
  }

  try {
    const openrouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mistral/mistral-7b-instruct',
        messages: [
          {
            role: 'system',
            content: 'You are a legal AI trained to summarize Indian court judgments. Return:\n\nLegal Summary: <brief summary for lawyers>\nPlain English Summary: <simplified version for non-lawyers>'
          },
          {
            role: 'user',
            content: text
          }
        ]
      })
    });

    const result = await openrouterRes.json();

    const raw = result?.choices?.[0]?.message?.content || '';
    const flattened = raw.replace(/\r?\n|\r/g, ' '); // flatten newlines for safe matching

    const match = flattened.match(/Legal Summary:\s*(.+?)\s*Plain English Summary:\s*(.+)/i);

    const legal = match?.[1]?.trim() || '';
    const plain = match?.[2]?.trim() || '';

    if (!legal || !plain) {
      console.warn('⚠️ Summary format not matched. Raw response:', raw);
      return res.status(500).json({ message: 'Summary not generated. Please try again.' });
    }

    return res.status(200).json({ legal, plain });

  } catch (err) {
    console.error('API Error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
