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
You are a senior legal associate. Summarize the given Indian legal judgment in exactly this format:

Legal Summary:
<Insert legal summary here>

Plain English Summary:
<Insert plain English explanation here>

⚠️ Do not change the headings or their order.
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

    const content = response.data.choices[0].message.content || '';

    // Updated Regex Parsing (safe even if spacing varies)
    const match = content.match(/Legal Summary:\s*(.+?)\s*Plain English Summary:\s*(.+)/is);

    const legal = match?.[1]?.trim() || '';
    const plain = match?.[2]?.trim() || '';

    res.status(200).json({ legal, plain });
  } catch (error: any) {
    res.status(500).json({ error: 'Failed to summarize', detail: error.message });
  }
};

export default handler;
