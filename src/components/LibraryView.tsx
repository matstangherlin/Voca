import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import { Word, UserProgress } from '../types';
import WordList from './WordList';

interface LibraryViewProps {
  words: Word[];
  progress: UserProgress | null;
  toggleFavorite: (id: string) => Promise<void>;
}

export default function LibraryView({ words, progress, toggleFavorite }: LibraryViewProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categories = Array.from(new Set(words.map(w => w.category)));

  const filteredWords = words.filter(word => {
    const matchesSearch = word.word.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         word.meaning.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = activeCategory ? word.category === activeCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-black dark:text-white">Biblioteca</h1>
        <p className="text-gray-500 dark:text-gray-400">Explore todas as palavras que já passaram por aqui.</p>
      </header>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-600" size={18} />
          <input 
            type="text" 
            placeholder="Buscar palavra ou significado..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-[#141414] border border-gray-100 dark:border-[#1f1f1f] text-black dark:text-white rounded-xl focus:ring-2 focus:ring-black dark:focus:ring-white outline-none transition-all"
          />
        </div>
        <div className="flex gap-2 items-center overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            <button 
                onClick={() => setActiveCategory(null)}
                className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${!activeCategory ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-white dark:bg-[#141414] border border-transparent dark:border-none text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white'}`}
            >
                Todas
            </button>
            {categories.map(cat => (
                <button 
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap capitalize ${activeCategory === cat ? 'bg-black dark:bg-white text-white dark:text-black' : 'bg-white dark:bg-[#141414] border border-transparent dark:border-none text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white'}`}
                >
                    {cat}
                </button>
            ))}
        </div>
      </div>

      <WordList 
        words={filteredWords} 
        progress={progress} 
        toggleFavorite={toggleFavorite} 
      />
    </div>
  );
}
