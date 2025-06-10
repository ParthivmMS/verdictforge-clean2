// File: pages/api/summarize.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { text } = req.body;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY;

  if (!text || !apiKey) {
    return res.status(400).json({ error: 'Missing text or API key' });
  }

  try {
    const systemPrompt = `
You are a senior legal associate. Summarize the given Indian legal judgment in two parts:
1. A professional legal summary with Facts, Issues, Reasoning, and Decision.
2. A simple plain English explanation.

Output both separately.
    `;

    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'mistralai/mistral-7b-instruct:free',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: text },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const content = response.data.choices[0].message.content;

    const [legal, plain] = content.split(/Plain English Explanation:/i);
    res.status(200).json({
      legal: legal?.trim().replace(/^Legal Summary:/i, '') || '',
      plain: plain?.trim() || '',
    });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to summarize', detail: error.message });
  }
};

export default handler;
