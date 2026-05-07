import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, Bookmark, Share2, Info, ChevronRight, Flame, Trophy } from 'lucide-react';
import { Word, UserProgress } from '../types';
import { generateWordOfTheDay } from '../services/geminiService';
import { Link } from 'react-router-dom';

interface DashboardProps {
  words: Word[];
  progress: UserProgress | null;
  markAsLearned: (id: string) => Promise<void>;
  toggleFavorite: (id: string) => Promise<void>;
  addWordToGlobal: (word: Word) => Promise<void>;
}

export default function Dashboard({ words, progress, markAsLearned, toggleFavorite, addWordToGlobal }: DashboardProps) {
  const [dailyWord, setDailyWord] = useState<Word | null>(null);
  const [loadingDaily, setLoadingDaily] = useState(false);

  useEffect(() => {
    async function initDaily() {
      // Find today's word from existing list or generate
      const today = new Date().toISOString().split('T')[0];
      const existing = words.find(w => w.addedDate.startsWith(today));
      
      if (existing) {
        setDailyWord(existing);
      } else {
        setLoadingDaily(true);
        try {
          const generated = await generateWordOfTheDay();
          setDailyWord(generated);
          await addWordToGlobal(generated);
        } catch (e) {
          console.error(e);
        } finally {
          setLoadingDaily(false);
        }
      }
    }
    if (words.length > 0 || !dailyWord) {
        initDaily();
    }
  }, [words]);

  const isLearned = dailyWord && progress?.learnedWords.includes(dailyWord.id);
  const isFavorite = dailyWord && progress?.favoriteWords.includes(dailyWord.id);

  return (
    <div className="space-y-10">
      <header>
        <div className="flex justify-between items-start mb-2">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-1 text-black dark:text-white">Olá, {progress?.userId ? 'Bem-vindo' : 'Visitante'}</h1>
                <p className="text-gray-500 dark:text-gray-400">Pronto para aprender algo novo hoje?</p>
            </div>
            <div className="flex gap-4">
                <div className="flex flex-col items-center p-2 px-3 bg-white dark:bg-orange-900/10 rounded-xl border border-orange-100 dark:border-orange-900/20">
                    <Flame className="text-orange-500 mb-1" size={20} />
                    <span className="text-xs font-bold text-orange-700 dark:text-orange-400">{progress?.streak || 0}</span>
                </div>
                <div className="flex flex-col items-center p-2 px-3 bg-white dark:bg-blue-900/10 rounded-xl border border-blue-100 dark:border-blue-900/20">
                    <Trophy className="text-blue-500 mb-1" size={20} />
                    <span className="text-xs font-bold text-blue-700 dark:text-blue-400">{progress?.points || 0}</span>
                </div>
            </div>
        </div>
      </header>

      <section>
        <div className="flex items-center justify-between mb-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500">Palavra do Dia</h2>
            <div className="h-px bg-white dark:bg-[#1f1f1f] flex-1 ml-4 border-b border-gray-100 dark:border-none"></div>
        </div>

        <AnimatePresence mode="wait">
          {loadingDaily ? (
            <motion.div 
              key="loading"
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              className="h-96 flex flex-col items-center justify-center bg-white dark:bg-[#0f0f0f] rounded-3xl border border-dashed border-gray-200 dark:border-[#1f1f1f]"
            >
              <Loader2 className="animate-spin text-gray-200 dark:text-gray-700 mb-4" size={40} />
              <p className="text-gray-300 dark:text-gray-600 font-medium font-mono text-sm uppercase tracking-tighter">Buscando algo extraordinário...</p>
            </motion.div>
          ) : dailyWord ? (
            <motion.div 
              key="content"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="notion-card bg-white dark:bg-[#141414] p-8 md:p-12 relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 w-32 h-32 bg-white dark:bg-white/5 rounded-full -mr-16 -mt-16 z-0 group-hover:scale-110 transition-transform duration-500 opacity-20" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                    <span className="px-2 py-0.5 bg-white dark:bg-gray-800 text-gray-400 dark:text-gray-400 text-[10px] font-bold uppercase tracking-wider rounded border border-gray-100 dark:border-none">
                        {dailyWord.category}
                    </span>
                    {isLearned && <CheckCircle2 className="text-green-500" size={16} />}
                </div>

                <h3 className="text-5xl font-black mb-1 tracking-tighter capitalize text-black dark:text-white">{dailyWord.word}</h3>
                <p className="text-sm text-gray-400 font-mono mb-8 italic">/{dailyWord.pronunciation || '... '}/</p>

                <p className="text-xl text-gray-700 dark:text-gray-300 leading-relaxed mb-8 max-w-2xl">
                    {dailyWord.meaning}
                </p>

                <div className="flex flex-wrap gap-3 mt-10">
                    <button 
                        onClick={() => markAsLearned(dailyWord.id)}
                        disabled={isLearned}
                        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all ${isLearned ? 'bg-white dark:bg-green-900/10 text-green-600 dark:text-green-400 border border-green-100 dark:border-green-900/20' : 'bg-black dark:bg-white text-white dark:text-black hover:bg-gray-800 dark:hover:bg-gray-200 shadow-lg scale-105 active:scale-95'}`}
                    >
                        {isLearned ? 'Aprendida' : 'Marcar como aprendida'}
                    </button>
                    
                    <button 
                        onClick={() => toggleFavorite(dailyWord.id)}
                        className={`p-3 rounded-xl border transition-all ${isFavorite ? 'bg-white dark:bg-orange-900/10 border-orange-200 dark:border-orange-900/30 text-orange-500' : 'bg-white dark:bg-[#141414] border-gray-100 dark:border-[#1f1f1f] text-gray-400 hover:border-gray-300 dark:hover:border-gray-700'}`}
                    >
                        <Bookmark fill={isFavorite ? "currentColor" : "none"} size={24} />
                    </button>

                    <button className="p-3 rounded-xl border border-gray-100 dark:border-[#1f1f1f] text-gray-400 hover:border-gray-300 dark:hover:border-gray-700 bg-white dark:bg-[#1a1a1a]">
                        <Share2 size={24} />
                    </button>

                    <Link 
                        to={`/word/${dailyWord.id}`}
                        className="flex items-center gap-2 ml-auto text-gray-400 dark:text-gray-500 hover:text-black dark:hover:text-white font-medium transition-colors group/link"
                    >
                        Mais informações
                        <ChevronRight size={20} className="group-hover/link:translate-x-1 transition-transform" />
                    </Link>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-48 flex items-center justify-center text-gray-400">
                Ocorreu um erro ao carregar a palavra.
            </div>
          )}
        </AnimatePresence>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="notion-card bg-white dark:bg-[#0f0f0f] border border-gray-100 dark:border-none shadow-none">
            <h4 className="font-bold mb-4 flex items-center gap-2 text-black dark:text-white">
                <Info size={18} className="text-blue-500" />
                Dica de Estudo
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                Tente usar a palavra "<strong>{dailyWord?.word}</strong>" em uma conversa real hoje. O cérebro fixa melhor novas informações quando elas são aplicadas em contextos práticos.
            </p>
        </div>
        <div className="notion-card bg-black dark:bg-white text-white dark:text-black border-none flex items-center justify-between group cursor-pointer overflow-hidden">
            <div className="z-10">
                <h4 className="font-bold text-lg mb-1">Subir de nível</h4>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                    {progress?.level === 'Mestre' 
                      ? 'Nível máximo atingido!' 
                      : `Faltam ${progress?.points !== undefined ? (
                          progress.level === 'Iniciante' ? 100 - progress.points :
                          progress.level === 'Intermediário' ? 300 - progress.points :
                          600 - progress.points
                        ) : '...'} pontos para ${
                          progress?.level === 'Iniciante' ? 'Intermediário' : 
                          progress?.level === 'Intermediário' ? 'Avançado' : 'Mestre'
                        }`
                    }
                </p>
            </div>
            <Trophy size={40} className="text-white/20 dark:text-black/20 group-hover:scale-125 group-hover:rotate-12 transition-all duration-300 z-0" />
        </div>
      </section>
    </div>
  );
}
