import React, { useState, useEffect } from 'react';
import type { User } from '../types';

interface LoginProps {
  onLogin: (user: User) => void;
}

// Stored user type, includes password
interface StoredUser extends User {
  password?: string;
}

const USERS_STORAGE_KEY = 'pilaris_users';
const REMEMBERED_EMAIL_KEY = 'pilaris_remembered_email';

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [view, setView] = useState<'login' | 'register' | 'forgot'>('login');
  
  // Login state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  
  // Register state
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');

  const [error, setError] = useState('');

  // Initialize user database and remembered email on first load
  useEffect(() => {
    try {
      // Initialize users if not present
      const users = localStorage.getItem(USERS_STORAGE_KEY);
      if (!users) {
        const demoUser: StoredUser = { email: 'demo@pilates.com', password: 'demo', name: 'Studio Admin' };
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify([demoUser]));
      }
      
      // Check for remembered email
      const rememberedEmail = localStorage.getItem(REMEMBERED_EMAIL_KEY);
      if (rememberedEmail) {
        setEmail(rememberedEmail);
        setRememberMe(true);
      } else {
        // If no remembered email, default to demo for convenience
        setEmail('demo@pilates.com');
        setPassword('demo');
      }

    } catch (e) {
      console.error("Failed to initialize user storage or remembered email", e);
    }
  }, []);

  const getUsers = (): StoredUser[] => {
    try {
      const usersJSON = localStorage.getItem(USERS_STORAGE_KEY);
      return usersJSON ? JSON.parse(usersJSON) : [];
    } catch (e) {
      console.error("Failed to get users from storage", e);
      return [];
    }
  };

  const saveUsers = (users: StoredUser[]) => {
    try {
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error("Failed to save users to storage", e);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const users = getUsers();
    const foundUser = users.find(user => user.email === email && user.password === password);

    if (foundUser) {
       try {
        if (rememberMe) {
          localStorage.setItem(REMEMBERED_EMAIL_KEY, email);
        } else {
          localStorage.removeItem(REMEMBERED_EMAIL_KEY);
        }
      } catch (e) {
          console.error("Failed to handle remember me storage", e);
      }
      onLogin({ email: foundUser.email, name: foundUser.name });
    } else {
      setError('Email ou senha inválidos.');
    }
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!registerName.trim() || !registerEmail.trim() || !registerPassword.trim()) {
      setError('Por favor, preencha todos os campos para criar a conta.');
      return;
    }
    
    const users = getUsers();
    const existingUser = users.find(user => user.email === registerEmail);

    if (existingUser) {
      setError('Este email já está cadastrado.');
      return;
    }

    const newUser: StoredUser = {
      email: registerEmail,
      name: registerName,
      password: registerPassword
    };

    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers);
    
    onLogin({ email: newUser.email, name: newUser.name });
  };
  
  const renderForm = () => {
    switch (view) {
      case 'register':
        return (
          <>
            <h2 className="text-2xl font-bold text-center text-brand-darkgray dark:text-gray-200">Criar Nova Conta</h2>
            <p className="text-center text-brand-gray dark:text-gray-400 mb-6">Comece a organizar seu estúdio hoje.</p>
            <form className="space-y-4" onSubmit={handleRegister}>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="register-name">Nome Completo</label>
                <input 
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-dark focus:border-transparent transition bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600" 
                    id="register-name" 
                    type="text" 
                    placeholder="Seu Nome" 
                    value={registerName}
                    onChange={(e) => setRegisterName(e.target.value)}
                    required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="register-email">Email</label>
                <input 
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-dark focus:border-transparent transition bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600" 
                    id="register-email" 
                    type="email" 
                    placeholder="email@exemplo.com" 
                    value={registerEmail}
                    onChange={(e) => setRegisterEmail(e.target.value)}
                    required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="register-password">Senha</label>
                <input 
                    className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-dark focus:border-transparent transition bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600" 
                    id="register-password" 
                    type="password" 
                    placeholder="••••••••" 
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    required 
                />
              </div>
               {error && (
                <p className="text-sm text-center text-red-600 bg-red-100 p-2 rounded-md">
                  {error}
                </p>
              )}
              <button className="w-full bg-primary text-white py-2 px-4 rounded-md font-semibold hover:bg-primary-dark transition-colors" type="submit">
                Criar Conta
              </button>
            </form>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
              Já tem uma conta? <button onClick={() => { setView('login'); setError(''); }} className="font-medium text-primary hover:underline">Faça o login</button>
            </p>
          </>
        );
      case 'forgot':
        return (
           <>
            <h2 className="text-2xl font-bold text-center text-brand-darkgray dark:text-gray-200">Recuperar Senha</h2>
            <p className="text-center text-brand-gray dark:text-gray-400 mb-6">Insira seu email para enviarmos um link de recuperação.</p>
            <form className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="forgot-email">Email</label>
                <input className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-dark focus:border-transparent transition bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600" id="forgot-email" type="email" placeholder="email@exemplo.com" required />
              </div>
              <button className="w-full bg-primary text-white py-2 px-4 rounded-md font-semibold hover:bg-primary-dark transition-colors" type="button" onClick={() => { alert('Link de recuperação enviado! (Simulação)'); setView('login'); }}>
                Enviar Link
              </button>
            </form>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-4">
              Lembrou a senha? <button onClick={() => { setView('login'); setError(''); }} className="font-medium text-primary hover:underline">Voltar para o login</button>
            </p>
          </>
        );
      case 'login':
      default:
        return (
          <>
            <h2 className="text-2xl font-bold text-center text-brand-darkgray dark:text-gray-200">Bem-vindo(a) de volta!</h2>
            <p className="text-center text-brand-gray dark:text-gray-400 mb-6">Faça o login para continuar.</p>
            <form className="space-y-4" onSubmit={handleLogin}>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="email">Email</label>
                <input 
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-dark focus:border-transparent transition bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600" 
                  id="email" 
                  type="email" 
                  placeholder="email@exemplo.com" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300" htmlFor="password">Senha</label>
                <input 
                  className="mt-1 w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-dark focus:border-transparent transition bg-gray-50 dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600" 
                  id="password" 
                  type="password" 
                  placeholder="••••••••" 
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required 
                />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 text-primary focus:ring-primary-dark border-gray-300 rounded"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                    Lembrar usuário
                  </label>
                </div>
                <div className="text-sm">
                  <button type="button" onClick={() => { setView('forgot'); setError(''); }} className="font-medium text-primary hover:underline">Esqueceu a senha?</button>
                </div>
              </div>


              {error && (
                <p className="text-sm text-center text-red-600 bg-red-100 p-2 rounded-md">
                  {error}
                </p>
              )}

              <button className="w-full bg-primary text-white py-2 px-4 rounded-md font-semibold hover:bg-primary-dark transition-colors" type="submit">
                Entrar
              </button>
            </form>
            <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
              Não tem uma conta? <button onClick={() => { setView('register'); setError(''); }} className="font-medium text-primary hover:underline">Crie uma agora</button>
            </p>
          </>
        );
    }
  }

  return (
    <div className="min-h-screen bg-secondary dark:bg-gray-900 flex flex-col justify-center items-center p-4">
       <div className="flex items-center space-x-2 mb-8">
            <svg className="w-10 h-10 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
            </svg>
            <h1 className="text-3xl font-bold text-brand-darkgray dark:text-gray-200">
                Pilaris<span className="text-primary">Control</span>
            </h1>
        </div>
      <div className="max-w-md w-full bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
        {renderForm()}
      </div>
    </div>
  );
};

export default Login;