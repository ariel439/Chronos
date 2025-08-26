
import React, { useState, useEffect, FormEvent } from 'react';
import { RawCase, CaseStatus, CaseSeverity } from '../types';
import { SpinnerIcon } from '../components/Icons';

interface CaseFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (caseData: any) => void;
  initialData?: Partial<RawCase> | null;
}

const CaseFormModal: React.FC<CaseFormModalProps> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [formData, setFormData] = useState<Partial<RawCase>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    // Check for ID to determine if editing, otherwise set defaults for a new case.
    if (initialData?.id) {
      setFormData(initialData);
    } else {
      setFormData({
        descricao: '',
        cidade: '',
        data_ocorrido: new Date().toISOString().split('T')[0],
        status: 'investigação',
        gravidade: 'Médio',
        ...initialData,
      });
    }
  }, [initialData, isOpen]);
  
  if (!isOpen) return null;

  const isEditing = !!initialData?.id;
  const title = isEditing ? `Editar Caso #${initialData.id}` : 'Adicionar Novo Caso';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate async submission
    setTimeout(() => {
      onSubmit(formData as RawCase);
      setIsSubmitting(false);
    }, 500);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4" onClick={onClose} role="dialog" aria-modal="true" aria-labelledby="form-modal-title">
      <div 
        className="bg-brand-primary rounded-xl shadow-2xl w-full max-w-2xl flex flex-col overflow-hidden border border-brand-secondary"
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
        <form onSubmit={handleSubmit} className="p-8 space-y-4 overflow-y-auto">
          <div>
            <label htmlFor="descricao" className="block text-sm font-medium text-brand-text-secondary">Descrição</label>
            <input type="text" name="descricao" id="descricao" value={formData.descricao || ''} onChange={handleChange} required className="mt-1 block w-full bg-brand-secondary border border-slate-600 rounded-md p-2 text-brand-text" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="cidade" className="block text-sm font-medium text-brand-text-secondary">Cidade</label>
              <input type="text" name="cidade" id="cidade" value={formData.cidade || ''} onChange={handleChange} required className="mt-1 block w-full bg-brand-secondary border border-slate-600 rounded-md p-2 text-brand-text" />
            </div>
            <div>
              <label htmlFor="data_ocorrido" className="block text-sm font-medium text-brand-text-secondary">Data do Ocorrido</label>
              <input type="date" name="data_ocorrido" id="data_ocorrido" value={formData.data_ocorrido || ''} onChange={handleChange} required className="mt-1 block w-full bg-brand-secondary border border-slate-600 rounded-md p-2 text-brand-text" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-brand-text-secondary">Status</label>
              <select name="status" id="status" value={formData.status || ''} onChange={handleChange} required className="mt-1 block w-full bg-brand-secondary border border-slate-600 rounded-md p-2 text-brand-text">
                {(['investigação', 'resolvido', 'arquivada', 'reaberta'] as CaseStatus[]).map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="gravidade" className="block text-sm font-medium text-brand-text-secondary">Gravidade</label>
              <select name="gravidade" id="gravidade" value={formData.gravidade || ''} onChange={handleChange} required className="mt-1 block w-full bg-brand-secondary border border-slate-600 rounded-md p-2 text-brand-text">
                {(['Baixo', 'Médio', 'Grave', 'Gravíssimo', 'Crítico'] as CaseSeverity[]).map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>
          <div className="pt-4 flex justify-end items-center space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-brand-text hover:bg-brand-secondary transition-colors">Cancelar</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 rounded-lg text-white bg-brand-accent hover:bg-brand-accent-hover transition-colors flex items-center disabled:bg-brand-accent/50">
              {isSubmitting && <SpinnerIcon className="mr-2" />}
              {isEditing ? 'Salvar Alterações' : 'Criar Caso'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CaseFormModal;
