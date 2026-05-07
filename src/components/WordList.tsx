import { Word, UserProgress } from '../types';
import { Bookmark, ChevronRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

interface WordListProps {
  words: Word[];
  progress: UserProgress | null;
  toggleFavorite: (id: string) => Promise<void>;
  emptyMessage?: string;
}

export default function WordList({ words, progress, toggleFavorite, emptyMessage = "Nenhuma palavra encontrada." }: WordListProps) {
  if (words.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
        <div className="w-16 h-16 bg-white dark:bg-[#0f0f0f] border border-gray-100 dark:border-none rounded-full flex items-center justify-center text-gray-200 dark:text-gray-700 mb-4">
          <Bookmark size={32} />
        </div>
        <p className="text-gray-500 dark:text-gray-400 font-medium">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-3">
      {words.sort((a, b) => new Date(b.addedDate).getTime() - new Date(a.addedDate).getTime()).map((word, index) => {
        const isFavorite = progress?.favoriteWords.includes(word.id);
        const isLearned = progress?.learnedWords.includes(word.id);

        return (
          <motion.div
            key={word.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="group block"
          >
            <div className="notion-card p-4 hover:border-gray-300 dark:hover:border-gray-700 flex items-center gap-4 group">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-bold text-lg capitalize truncate text-black dark:text-white">{word.word}</h4>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-bold uppercase tracking-wider bg-white dark:bg-gray-800 border border-gray-100 dark:border-none px-1.5 py-0.5 rounded">
                    {word.category}
                  </span>
                  {isLearned && <CheckCircle2 size={14} className="text-green-500" />}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">{word.meaning}</p>
              </div>

              <div className="flex items-center gap-2">
                <button 
                  onClick={(e) => { e.preventDefault(); toggleFavorite(word.id); }}
                  className={`p-2 rounded-lg transition-colors ${isFavorite ? 'text-orange-500 bg-white border border-orange-100 dark:border-none dark:bg-orange-900/10' : 'text-gray-300 dark:text-gray-600 hover:text-gray-500 dark:hover:text-gray-400 hover:bg-white border border-transparent hover:border-gray-100 dark:hover:bg-gray-800'}`}
                >
                  <Bookmark size={20} fill={isFavorite ? "currentColor" : "none"} />
                </button>
                <Link 
                  to={`/word/${word.id}`}
                  className="p-2 text-gray-300 dark:text-gray-600 group-hover:text-black dark:group-hover:text-white transition-colors"
                >
                  <ChevronRight size={24} />
                </Link>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
