
import React, { ReactNode, useEffect, useState } from 'react';
import { CaseSeverity, CaseStatus, WitnessReliability } from '../types';
import { CheckCircleIcon, XCircleIcon, InfoIcon } from './Icons';

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-brand-secondary rounded-lg shadow-lg p-6 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] ${className}`}>
      {children}
    </div>
  );
};


interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children, title }) => {
  useEffect(() => {
    const scrollContainer = document.getElementById('main-scroll-container');
    if (!scrollContainer) return;

    if (isOpen) {
      const originalOverflow = scrollContainer.style.overflow;
      scrollContainer.style.overflow = 'hidden';

      return () => {
        scrollContainer.style.overflow = originalOverflow;
      };
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div 
        className="bg-brand-primary rounded-xl shadow-2xl w-full max-w-6xl h-[90vh] flex flex-col overflow-hidden border border-brand-secondary"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-brand-secondary flex-shrink-0">
          <h2 id="modal-title" className="text-2xl font-bold text-brand-text">{title}</h2>
          <button onClick={onClose} className="text-brand-text-secondary hover:text-white transition-colors" aria-label="Fechar modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="flex-grow overflow-y-auto p-8">
          {children}
        </div>
      </div>
    </div>
  );
};

export const ConfirmationModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: React.ReactNode;
}> = ({ isOpen, onClose, onConfirm, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title">
      <div 
        className="bg-brand-primary rounded-xl shadow-2xl w-full max-w-md flex flex-col overflow-hidden border border-brand-secondary"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <h2 id="confirm-modal-title" className="text-xl font-bold text-brand-text">{title}</h2>
          <div className="mt-4 text-brand-text-secondary">
            {children}
          </div>
        </div>
        <div className="flex justify-end items-center p-4 bg-brand-secondary space-x-4">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-brand-text hover:bg-brand-primary transition-colors">Cancelar</button>
          <button onClick={onConfirm} className="px-4 py-2 rounded-lg text-white bg-danger hover:bg-red-700 transition-colors">Confirmar</button>
        </div>
      </div>
    </div>
  );
};

export interface ToastMessage {
    type: 'success' | 'error';
    message: string;
}

export const ToastContainer: React.FC<{
    message: ToastMessage | null;
    onClear: () => void;
}> = ({ message, onClear }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        if (message) {
            setIsVisible(true);
            const timer = setTimeout(() => {
                setIsVisible(false);
                // Allow time for fade-out animation before clearing the message
                setTimeout(onClear, 300);
            }, 3000); // Toast visible for 3 seconds
            return () => clearTimeout(timer);
        }
    }, [message, onClear]);

    if (!message) return null;

    const toastStyles = {
        success: {
            bg: 'bg-green-500/20',
            border: 'border-green-500/30',
            icon: <CheckCircleIcon className="text-success" />,
        },
        error: {
            bg: 'bg-red-500/20',
            border: 'border-red-500/30',
            icon: <XCircleIcon />,
        },
    };

    const styles = toastStyles[message.type];

    return (
        <div
            className={`fixed top-6 right-6 w-full max-w-sm z-50 transition-all duration-300 ease-in-out ${
                isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-12'
            }`}
        >
            <div className={`flex items-center p-4 rounded-lg shadow-lg backdrop-blur-sm ${styles.bg} ${styles.border}`}>
                <div className="flex-shrink-0">{styles.icon}</div>
                <div className="ml-3 text-sm font-medium text-brand-text">{message.message}</div>
                <button
                    onClick={() => setIsVisible(false)}
                    className="ml-auto -mx-1.5 -my-1.5 p-1.5 text-brand-text-secondary hover:text-white rounded-lg focus:ring-2 focus:ring-slate-400 inline-flex h-8 w-8"
                    aria-label="Dismiss"
                >
                    <span className="sr-only">Dismiss</span>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                        ></path>
                    </svg>
                </button>
            </div>
        </div>
    );
};


export const getStatusColor = (status: CaseStatus) => {
    switch (status) {
      case 'investigação': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'resolvido': return 'bg-lime-500/20 text-lime-300 border-lime-500/30';
      case 'arquivada': return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
      case 'reaberta': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      default: return 'bg-gray-700';
    }
};

export const getSeverityColor = (severity: CaseSeverity) => {
    switch (severity) {
      case 'Crítico': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'Gravíssimo': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
      case 'Grave': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'Médio': return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'Baixo': return 'bg-lime-500/20 text-lime-300 border-lime-500/30';
      default: return 'bg-gray-700';
    }
};

export const getReliabilityColor = (reliability: WitnessReliability) => {
    switch (reliability) {
        case 'alta': return 'bg-lime-500/20 text-lime-300 border-lime-500/30';
        case 'media': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
        case 'baixa': return 'bg-red-500/20 text-red-300 border-red-500/30';
        default: return 'bg-gray-700';
    }
};

export const getAgingColor = (days: number) => {
    if (days <= 30) return 'bg-lime-500/20 text-lime-300 border-lime-500/30';
    if (days <= 90) return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
    return 'bg-red-500/20 text-red-300 border-red-500/30';
};


export const Tag: React.FC<{ colorClass: string; children: ReactNode }> = ({ colorClass, children }) => (
    <span className={`px-3 py-1 text-xs font-semibold rounded-full uppercase tracking-wider border ${colorClass}`}>
        {children}
    </span>
);

export const CircularProgressBar: React.FC<{ percentage: number; size?: number; strokeWidth?: number; }> = ({ percentage, size = 100, strokeWidth = 10 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="w-full h-full" viewBox={`0 0 ${size} ${size}`}>
        <circle
          className="text-brand-secondary"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className="text-brand-accent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ transform: 'rotate(-90deg)', transformOrigin: '50% 50%' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xl font-bold text-brand-text">{`${percentage}%`}</span>
      </div>
    </div>
  );
};