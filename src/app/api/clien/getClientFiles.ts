import axios from 'axios';
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { clientID } = req.query;
  try {
    const response = await axios.get(`http://localhost:3001/get-files/${clientID}`);
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: 'File Retrieval Failed' });
  }
}
