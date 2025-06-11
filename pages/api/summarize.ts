// File: pages/api/summarize.ts
import type { NextApiRequest, NextApiResponse } from 'next';

// Example using Mistral from OpenRouter
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

    const content = result?.choices?.[0]?.message?.content || '';

    // ✅ FIX: Flatten newlines and use safer regex
    const flattened = content.replace(/\r?\n|\r/g, ' ');
    const match = flattened.match(/Legal Summary:\s*(.+?)\s*Plain English Summary:\s*(.+)/i);

    const legal = match?.[1]?.trim() || '';
    const plain = match?.[2]?.trim() || '';

    if (!legal || !plain) {
      return res.status(500).json({ message: 'Summary not generated. Please try again.' });
    }

    return res.status(200).json({ legal, plain });

  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
