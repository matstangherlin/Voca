import { Word, UserProgress } from '../types';
import WordList from './WordList';

interface FavoritesViewProps {
  words: Word[];
  progress: UserProgress | null;
  toggleFavorite: (id: string) => Promise<void>;
}

export default function FavoritesView({ words, progress, toggleFavorite }: FavoritesViewProps) {
  const favoriteWords = words.filter(word => progress?.favoriteWords.includes(word.id));

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-black dark:text-white">Favoritas</h1>
        <p className="text-gray-500 dark:text-gray-400">Sua coleção pessoal de palavras preferidas.</p>
      </header>

      <WordList 
        words={favoriteWords} 
        progress={progress} 
        toggleFavorite={toggleFavorite}
        emptyMessage="Você ainda não favoritou nenhuma palavra. Explore a biblioteca!"
      />
    </div>
  );
}
