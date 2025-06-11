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
            content: `You are a legal AI summarizer. ONLY reply in this format:

Legal Summary: <one short paragraph>

Plain English Summary: <one short paragraph in layperson-friendly language>

DO NOT include anything else — no intros, no titles, no notes. Just strictly follow the format above.`
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

    const cleaned = content.replace(/\r?\n|\r/g, ' ').trim();

    // Try to extract based on headings
    const match = cleaned.match(/Legal Summary:\s*(.+?)\s*Plain English Summary:\s*(.+)/i);

    let legal = match?.[1]?.trim() || '';
    let plain = match?.[2]?.trim() || '';

    // Fallback: if regex fails, take first and second sentence blocks
    if (!legal || !plain) {
      const parts = cleaned.split(/(?<=\.|\!|\?)\s+/); // split by sentence
      legal = parts.slice(0, 2).join(' ') || 'Summary not found.';
      plain = parts.slice(2, 4).join(' ') || 'Summary not found.';
    }

    return res.status(200).json({ legal, plain });

  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
