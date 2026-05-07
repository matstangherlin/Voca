import { useState, useEffect } from 'react';
import { Word, UserProgress } from '../types';

const INITIAL_WORDS: Word[] = [
  {
    id: 'vicissitude',
    word: 'vicissitude',
    meaning: 'Sucessão de mudanças ou alternâncias; instabilidade ou reviravolta na sorte ou nas circunstâncias.',
    etymology: 'Do latim vicissitudo, que significa alternância ou vez.',
    examples: [
      "As vicissitudes da vida moldam o caráter humano.",
      "O negócio floresceu apesar das vicissitudes econômicas."
    ],
    category: 'literário',
    addedDate: new Date().toISOString(),
    pronunciation: 'vi-cis-si-tu-de'
  },
  {
    id: 'sempiterno',
    word: 'sempiterno',
    meaning: 'Que não tem fim; eterno; que dura para sempre ou que é perpétuo.',
    etymology: 'Do latim sempiternus, fusão de semper (sempre) e aeternus (eterno).',
    examples: [
      "O amor sempiterno é o tema central de muitos poemas clássicos.",
      "As montanhas permaneciam sob o sol sempiterno."
    ],
    category: 'literário',
    addedDate: new Date().toISOString(),
    pronunciation: 'sem-pi-ter-no'
  },
  {
    id: 'inexoravel',
    word: 'inexorável',
    meaning: 'Que não se deixa abrandar por rogos ou súplicas; implacável; que não muda ou desvia.',
    etymology: 'Do latim inexorabilis, prefixo in- (não) + exorabilis (que se pode exorar/convencer).',
    examples: [
      "O avanço inexorável do tempo não espera por ninguém.",
      "Um juiz inexorável na aplicação da lei."
    ],
    category: 'literário',
    addedDate: new Date().toISOString(),
    pronunciation: 'i-ne-xo-rá-vel'
  },
  {
    id: 'melifluo',
    word: 'melífluo',
    meaning: 'Que flui como mel; doce; suave; harmonioso ou agradável de ouvir.',
    etymology: 'Do latim mellifluus (mel + fluere - fluir).',
    examples: [
      "Sua voz melíflua acalmava a todos na sala.",
      "Escreveu um discurso melífluo e persuasivo."
    ],
    category: 'literário',
    addedDate: new Date().toISOString(),
    pronunciation: 'me-lí-flu-o'
  }
];

export function useVocabulary(userId: string | undefined) {
  const [words, setWords] = useState<Word[]>([]);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);

  // Initialize data
  useEffect(() => {
    // Load Words
    const savedWords = localStorage.getItem('vocab_words');
    if (savedWords) {
      setWords(JSON.parse(savedWords));
    } else {
      setWords(INITIAL_WORDS);
      localStorage.setItem('vocab_words', JSON.stringify(INITIAL_WORDS));
    }

    // Load Progress
    if (userId) {
      const savedProgress = localStorage.getItem(`vocab_progress_${userId}`);
      if (savedProgress) {
        setProgress(JSON.parse(savedProgress));
      } else {
        const initialProgress: UserProgress = {
          userId,
          learnedWords: [],
          favoriteWords: [],
          streak: 0,
          lastActive: new Date().toISOString(),
          level: 'Iniciante',
          points: 0
        };
        setProgress(initialProgress);
        localStorage.setItem(`vocab_progress_${userId}`, JSON.stringify(initialProgress));
      }
    } else {
      setProgress(null);
    }
    
    setLoading(false);
  }, [userId]);

  const saveProgress = (newProgress: UserProgress) => {
    setProgress(newProgress);
    if (userId) {
      localStorage.setItem(`vocab_progress_${userId}`, JSON.stringify(newProgress));
    }
  };

  const markAsLearned = async (wordId: string) => {
    if (!progress) return;
    if (progress.learnedWords.includes(wordId)) return;

    const points = progress.points + 10;
    let level = progress.level;
    if (points >= 600) level = 'Mestre';
    else if (points >= 300) level = 'Avançado';
    else if (points >= 100) level = 'Intermediário';

    const newProgress: UserProgress = {
      ...progress,
      learnedWords: [...progress.learnedWords, wordId],
      points,
      level,
      lastActive: new Date().toISOString()
    };
    
    const lastActiveDate = new Date(progress.lastActive).toDateString();
    const today = new Date().toDateString();
    if (lastActiveDate !== today) {
       newProgress.streak = progress.streak + 1;
    }

    saveProgress(newProgress);
  };

  const toggleFavorite = async (wordId: string) => {
    if (!progress) return;
    
    const isFavorite = progress.favoriteWords.includes(wordId);
    const newFavorites = isFavorite 
      ? progress.favoriteWords.filter(id => id !== wordId)
      : [...progress.favoriteWords, wordId];

    saveProgress({ ...progress, favoriteWords: newFavorites });
  };

  const addWordToGlobal = async (word: Word) => {
    setWords(prev => {
      if (prev.some(w => w.id === word.id)) return prev;
      const newWords = [...prev, word];
      localStorage.setItem('vocab_words', JSON.stringify(newWords));
      return newWords;
    });
  };

  return { words, progress, loading, markAsLearned, toggleFavorite, addWordToGlobal };
}
