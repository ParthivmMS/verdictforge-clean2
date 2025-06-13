import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    // Only POST allowed
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { text } = req.body;
  if (!text || typeof text !== 'string') {
    return res.status(400).json({ message: 'Invalid request body' });
  }

  try {
    // Call OpenAI GPT-4o via OpenAI API
    const openaiRes = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: `You are a legal AI trained to summarize Indian court judgments. Reply with exactly:

Legal Summary: <your professional summary for lawyers>

Plain English Summary: <your simplified summary for non-lawyers>`,
          },
          { role: 'user', content: text },
        ],
      }),
    });

    const result = await openaiRes.json();
    const content = result?.choices?.[0]?.message?.content?.trim() || '';

    console.log('[DEBUG] OpenAI Response:', content);

    const match = content.match(/Legal Summary:\s*([\s\S]*?)\s*Plain English Summary:\s*([\s\S]*)/i);

const legal = match?.[1]?.trim() || '[Could not extract legal summary]';
const plain = match?.[2]?.trim() || '[Could not extract plain summary]';

    return res.status(200).json({ legal, plain, raw: content });
  } catch (err) {
    console.error('API error:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
