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
    const response = await fetch('https://api.deepinfra.com/v1/openai/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.DEEPINFRA_API_KEY}`, // 🟢 Use DeepInfra or change to OPENAI_API_KEY if using OpenAI
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: [
          {
            role: 'system',
            content: `You are a legal AI summarizer. Given a court judgment, reply with only the following two headings and summaries.

Legal Summary:
<Brief legal summary for lawyers>

Plain English Summary:
<Simple explanation for non-lawyers>

Do not include anything before or after these headings. Do not say 'Sure', 'Here is', or any greetings. Only return the two exact sections.`,
          },
          { role: 'user', content: text },
        ],
      }),
    });

    const result = await response.json();
    const content = result?.choices?.[0]?.message?.content?.trim() || '';

    console.log('[DEBUG] AI Raw Output:', content);

    const match = content.replace(/\r?\n/g, ' ').match(/Legal Summary:\s*(.*?)\s*Plain English Summary:\s*(.*)/i);

    const legal = match?.[1]?.trim() || '[Could not extract legal summary]';
    const plain = match?.[2]?.trim() || '[Could not extract plain summary]';

    return res.status(200).json({ legal, plain, raw: content });
  } catch (err) {
    console.error('[ERROR] API failed:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
}
