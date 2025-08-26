

import React, { useState, useEffect } from 'react';
import { ArrowRightIcon, SpinnerIcon } from '../components/Icons';

const LoginPage: React.FC<{ onLogin: () => void }> = ({ onLogin }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsMounted(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const logoUrl = 'https://i.imgur.com/ZPUbDku.png';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setTimeout(() => {
      onLogin();
    }, 1000); // Simula uma chamada de rede de 1 segundo
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-bg font-sans">
      <div
        className={`w-full max-w-md p-8 space-y-8 bg-brand-primary rounded-xl shadow-2xl border border-brand-secondary transition-all duration-700 ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-4'}`}
      >
        <div className="flex flex-col items-center">
          <div className="relative w-24 h-24 flex items-center justify-center mb-4">
            <div className="absolute inset-0 bg-brand-accent rounded-full shadow-[0_6px_20px_rgba(200,159,101,0.4)]"></div>
            <img src={logoUrl} alt="Chronos Logo" className="relative h-20 w-20 rounded-full object-cover" />
          </div>
          <h1 className="text-3xl font-bold tracking-widest text-brand-text">Chronos</h1>
          <p className="mt-2 text-brand-text-secondary">Análise Investigativa Temporal</p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="text-sm font-medium text-brand-text-secondary">
              Usuário
            </label>
            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              defaultValue="detetive.chefe"
              readOnly
              className="mt-1 block w-full px-3 py-2 bg-brand-secondary border border-slate-600 rounded-md text-brand-text placeholder-slate-500 focus:outline-none focus:ring-brand-accent focus:border-brand-accent sm:text-sm"
            />
          </div>
          <div>
            <label htmlFor="password"className="text-sm font-medium text-brand-text-secondary">
              Senha
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              defaultValue="********"
              readOnly
              className="mt-1 block w-full px-3 py-2 bg-brand-secondary border border-slate-600 rounded-md text-brand-text placeholder-slate-500 focus:outline-none focus:ring-brand-accent focus:border-brand-accent sm:text-sm"
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-accent hover:bg-brand-accent-hover focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent focus:ring-offset-brand-primary transition-colors disabled:bg-brand-accent/50 disabled:cursor-wait"
            >
              {isLoading ? (
                <>
                  <SpinnerIcon className="mr-2" />
                  Autenticando...
                </>
              ) : (
                <>
                  Entrar
                  <span className="absolute right-0 inset-y-0 flex items-center pr-3 group-hover:translate-x-1 transition-transform">
                    <ArrowRightIcon />
                  </span>
                </>
              )}
            </button>
          </div>
        </form>
         <div className="p-4 text-center text-xs text-brand-text-secondary">
            <p>&copy; 2024 Divisão de Crimes Complexos</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
