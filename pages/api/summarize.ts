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
        'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`, // ✅ Set this in your Vercel Environment Variables
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'mistral/mistral-7b-instruct',
        messages: [
          {
            role: 'system',
            content: `You are a legal AI summarizer. Given a court judgment, reply with only the following two headings and summaries.

Legal Summary:
<Brief legal summary for lawyers>

Plain English Summary:
<Simple explanation for non-lawyers>

Do not include anything before or after these headings. Do not say 'Sure', 'Here is', or any greetings. Only return the two exact sections.`
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

    console.log('[DEBUG] Raw Output:', content);

    // ✅ Clean & extract using regex
    const match = content
      .replace(/\r?\n/g, ' ') // flatten newlines
      .match(/Legal Summary:\s*(.*?)\s*Plain English Summary:\s*(.*)/i);

    const legal = match?.[1]?.trim() || '[Could not extract legal summary]';
    const plain = match?.[2]?.trim() || '[Could not extract plain summary]';

    return res.status(200).json({ legal, plain, raw: content });

  } catch (err) {
    console.error('[ERROR] API failed:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
