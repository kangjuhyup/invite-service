import { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const kakaoApiKey = process.env.KAKAO_API_KEY;

  if (!kakaoApiKey) {
    return res.status(500).json({ message: 'Kakao API key not found' });
  }

  return res.status(200).json({ key: kakaoApiKey });
}
