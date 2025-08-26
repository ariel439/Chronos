
import React, { useState, useEffect, FormEvent } from 'react';
import { RawSuspect, RawDetective, RawVictim, Witness, Evidence, RawForenseAnalysis, WitnessReliability, ForenseAnalysisType, ForenseAnalysisStatus, RawData, User } from '../types';
import { SpinnerIcon } from '../components/Icons';

const FormModalWrapper: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title: string;
  onSubmit: (e: FormEvent) => void;
}> = ({ isOpen, onClose, children, title, onSubmit }) => {
  if (!isOpen) return null;
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
        <form onSubmit={onSubmit} className="p-8 space-y-4 overflow-y-auto">
          {children}
        </form>
      </div>
    </div>
  );
};


// Generic hook for form state
const useFormState = <T extends {}>(initialData: Partial<T> | null, defaultState: Partial<T>) => {
    const [formData, setFormData] = useState<Partial<T>>({});
    useEffect(() => {
        setFormData(initialData && Object.keys(initialData).length > 0 ? initialData : defaultState);
    }, [initialData]);
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value, type } = e.target;
        const isCheckbox = type === 'checkbox';
        setFormData(prev => ({ ...prev, [name]: isCheckbox ? (e.target as HTMLInputElement).checked : value }));
    };
    return { formData, handleChange, setFormData };
};

// --- SUSPECT FORM ---
export const SuspectFormModal: React.FC<{ isOpen: boolean; onClose: () => void; onSubmit: (data: any) => void; initialData?: Partial<RawSuspect> | null; }> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const { formData, handleChange } = useFormState<RawSuspect>(initialData, { nome: '', apelido: '', idade: null, historico_criminal: '' });
  const isEditing = !!initialData?.id;
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <FormModalWrapper isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} title={isEditing ? 'Editar Suspeito' : 'Adicionar Suspeito'}>
        <input type="text" name="nome" placeholder="Nome" value={formData.nome || ''} onChange={handleChange} required className="w-full bg-brand-secondary p-2 rounded" />
        <input type="text" name="apelido" placeholder="Apelido" value={formData.apelido || ''} onChange={handleChange} className="w-full bg-brand-secondary p-2 rounded" />
        <input type="number" name="idade" placeholder="Idade" value={formData.idade || ''} onChange={handleChange} className="w-full bg-brand-secondary p-2 rounded" />
        <textarea name="historico_criminal" placeholder="Histórico Criminal" value={formData.historico_criminal || ''} onChange={handleChange} className="w-full bg-brand-secondary p-2 rounded" />
        <div className="pt-4 flex justify-end items-center space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-brand-text hover:bg-brand-secondary transition-colors">Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded-lg text-white bg-brand-accent hover:bg-brand-accent-hover">{isEditing ? 'Salvar' : 'Criar'}</button>
        </div>
    </FormModalWrapper>
  );
};

// --- DETECTIVE FORM ---
export const DetectiveFormModal: React.FC<{ isOpen: boolean; onClose: () => void; onSubmit: (data: any) => void; initialData?: Partial<RawDetective> | null; }> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const { formData, handleChange } = useFormState<RawDetective>(initialData, { nome: '', cargo: '', especialidade: '' });
  const isEditing = !!initialData?.id;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <FormModalWrapper isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} title={isEditing ? 'Editar Detetive' : 'Adicionar Detetive'}>
      <input type="text" name="nome" placeholder="Nome" value={formData.nome || ''} onChange={handleChange} required className="w-full bg-brand-secondary p-2 rounded" />
      <input type="text" name="cargo" placeholder="Cargo" value={formData.cargo || ''} onChange={handleChange} className="w-full bg-brand-secondary p-2 rounded" />
      <input type="text" name="especialidade" placeholder="Especialidade" value={formData.especialidade || ''} onChange={handleChange} className="w-full bg-brand-secondary p-2 rounded" />
      <div className="pt-4 flex justify-end items-center space-x-4">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-brand-text hover:bg-brand-secondary transition-colors">Cancelar</button>
        <button type="submit" className="px-4 py-2 rounded-lg text-white bg-brand-accent hover:bg-brand-accent-hover">{isEditing ? 'Salvar' : 'Criar'}</button>
      </div>
    </FormModalWrapper>
  );
};

// --- VICTIM FORM ---
export const VictimFormModal: React.FC<{ isOpen: boolean; onClose: () => void; onSubmit: (data: any) => void; initialData?: Partial<RawVictim & { caseId?: number }> | null; }> = ({ isOpen, onClose, onSubmit, initialData }) => {
  const { formData, handleChange } = useFormState<RawVictim & { caseId?: number }>(initialData, { nome: '', idade: 0, ocupacao: '' });
  const isEditing = !!initialData?.id;
  
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <FormModalWrapper isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} title={isEditing ? 'Editar Vítima' : 'Adicionar Vítima'}>
      <input type="text" name="nome" placeholder="Nome" value={formData.nome || ''} onChange={handleChange} required className="w-full bg-brand-secondary p-2 rounded" />
      <input type="number" name="idade" placeholder="Idade" value={formData.idade || ''} onChange={handleChange} className="w-full bg-brand-secondary p-2 rounded" />
      <input type="text" name="ocupacao" placeholder="Ocupação" value={formData.ocupacao || ''} onChange={handleChange} className="w-full bg-brand-secondary p-2 rounded" />
      <div className="pt-4 flex justify-end items-center space-x-4">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-brand-text hover:bg-brand-secondary transition-colors">Cancelar</button>
        <button type="submit" className="px-4 py-2 rounded-lg text-white bg-brand-accent hover:bg-brand-accent-hover">{isEditing ? 'Salvar' : 'Criar'}</button>
      </div>
    </FormModalWrapper>
  );
};

// --- WITNESS FORM ---
export const WitnessFormModal: React.FC<{ isOpen: boolean; onClose: () => void; onSubmit: (data: any) => void; initialData?: Partial<Witness & { depoimentos: string[], caseId?: number }> | null; }> = ({ isOpen, onClose, onSubmit, initialData }) => {
    const defaultState: Partial<Witness & { depoimentos: string[] }> = { nome: '', depoimentos: [], confiabilidade: 'media' };
    const { formData, handleChange, setFormData } = useFormState<Witness & { depoimentos: string[] }>(initialData, defaultState);
    const isEditing = !!initialData?.id;

    useEffect(() => {
        const data = initialData && Object.keys(initialData).length > 0 ? initialData : defaultState;
        setFormData({
            ...data,
            depoimentos: Array.isArray(data.depoimentos) ? data.depoimentos.join('\n') : '',
        } as any);
    }, [initialData]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        onSubmit({ ...formData, depoimentos: (formData.depoimentos as unknown as string).split('\n') });
    };

    return (
        <FormModalWrapper isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} title={isEditing ? 'Editar Testemunha' : 'Adicionar Testemunha'}>
        <input type="text" name="nome" placeholder="Nome" value={formData.nome || ''} onChange={handleChange} required className="w-full bg-brand-secondary p-2 rounded" />
        <textarea name="depoimentos" placeholder="Depoimentos (um por linha)" value={formData.depoimentos as any || ''} onChange={handleChange} className="w-full bg-brand-secondary p-2 rounded h-24" disabled={isEditing && !initialData?.caseId} />
        {isEditing && !initialData?.caseId && <p className="text-xs text-brand-text-secondary -mt-2">A edição de depoimentos só é permitida na página de detalhes de um caso específico.</p>}
        <select name="confiabilidade" value={formData.confiabilidade || 'media'} onChange={handleChange} className="w-full bg-brand-secondary p-2 rounded">
            {(['alta', 'media', 'baixa'] as WitnessReliability[]).map(r => <option key={r} value={r}>{r}</option>)}
        </select>
        <div className="pt-4 flex justify-end items-center space-x-4">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-brand-text hover:bg-brand-secondary transition-colors">Cancelar</button>
            <button type="submit" className="px-4 py-2 rounded-lg text-white bg-brand-accent hover:bg-brand-accent-hover">{isEditing ? 'Salvar' : 'Criar'}</button>
        </div>
        </FormModalWrapper>
    );
};

// --- EVIDENCE FORM ---
export const EvidenceFormModal: React.FC<{ isOpen: boolean; onClose: () => void; onSubmit: (data: any) => void; initialData?: Partial<Evidence & { caseId?: number }>; currentUser: User; }> = ({ isOpen, onClose, onSubmit, initialData, currentUser }) => {
  const { formData, handleChange } = useFormState<Evidence & { caseId?: number }>(initialData, { descricao: '', data_descoberta: new Date().toISOString().split('T')[0], local_encontrado: '', analise_forense: false });
  const isEditing = !!initialData?.id;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };
  
  return (
    <FormModalWrapper isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} title={isEditing ? 'Editar Evidência' : 'Adicionar Evidência'}>
      <input type="text" name="descricao" placeholder="Descrição" value={formData.descricao || ''} onChange={handleChange} required className="w-full bg-brand-secondary p-2 rounded" />
      <input type="date" name="data_descoberta" placeholder="Data da Descoberta" value={formData.data_descoberta || ''} onChange={handleChange} className="w-full bg-brand-secondary p-2 rounded" />
      <input type="text" name="local_encontrado" placeholder="Local Encontrado" value={formData.local_encontrado || ''} onChange={handleChange} className="w-full bg-brand-secondary p-2 rounded" />
      <div className="flex items-center gap-x-2">
        <input type="checkbox" name="analise_forense" id="analise_forense" checked={formData.analise_forense || false} onChange={handleChange} className="bg-brand-secondary" />
        <label htmlFor="analise_forense" className="text-sm text-brand-text-secondary">Requer Análise Forense</label>
      </div>
      <div className="pt-4 flex justify-end items-center space-x-4">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-brand-text hover:bg-brand-secondary transition-colors">Cancelar</button>
        <button type="submit" className="px-4 py-2 rounded-lg text-white bg-brand-accent hover:bg-brand-accent-hover">{isEditing ? 'Salvar' : 'Criar'}</button>
      </div>
    </FormModalWrapper>
  );
};

// --- FORENSIC ANALYSIS FORM ---
export const ForenseAnalysisFormModal: React.FC<{ isOpen: boolean; onClose: () => void; onSubmit: (data: any) => void; initialData?: Partial<RawForenseAnalysis> | null; rawData: RawData | null }> = ({ isOpen, onClose, onSubmit, initialData, rawData }) => {
  const { formData, handleChange } = useFormState<RawForenseAnalysis>(initialData, { id_caso: 0, id_evidencia: 0, id_suspeito_match: null, tipo: 'DNA', status: 'Pendente' });
  const isEditing = !!initialData?.id;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    onSubmit({...formData, id_caso: Number(formData.id_caso), id_evidencia: Number(formData.id_evidencia), id_suspeito_match: formData.id_suspeito_match ? Number(formData.id_suspeito_match) : null });
  };
  
  return (
    <FormModalWrapper isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} title={isEditing ? 'Editar Análise Forense' : 'Adicionar Análise Forense'}>
      <select name="id_caso" value={formData.id_caso || ''} onChange={handleChange} className="w-full bg-brand-secondary p-2 rounded">
        <option value="">Selecione um Caso</option>
        {rawData?.casesRaw.map(c => <option key={c.id} value={c.id}>#{c.id} - {c.descricao}</option>)}
      </select>
      <select name="id_evidencia" value={formData.id_evidencia || ''} onChange={handleChange} className="w-full bg-brand-secondary p-2 rounded">
        <option value="">Selecione uma Evidência</option>
        {rawData?.evidencesRaw.map(e => <option key={e.id} value={e.id}>#{e.id} - {e.descricao}</option>)}
      </select>
      <select name="id_suspeito_match" value={formData.id_suspeito_match || ''} onChange={handleChange} className="w-full bg-brand-secondary p-2 rounded">
        <option value="">Selecione um Suspeito (opcional)</option>
        {rawData?.suspectsRaw.map(s => <option key={s.id} value={s.id}>{s.apelido}</option>)}
      </select>
       <select name="tipo" value={formData.tipo || 'DNA'} onChange={handleChange} className="w-full bg-brand-secondary p-2 rounded">
            {(['DNA', 'Impressão Digital', 'Balística', 'Fibra'] as ForenseAnalysisType[]).map(t => <option key={t} value={t}>{t}</option>)}
      </select>
      <select name="status" value={formData.status || 'Pendente'} onChange={handleChange} className="w-full bg-brand-secondary p-2 rounded">
            {(['Pendente', 'Correspondência', 'Sem Correspondência'] as ForenseAnalysisStatus[]).map(s => <option key={s} value={s}>{s}</option>)}
      </select>
      <div className="pt-4 flex justify-end items-center space-x-4">
        <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg text-brand-text hover:bg-brand-secondary transition-colors">Cancelar</button>
        <button type="submit" className="px-4 py-2 rounded-lg text-white bg-brand-accent hover:bg-brand-accent-hover">{isEditing ? 'Salvar' : 'Criar'}</button>
      </div>
    </FormModalWrapper>
  );
};
