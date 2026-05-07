import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { Home, Library, Bookmark, Settings, LogIn, Layout as LayoutIcon } from 'lucide-react';
import { useAuth } from './hooks/useAuth';
import { useVocabulary } from './hooks/useVocabulary';
import { ThemeProvider } from './hooks/useTheme';
import Dashboard from './components/Dashboard';
import LibraryView from './components/LibraryView';
import FavoritesView from './components/FavoritesView';
import SettingsView from './components/SettingsView';
import WordDetail from './components/WordDetail';

function AppContent() {
  const { user, loading: authLoading, login, logout } = useAuth();
  const { words, progress, loading: vocabLoading, markAsLearned, toggleFavorite, addWordToGlobal } = useVocabulary(user?.uid);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white dark:bg-[#0A0A0A]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 bg-black dark:bg-white rounded-full mb-2 flex items-center justify-center text-white dark:text-black font-bold text-2xl">V</div>
          <p className="text-gray-400 font-medium">Carregando...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white dark:bg-[#0A0A0A] p-6">
        <div className="w-20 h-20 bg-black dark:bg-white rounded-3xl mb-8 flex items-center justify-center text-white dark:text-black font-bold text-5xl shadow-xl">V</div>
        <h1 className="text-4xl font-bold mb-4 tracking-tight text-black dark:text-white">Vocabulário</h1>
        <p className="text-gray-500 dark:text-gray-400 mb-8 text-center max-w-sm">
          Expandir seu vocabulário nunca foi tão simples. Aprenda uma nova palavra todos os dias.
        </p>
        <button 
          onClick={login}
          className="flex items-center gap-3 bg-black dark:bg-white text-white dark:text-black px-8 py-4 rounded-xl font-semibold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all transform hover:scale-[1.02] shadow-lg"
        >
          <LogIn size={20} />
          Entrar com Google
        </button>
      </div>
    );
  }

  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-[#0A0A0A] pb-24 md:pb-0 md:pl-64 transition-colors duration-300">
        {/* Sidebar for Desktop */}
        <nav className="fixed left-0 top-0 bottom-0 w-64 border-r border-gray-100 dark:border-[#1f1f1f] hidden md:flex flex-col p-6 bg-white dark:bg-[#0f0f0f]/50">
          <div className="flex items-center gap-3 mb-10 pl-2">
            <div className="w-8 h-8 bg-black dark:bg-white rounded-lg flex items-center justify-center text-white dark:text-black font-bold">V</div>
            <span className="font-bold text-xl tracking-tight text-black dark:text-white">Vocabulário</span>
          </div>

          <div className="flex flex-col gap-2 flex-1">
            <NavItem to="/" icon={<Home size={20} />} label="Início" />
            <NavItem to="/library" icon={<Library size={20} />} label="Biblioteca" />
            <NavItem to="/favorites" icon={<Bookmark size={20} />} label="Favoritas" />
            <NavItem to="/settings" icon={<Settings size={20} />} label="Ajustes" />
          </div>

          <div className="mt-auto p-4 bg-white dark:bg-[#141414] rounded-xl border border-gray-100 dark:border-[#1f1f1f] shadow-sm">
            <div className="flex items-center gap-3 mb-3">
              {user.photoURL && <img src={user.photoURL} className="w-10 h-10 rounded-full" alt="" />}
              <div className="overflow-hidden">
                <p className="font-bold text-sm truncate text-black dark:text-white">{user.displayName}</p>
                <p className="text-xs text-gray-400">{progress?.level || 'Iniciante'}</p>
              </div>
            </div>
            <div className="w-full bg-white dark:bg-gray-800 h-1.5 rounded-full mb-2 overflow-hidden border border-gray-100 dark:border-none">
              <div 
                className="bg-black dark:bg-white h-full transition-all duration-500" 
                style={{ width: `${Math.min((progress?.points || 0) % 100, 100)}%` }}
              />
            </div>
            <p className="text-[10px] text-gray-400 text-center uppercase tracking-widest font-bold">
              {progress?.points || 0} Pontos
            </p>
          </div>
        </nav>

        {/* Bottom Tab Bar for Mobile */}
        <nav className="fixed bottom-0 left-0 right-0 h-20 bg-white/80 dark:bg-[#0A0A0A]/80 backdrop-blur-md border-t border-gray-100 dark:border-[#1f1f1f] md:hidden flex justify-around items-center px-4 z-50">
          <MobileNavItem to="/" icon={<Home size={24} />} />
          <MobileNavItem to="/library" icon={<Library size={24} />} />
          <MobileNavItem to="/favorites" icon={<Bookmark size={24} />} />
          <MobileNavItem to="/settings" icon={<Settings size={24} />} />
        </nav>

        <main className="max-w-4xl mx-auto p-6 pt-10 md:p-12">
          <Routes>
            <Route path="/" element={<Dashboard words={words} progress={progress} markAsLearned={markAsLearned} toggleFavorite={toggleFavorite} addWordToGlobal={addWordToGlobal} />} />
            <Route path="/library" element={<LibraryView words={words} progress={progress} toggleFavorite={toggleFavorite} />} />
            <Route path="/favorites" element={<FavoritesView words={words} progress={progress} toggleFavorite={toggleFavorite} />} />
            <Route path="/settings" element={<SettingsView user={user} progress={progress} logout={logout} />} />
            <Route path="/word/:id" element={<WordDetail words={words} progress={progress} toggleFavorite={toggleFavorite} markAsLearned={markAsLearned} />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

function NavItem({ to, icon, label }: { to: string, icon: React.ReactNode, label: string }) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => `
        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
        ${isActive ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg dark:shadow-white/5' : 'text-gray-500 dark:text-gray-400 hover:bg-white border border-transparent hover:border-gray-100 hover:text-black dark:hover:text-white'}
      `}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </NavLink>
  );
}

function MobileNavItem({ to, icon }: { to: string, icon: React.ReactNode }) {
  return (
    <NavLink 
      to={to} 
      className={({ isActive }) => `
        p-3 rounded-2xl transition-all duration-200
        ${isActive ? 'bg-black dark:bg-white text-white dark:text-black shadow-lg' : 'text-gray-400 dark:text-gray-500'}
      `}
    >
      {icon}
    </NavLink>
  );
}

export default App;
