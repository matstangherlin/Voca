import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, Bookmark, Share2, Volume2, History, BookOpen, Quote, CheckCircle2 } from 'lucide-react';
import { Word, UserProgress } from '../types';

interface WordDetailProps {
  words: Word[];
  progress: UserProgress | null;
  toggleFavorite: (id: string) => Promise<void>;
  markAsLearned: (id: string) => Promise<void>;
}

export default function WordDetail({ words, progress, toggleFavorite, markAsLearned }: WordDetailProps) {
  const { id } = useParams();
  const navigate = useNavigate();
  const word = words.find(w => w.id === id);

  if (!word) {
    return <div className="text-center py-20 text-gray-500">Palavra não encontrada.</div>;
  }

  const isFavorite = progress?.favoriteWords.includes(word.id);
  const isLearned = progress?.learnedWords.includes(word.id);

  const speak = () => {
    const utterance = new SpeechSynthesisUtterance(word.word);
    utterance.lang = 'pt-BR';
    window.speechSynthesis.speak(utterance);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-12"
    >
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-400 hover:text-black dark:hover:text-white transition-colors mb-4"
      >
        <ChevronLeft size={20} />
        Voltar
      </button>

      <section>
        <div className="flex items-center gap-3 mb-4">
            <span className="px-3 py-1 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-xs font-bold uppercase tracking-widest rounded-full border border-gray-100 dark:border-none">
                {word.category}
            </span>
            {isLearned && <span className="flex items-center gap-1 text-green-600 dark:text-green-400 text-xs font-bold bg-white dark:bg-green-900/10 px-3 py-1 rounded-full border border-green-100 dark:border-none"><CheckCircle2 size={14}/> Aprendida</span>}
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
                <h1 className="text-7xl font-black tracking-tighter capitalize mb-2 text-black dark:text-white">{word.word}</h1>
                <div className="flex items-center gap-4 text-gray-400 dark:text-gray-500 font-mono italic">
                    <span>/{word.pronunciation || word.word}/</span>
                    <button 
                        onClick={speak}
                        className="p-2 hover:text-black dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-all"
                    >
                        <Volume2 size={24} />
                    </button>
                </div>
            </div>

            <div className="flex gap-3">
                <button 
                    onClick={() => toggleFavorite(word.id)}
                    className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold transition-all border ${isFavorite ? 'bg-white dark:bg-orange-900/10 border-orange-200 dark:border-orange-900/30 text-orange-600 dark:text-orange-400' : 'bg-white dark:bg-[#141414] border-gray-100 dark:border-[#1f1f1f] text-gray-500 hover:border-gray-300 dark:hover:border-gray-700'}`}
                >
                    <Bookmark fill={isFavorite ? "currentColor" : "none"} size={20} />
                    {isFavorite ? 'Favorita' : 'Favoritar'}
                </button>
                <button className="p-4 rounded-2xl border border-gray-100 dark:border-[#1f1f1f] text-gray-500 hover:border-gray-300 dark:hover:border-gray-700 hover:bg-white transition-colors">
                    <Share2 size={20} />
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-gray-100 dark:border-[#1f1f1f] pt-12">
            <div className="md:col-span-2 space-y-12">
                <div>
                    <h3 className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
                        <BookOpen size={18} />
                        Significado
                    </h3>
                    <p className="text-2xl text-gray-800 dark:text-gray-200 leading-relaxed font-medium">
                        {word.meaning}
                    </p>
                </div>

                <div>
                    <h3 className="flex items-center gap-2 text-sm font-bold text-gray-400 uppercase tracking-widest mb-6">
                        <Quote size={18} />
                        Exemplos de uso
                    </h3>
                    <div className="space-y-6">
                        {word.examples.map((example, i) => (
                            <div key={i} className="pl-6 border-l-4 border-gray-100 dark:border-gray-800 italic text-gray-600 dark:text-gray-400 text-lg hover:border-black dark:hover:border-white transition-colors py-1">
                                "{example}"
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-8">
                <div className="p-6 bg-white border border-gray-100 dark:border-none dark:bg-[#0f0f0f] rounded-3xl space-y-4">
                    <h3 className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest">
                        <History size={16} />
                        Etimologia
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 leading-relaxed text-sm">
                        {word.etymology}
                    </p>
                </div>

                {!isLearned && (
                    <button 
                        onClick={() => markAsLearned(word.id)}
                        className="w-full py-4 bg-black dark:bg-white text-white dark:text-black rounded-2xl font-bold shadow-lg hover:bg-gray-800 dark:hover:bg-gray-200 transition-all transform hover:scale-[1.02]"
                    >
                        Conheci esta palavra! (+10 pts)
                    </button>
                )}
            </div>
        </div>
      </section>
    </motion.div>
  );
}
