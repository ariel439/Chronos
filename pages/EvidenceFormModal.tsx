
import React, { useState, useEffect, FormEvent } from 'react';
import { Evidence, User } from '../types';
import { SpinnerIcon } from '../components/Icons';

interface EvidenceFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: Partial<Evidence> | null;
  currentUser: User;
}

const EvidenceFormModal: React.FC<EvidenceFormModalProps> = ({ isOpen, onClose, onSubmit, initialData, currentUser }) => {
  const [formData, setFormData] = useState<Partial<Evidence>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData?.id) {
      setFormData(initialData);
    } else {
      setFormData({
        descricao: '',
        data_descoberta: new Date().toISOString().split('T')[0],
        local_encontrado: '',
        analise_forense: false,
        chainOfCustody: [],
        ...initialData,
      });
    }
  }, [initialData, isOpen]);
  
  if (!isOpen) return null;

  const isEditing = !!initialData?.id;
  const title = isEditing ? `Editar Evidência #${initialData.id}` : 'Adicionar Nova Evidência';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const finalValue = isCheckbox ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: finalValue }));
  };
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      onSubmit(formData as Evidence);
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="form-modal-title">
      <div 
        className="bg-brand-primary rounded-xl shadow-2xl w-full max-w-4xl flex flex-col overflow-hidden border border-brand-secondary h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-6 border-b border-brand-secondary flex-shrink-0">
          <h2 id="form-modal-title" className="text-2xl font-bold text-brand-text">{title}</h2>
          <button onClick={onClose} className="text-brand-text-secondary hover:text-white transition-colors" aria-label="Fechar modal">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-8 space-y-4 overflow-y-auto flex-grow flex flex-col">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label htmlFor="descricao" className="block text-sm font-medium text-brand-text-secondary">Descrição</label>
                <textarea name="descricao" id="descricao" value={formData.descricao || ''} onChange={handleChange} required className="mt-1 block w-full bg-brand-secondary border border-slate-600 rounded-md p-2 text-brand-text h-24" />
              </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="data_descoberta" className="block text-sm font-medium text-brand-text-secondary">Data da Descoberta</label>
                    <input type="date" name="data_descoberta" id="data_descoberta" value={formData.data_descoberta || ''} onChange={handleChange} required className="mt-1 block w-full bg-brand-secondary border border-slate-600 rounded-md p-2 text-brand-text" />
                  </div>
                  <div>
                    <label htmlFor="local_encontrado" className="block text-sm font-medium text-brand-text-secondary">Local Encontrado</label>
                    <input type="text" name="local_encontrado" id="local_encontrado" value={formData.local_encontrado || ''} onChange={handleChange} className="mt-1 block w-full bg-brand-secondary border border-slate-600 rounded-md p-2 text-brand-text" />
                  </div>
              </div>
              <div className="flex items-center gap-x-2">
                <input type="checkbox" name="analise_forense" id="analise_forense" checked={formData.analise_forense || false} onChange={handleChange} className="h-4 w-4 rounded bg-brand-secondary border-slate-600 text-brand-accent focus:ring-brand-accent" />
                <label htmlFor="analise_forense" className="text-sm text-brand-text-secondary">Requer Análise Forense</label>
              </div>
            </div>
            
            {/* Chain of Custody Section */}
            <div className="flex flex-col">
              <h3 className="text-lg font-bold text-brand-text mb-2">Cadeia de Custódia (Imutável)</h3>
              <div className="flex-grow bg-brand-secondary/50 rounded-lg p-3 border border-brand-secondary overflow-y-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b border-brand-secondary">
                      <th className="p-2">Timestamp</th>
                      <th className="p-2">Usuário</th>
                      <th className="p-2">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.chainOfCustody?.map((log, index) => (
                      <tr key={index} className="text-brand-text-secondary">
                        <td className="p-2 align-top">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="p-2 align-top">{log.user}</td>
                        <td className="p-2 align-top">{log.action}</td>
                      </tr>
                    ))}
                    {formData.chainOfCustody?.length === 0 && (
                        <tr><td colSpan={3} className="p-4 text-center">Nenhum registro.</td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="pt-4 flex justify-end items-center space-x-4 mt-auto">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-brand-text hover:bg-brand-secondary transition-colors">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg text-white bg-brand-accent hover:bg-brand-accent-hover transition-colors flex items-center disabled:bg-brand-accent/50">
              {isSubmitting && <SpinnerIcon className="mr-2" />}
              {isEditing ? 'Salvar Alterações' : 'Criar Evidência'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EvidenceFormModal;
