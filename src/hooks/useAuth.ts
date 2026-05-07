import { useState, useEffect } from 'react';

// Mock user for offline mode
const MOCK_USER = {
  uid: 'offline-user-id',
  displayName: 'Estudante Offline',
  email: 'offline@exemplo.com',
  photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=offline'
} as any;

export function useAuth() {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('vocab_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async () => {
    localStorage.setItem('vocab_user', JSON.stringify(MOCK_USER));
    setUser(MOCK_USER);
  };

  const logout = async () => {
    localStorage.removeItem('vocab_user');
    setUser(null);
  };

  return { user, loading, login, logout };
}
