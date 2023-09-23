import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const searchTerm: string = req.query.searchTerm as string;
    const response = await axios.get(`http://localhost:3001/search-clients?searchTerm=${searchTerm}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Client Search Failed' });
  }
}

