import { RequestHandler } from 'express';
import { Counselor } from '../database/models';

export const getCounselors: RequestHandler = async (req, res) => {
  try {
    const counselors = await Counselor.find({});
    res.json(counselors);
  } catch (error) {
    console.error('Error fetching counselors:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};