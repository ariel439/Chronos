

import React, { useState, useMemo, useEffect } from 'react';
import { ProcessedData, DetectiveWithStats, Case as CaseType, RawDetective, UserRole } from '../types';
import { Card, CircularProgressBar, getStatusColor, Tag } from '../components/ui';
import { SparklesIcon, SpinnerIcon, SearchIcon, EditIcon, TrashIcon } from '../components/Icons';
import { aiDetectiveProfiles } from '../data';

const DetectiveSpotlight: React.FC<{ detective: DetectiveWithStats }> = ({ detective }) => {
    const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'loading' | 'complete'>('idle');
    
    const { cases, totalCases, resolvedCases, successRate } = detective;
    const activeCases = useMemo(() => cases.filter(c => c.status === 'investigação' || c.status === 'reaberta'), [cases]);
    const closedCases = useMemo(() => cases.filter(c => c.status === 'resolvido' || c.status === 'arquivada'), [cases]);

    const handleGenerateAnalysis = () => {
        setAnalysisStatus('loading');
        setTimeout(() => {
            setAnalysisStatus('complete');
        }, 1500);
    };

    return (
        <div className="bg-brand-primary p-6 rounded-lg sticky top-6 h-[calc(100vh-8rem)] overflow-y-auto">
            <div className="flex flex-col items-center text-center">
                <img src={detective.foto} alt={detective.nome} className="w-32 h-32 rounded-full border-4 border-brand-accent mb-4 shadow-lg" />
                <h3 className="text-2xl font-bold text-brand-text font-sans">{detective.nome}</h3>
                <p className="text-brand-accent font-semibold">{detective.cargo}</p>
                <p className="text-sm text-brand-text-secondary mt-2">{detective.especialidade}</p>
            </div>
            
            <div className="w-full border-t border-brand-secondary my-6"></div>

            <h4 className="font-bold text-lg text-brand-accent mb-4 font-sans">Painel de Performance</h4>
            <div className="flex justify-around w-full items-center mb-6">
                <div className="text-center">
                    <p className="text-3xl font-bold">{totalCases}</p>
                    <p className="text-xs text-brand-text-secondary">Casos Totais</p>
                </div>
                 <div className="text-center">
                    <p className="text-3xl font-bold text-success">{resolvedCases}</p>
                    <p className="text-xs text-brand-text-secondary">Casos Resolvidos</p>
                </div>
                <div className="flex flex-col items-center">
                   <CircularProgressBar percentage={successRate} size={80} strokeWidth={8} />
                   <p className="text-xs text-brand-text-secondary mt-1">Taxa de Sucesso</p>
                </div>
            </div>

            {aiDetectiveProfiles[detective.id] && (
                 <div>
                    <h4 className="font-bold text-lg text-brand-accent mb-2 flex items-center gap-x-2 font-sans">
                        <SparklesIcon /> Análise de Performance (I.A.)
                    </h4>
                    <div className="bg-brand-secondary/50 p-4 rounded-lg text-sm min-h-[120px]">
                        {analysisStatus === 'idle' && (
                            <button 
                                onClick={handleGenerateAnalysis}
                                className="w-full bg-brand-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-accent-hover transition-colors flex items-center justify-center gap-x-2 font-sans"
                            >
                                <SparklesIcon /> Gerar Análise
                            </button>
                        )}
                        {analysisStatus === 'loading' && (
                            <div className="flex items-center justify-center text-brand-text-secondary py-2">
                                <SpinnerIcon className="mr-2" />
                                <p>Analisando dados operacionais...</p>
                            </div>
                        )}
                        {analysisStatus === 'complete' && (
                            <p className="text-brand-text-secondary font-mono text-xs leading-relaxed whitespace-pre-wrap">
                                {aiDetectiveProfiles[detective.id]}
                            </p>
                        )}
                    </div>
                </div>
            )}
            
            <div className="w-full border-t border-brand-secondary my-6"></div>

            <div>
                 <h4 className="font-bold text-lg text-brand-accent mb-4 font-sans">Casos Atribuídos</h4>
                 <div className="space-y-3">
                    <h5 className="font-semibold text-brand-text-secondary text-sm font-sans">Ativos</h5>
                     {activeCases.length > 0 ? activeCases.map(c => <CaseRow key={c.id} aCase={c} />) : <p className="text-xs text-brand-text-secondary italic">Nenhum caso ativo.</p>}
                     <h5 className="font-semibold text-brand-text-secondary text-sm mt-4 font-sans">Fechados</h5>
                     {closedCases.length > 0 ? closedCases.map(c => <CaseRow key={c.id} aCase={c} />) : <p className="text-xs text-brand-text-secondary italic">Nenhum caso fechado.</p>}
                 </div>
            </div>
        </div>
    );
};

const CaseRow: React.FC<{aCase: CaseType}> = ({aCase}) => (
    <div className="bg-brand-secondary/50 p-3 rounded-lg flex justify-between items-center">
        <p className="text-sm font-medium truncate pr-4">{aCase.descricao}</p>
        <Tag colorClass={getStatusColor(aCase.status)}>{aCase.status}</Tag>
    </div>
);

interface DetectivesPageProps {
  data: ProcessedData | null;
  currentUserRole: UserRole;
  onAdd: () => void;
  onEdit: (detective: RawDetective) => void;
  onDelete: (detective: DetectiveWithStats) => void;
}

const DetectivesPage: React.FC<DetectivesPageProps> = ({ data, currentUserRole, onAdd, onEdit, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');

    if (!data) return null;

    const sortedDetectives = useMemo(() => 
        [...data.detectives].sort((a, b) => {
            if (a.id === 1) return -1; // Sofia Costa always on top
            if (b.id === 1) return 1;
            return b.successRate - a.successRate;
        }), 
        [data.detectives]
    );

    const filteredDetectives = useMemo(() => {
        if (!searchTerm) {
            return sortedDetectives;
        }
        const lowercasedTerm = searchTerm.toLowerCase();
        return sortedDetectives.filter(detective => 
            detective.nome.toLowerCase().includes(lowercasedTerm)
        );
    }, [sortedDetectives, searchTerm]);
    
    const [selectedDetective, setSelectedDetective] = useState<DetectiveWithStats | null>(filteredDetectives[0] || null);
    
    useEffect(() => {
        if (!selectedDetective && filteredDetectives.length > 0) {
            setSelectedDetective(filteredDetectives[0]);
        } else if (filteredDetectives.length > 0 && !filteredDetectives.some(d => d.id === selectedDetective?.id)) {
            setSelectedDetective(filteredDetectives[0] || null);
        } else if (filteredDetectives.length === 0) {
            setSelectedDetective(null);
        }
    }, [filteredDetectives, selectedDetective]);

    const canPerformActions = currentUserRole === 'Delegada Chefe';

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold font-sans">Corpo de Detetives</h2>
                <button 
                  onClick={onAdd}
                  disabled={!canPerformActions}
                  className="bg-brand-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-accent-hover transition-colors disabled:bg-brand-accent/50 disabled:cursor-not-allowed"
                >
                    Adicionar Detetive
                </button>
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1 flex flex-col h-[calc(100vh-12.5rem)]">
                     <div className="relative mb-4 flex-shrink-0">
                        <input
                            type="text"
                            placeholder="Buscar por nome..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-brand-primary border border-brand-secondary rounded-lg p-2 pl-10 focus:ring-brand-accent focus:border-brand-accent text-sm font-body"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon />
                        </div>
                    </div>
                    <div className="overflow-y-auto px-4 flex-grow">
                         <div className="space-y-4">
                            {filteredDetectives.map(detective => (
                                <div 
                                    key={detective.id} 
                                    onClick={() => setSelectedDetective(detective)}
                                    className={`flex items-center p-3 rounded-lg cursor-pointer transition-all duration-200 group ${selectedDetective?.id === detective.id ? 'bg-brand-accent shadow-lg scale-105' : 'bg-brand-secondary hover:bg-brand-primary'}`}
                                >
                                    <img src={detective.foto} alt={detective.nome} className="w-12 h-12 rounded-full mr-4" />
                                    <div className="flex-1">
                                        <p className={`font-bold ${selectedDetective?.id === detective.id ? 'text-white' : 'text-brand-text'}`}>{detective.nome}</p>
                                        <p className={`text-xs ${selectedDetective?.id === detective.id ? 'text-white opacity-75' : 'text-brand-text-secondary'}`}>{detective.cargo}</p>
                                    </div>
                                    {canPerformActions && <div className={`flex items-center gap-x-1 transition-opacity ${selectedDetective?.id === detective.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                        <button onClick={(e) => { e.stopPropagation(); onEdit(detective); }} className={`p-2 transition-colors ${selectedDetective?.id === detective.id ? 'text-white hover:text-white/80' : 'text-brand-text-secondary hover:text-white'}`} title="Editar"><EditIcon className="h-4 w-4" /></button>
                                        <button onClick={(e) => { e.stopPropagation(); onDelete(detective); }} className={`p-2 transition-colors ${selectedDetective?.id === detective.id ? 'text-white hover:text-danger' : 'text-brand-text-secondary hover:text-danger'}`} title="Excluir"><TrashIcon className="h-4 w-4" /></button>
                                    </div>}
                                </div>
                            ))}
                            {filteredDetectives.length === 0 && (
                                <div className="text-center text-brand-text-secondary pt-10">
                                    Nenhum detetive encontrado.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-2">
                    {selectedDetective ? <DetectiveSpotlight key={selectedDetective.id} detective={selectedDetective} /> : (
                         <Card className="h-full flex items-center justify-center">
                            <p className="text-brand-text-secondary text-lg">Selecione um detetive para ver os detalhes.</p>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DetectivesPage;