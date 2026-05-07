import { User } from 'firebase/auth';
import { UserProgress } from '../types';
import { LogOut, Bell, Moon, Sun, Languages, Shield, Mail } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

interface SettingsViewProps {
  user: User;
  progress: UserProgress | null;
  logout: () => Promise<void>;
}

export default function SettingsView({ user, progress, logout }: SettingsViewProps) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-3xl font-bold tracking-tight mb-2 text-black dark:text-white">Ajustes</h1>
        <p className="text-gray-500 dark:text-gray-400">Gerencie sua conta e preferências do aplicativo.</p>
      </header>

      <section className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Perfil</h3>
        <div className="notion-card flex items-center gap-4">
            {user.photoURL && <img src={user.photoURL} alt="" className="w-16 h-16 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-800" />}
            <div>
                <h4 className="text-xl font-bold text-black dark:text-white">{user.displayName}</h4>
                <p className="text-gray-500 dark:text-gray-400 text-sm">{user.email}</p>
                <div className="flex gap-2 mt-2">
                    <span className="px-2 py-0.5 bg-black dark:bg-white text-white dark:text-black text-[10px] font-bold rounded uppercase">Nível: {progress?.level}</span>
                    <span className="px-2 py-0.5 bg-white border border-gray-100 dark:border-none dark:bg-gray-800 text-gray-500 dark:text-gray-400 text-[10px] font-bold rounded uppercase">{progress?.points || 0} XP</span>
                </div>
            </div>
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Preferências</h3>
        <div className="notion-card p-2">
            <SettingsItem icon={<Bell size={20} className="text-blue-500" />} label="Notificações Push" value="Desativado" />
            <SettingsItem 
              icon={theme === 'dark' ? <Moon size={20} className="text-purple-500" /> : <Sun size={20} className="text-orange-500" />} 
              label="Tema" 
              value={theme === 'dark' ? 'Escuro' : 'Claro'} 
              onClick={toggleTheme}
            />
            <SettingsItem icon={<Languages size={20} className="text-green-500" />} label="Idioma da Interface" value="Português" />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400">Mais</h3>
        <div className="notion-card p-2">
            <SettingsItem icon={<Shield size={20} className="text-gray-400" />} label="Privacidade" />
            <SettingsItem icon={<Mail size={20} className="text-gray-400" />} label="Suporte & Feedback" />
        </div>
      </section>

      <button 
        onClick={logout}
        className="w-full flex items-center justify-center gap-2 py-4 border border-red-100 dark:border-red-900/30 text-red-500 font-bold rounded-2xl hover:bg-white hover:border-red-500 hover:shadow-sm dark:hover:bg-red-900/10 transition-all"
      >
        <LogOut size={20} />
        Sair da conta
      </button>

      <footer className="text-center py-6">
        <p className="text-xs text-gray-400">Vocabulário v1.0.0</p>
        <p className="text-[10px] text-gray-300 dark:text-gray-600 font-mono mt-1 uppercase tracking-tighter">Powered by Antigravity & Gemini</p>
      </footer>
    </div>
  );
}

function SettingsItem({ icon, label, value, onClick }: { icon: React.ReactNode, label: string, value?: string, onClick?: () => void }) {
    return (
        <div 
          onClick={onClick}
          className="flex items-center justify-between p-4 hover:bg-white hover:border-gray-100 border border-transparent dark:border-none dark:hover:bg-[#1a1a1a] rounded-xl transition-all cursor-pointer group"
        >
            <div className="flex items-center gap-3">
                {icon}
                <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
            </div>
            {value ? (
                <span className="text-sm text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors">{value}</span>
            ) : (
                <div className="w-5 h-5 border-2 border-gray-100 dark:border-gray-800 rounded-full group-hover:border-black dark:group-hover:border-white transition-colors" />
            )}
        </div>
    );
}
