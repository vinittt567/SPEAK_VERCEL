import { useState, useEffect } from 'react';

interface Counselor {
  id: string;
  name: string;
  specialty: string[];
  languages: string[];
  mode: string;
  status: string;
  platform: string;
  meetLink: string;
  avatar?: string;
  bio?: string;
  rating?: number;
  totalSessions?: number;
}

export const useCounselors = () => {
  const [counselors, setCounselors] = useState<Counselor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCounselors();
  }, []);

  const fetchCounselors = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/counselors');
      if (!response.ok) {
        throw new Error('Failed to fetch counselors');
      }
      const data = await response.json();
      setCounselors(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      // Fallback to hardcoded data if API fails
      setCounselors([
        {
          id: "counsellor_1",
          name: "Dr. Sharma",
          specialty: ["Stress", "Anxiety"],
          languages: ["English", "Hindi"],
          mode: "Both",
          status: "Available",
          platform: "Google Meet",
          meetLink: "https://meet.google.com/wkv-wsst-pdy",
          rating: 4.8,
          totalSessions: 150
        },
        {
          id: "counsellor_2",
          name: "Dr. Singh",
          specialty: ["Career", "Anxiety"],
          languages: ["English", "Punjabi"],
          mode: "Online",
          status: "Available",
          platform: "Google Meet",
          meetLink: "https://meet.google.com/dqc-uwht-jph",
          rating: 4.9,
          totalSessions: 200
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return { counselors, loading, error, refetch: fetchCounselors };
};