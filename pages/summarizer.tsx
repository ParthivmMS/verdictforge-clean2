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
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY || ''}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a legal AI trained to summarize Indian court judgments.

Always return your response using exactly the following headings:

Legal Summary:
<summary for legal professionals>

Plain English Summary:
<simplified summary for general audience>

Do not skip or reword the headings. Format clearly for extraction.`
          },
          {
            role: 'user',
            content: text
          }
        ],
        temperature: 0.7
      })
    });

    const result = await openaiRes.json();
    const content = result?.choices?.[0]?.message?.content?.trim() || '';

    console.log('[GPT-4o Output]', content); // Optional: for debugging

    // Extract using regex
    const match = content.match(/Legal Summary:\s*(.+?)\s*Plain English Summary:\s*(.+)/is);

    const legal = match?.[1]?.trim() || '[Could not extract legal summary]';
    const plain = match?.[2]?.trim() || '[Could not extract plain summary]';

    return res.status(200).json({ legal, plain });
  } catch (err) {
    console.error('[API Error]', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
