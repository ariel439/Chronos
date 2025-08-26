
import React, { useState, useMemo, useEffect } from 'react';
import { ProcessedData, ForenseAnalysis, ForenseAnalysisStatus, Suspect, RawForenseAnalysis, UserRole } from '../types';
import { Card, Tag } from '../components/ui';
import { SparklesIcon, SpinnerIcon, SearchIcon, EditIcon, TrashIcon } from '../components/Icons';

const getStatusColor = (status: ForenseAnalysisStatus) => {
    switch (status) {
        case 'Pendente': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
        case 'Correspondência': return 'bg-green-500/20 text-green-300 border-green-500/30';
        case 'Sem Correspondência': return 'bg-red-500/20 text-red-300 border-red-500/30';
        default: return 'bg-gray-700';
    }
};

const DnaAnimation = () => (
    <div className="flex justify-center items-center space-x-1">
        {[...Array(10)].map((_, i) => (
            <div key={i} className="w-1 h-8 bg-brand-accent/50 rounded-full animate-pulse-glow" style={{ animationDelay: `${i * 100}ms` }}></div>
        ))}
        <p className="ml-4 text-brand-text-secondary animate-pulse">Sequenciando...</p>
    </div>
);

interface ForensePageProps {
  data: ProcessedData | null;
  currentUserRole: UserRole;
  onAdd: () => void;
  onEdit: (analysis: RawForenseAnalysis) => void;
  onDelete: (analysis: ForenseAnalysis) => void;
}

const ForensePage: React.FC<ForensePageProps> = ({ data, currentUserRole, onAdd, onEdit, onDelete }) => {
    const [selectedAnalysisId, setSelectedAnalysisId] = useState<number | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [aiReport, setAiReport] = useState<ForenseAnalysis['aiReport'] | null>(null);
    const [selectedSuspectId, setSelectedSuspectId] = useState<string>('');
    const [caseFilter, setCaseFilter] = useState('');

    useEffect(() => {
        if (data && !selectedAnalysisId && data.forenseAnalyses.length > 0) {
            setSelectedAnalysisId(data.forenseAnalyses[0].id);
        }
    }, [data, selectedAnalysisId]);
    
    if (!data) return null;

    const selectedAnalysis = useMemo(() => 
        data.forenseAnalyses.find(fa => fa.id === selectedAnalysisId),
        [selectedAnalysisId, data.forenseAnalyses]
    );

    useEffect(() => {
        if (selectedAnalysis) {
            setAiReport(selectedAnalysis.aiReport || null);
            setSelectedSuspectId(selectedAnalysis.suspectMatch?.id.toString() || '');
        }
    }, [selectedAnalysis]);

    const handleAnalysisClick = (id: number) => {
        setIsLoading(false); // Reset loading state
        setSelectedAnalysisId(id);
    };

    const handleRunAI = () => {
        if (!selectedAnalysis) return;
        setIsLoading(true);
        setAiReport(null);
        setTimeout(() => {
            const mockReport = selectedAnalysis.aiReport || { conclusion: 'Erro', summary: 'Não foi possível gerar o relatório.' };
            setAiReport(mockReport);
            setIsLoading(false);
        }, 2000);
    };

    const filteredAnalyses = useMemo(() => 
        data.forenseAnalyses.filter(fa => 
            !caseFilter || fa.id_caso.toString() === caseFilter
        ),
        [caseFilter, data.forenseAnalyses]
    );
    
    const uniqueCaseIds = useMemo(() => [...new Set(data.forenseAnalyses.map(fa => fa.id_caso))].sort((a,b) => a-b), [data.forenseAnalyses]);
    const canPerformActions = currentUserRole !== 'Detetive';

    return (
        <div>
            <div className="flex flex-col lg:flex-row gap-8 h-full">
                {/* Coluna da Esquerda: Lista de Análises */}
                <div className="lg:w-1/3">
                    <Card className="!p-0 overflow-hidden h-full">
                         <div className="p-6 border-b border-brand-secondary">
                            <div className="flex justify-between items-center">
                              <h2 className="text-2xl font-bold font-sans">Análises Registradas</h2>
                              <button 
                                onClick={onAdd} 
                                disabled={!canPerformActions}
                                className="bg-brand-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-accent-hover transition-colors text-sm disabled:bg-brand-accent/50 disabled:cursor-not-allowed"
                              >
                                  Adicionar Análise
                              </button>
                            </div>
                             <div className="relative mt-4">
                                <select 
                                    value={caseFilter}
                                    onChange={(e) => setCaseFilter(e.target.value)}
                                    className="w-full bg-brand-primary border border-brand-secondary rounded-lg p-2 focus:ring-brand-accent focus:border-brand-accent font-body"
                                >
                                    <option value="">Filtrar por caso...</option>
                                    {uniqueCaseIds.map(id => <option key={id} value={id}>Caso #{id}</option>)}
                                </select>
                            </div>
                        </div>
                        <div className="overflow-y-auto h-[calc(100%-150px)] p-6 space-y-4">
                            {filteredAnalyses.map(analysis => (
                                <div 
                                    key={analysis.id}
                                    onClick={() => handleAnalysisClick(analysis.id)}
                                    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 group ${selectedAnalysisId === analysis.id ? 'bg-brand-accent shadow-lg scale-105' : 'bg-brand-secondary hover:bg-brand-primary'}`}
                                >
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className={`font-bold ${selectedAnalysisId === analysis.id ? 'text-white' : 'text-brand-text'}`}>Evidência #{analysis.id_evidencia}</h3>
                                        <div className="flex flex-col items-end gap-y-2">
                                            <Tag colorClass={getStatusColor(analysis.status)}>{analysis.status}</Tag>
                                            {canPerformActions && <div className={`flex items-center gap-x-1 transition-opacity ${selectedAnalysisId === analysis.id ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                                <button onClick={(e) => { e.stopPropagation(); onEdit(analysis); }} className={`p-1 transition-colors ${selectedAnalysisId === analysis.id ? 'text-white hover:text-white/80' : 'text-brand-text-secondary hover:text-white'}`} title="Editar"><EditIcon className="h-4 w-4" /></button>
                                                <button onClick={(e) => { e.stopPropagation(); onDelete(analysis); }} className={`p-1 transition-colors ${selectedAnalysisId === analysis.id ? 'text-white hover:text-danger' : 'text-brand-text-secondary hover:text-danger'}`} title="Excluir"><TrashIcon className="h-4 w-4" /></button>
                                            </div>}
                                        </div>
                                    </div>
                                    <p className={`text-sm truncate ${selectedAnalysisId === analysis.id ? 'text-white/80' : 'text-brand-text-secondary'}`}>{analysis.evidence?.descricao}</p>
                                    <p className={`text-xs mt-1 ${selectedAnalysisId === analysis.id ? 'text-white/80' : 'text-brand-text-secondary'}`}>Tipo: {analysis.tipo} | Caso: #{analysis.id_caso}</p>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Coluna da Direita: Analisador */}
                <div className="lg:w-2/3">
                    <Card className="h-full flex flex-col">
                        <h2 className="text-2xl font-bold mb-4 font-sans flex items-center gap-x-2">
                            <SparklesIcon /> Comparador de Amostras
                        </h2>
                        {selectedAnalysis ? (
                            <div className="space-y-6 flex-grow flex flex-col">
                                <Card className="!bg-brand-primary">
                                    <h3 className="font-bold text-brand-accent mb-2">Detalhes da Evidência</h3>
                                    <p><strong>ID da Evidência:</strong> {selectedAnalysis.evidence?.id}</p>
                                    <p><strong>Descrição:</strong> {selectedAnalysis.evidence?.descricao}</p>
                                    <p><strong>Tipo de Análise:</strong> {selectedAnalysis.tipo}</p>
                                    <p><strong>Caso Associado:</strong> #{selectedAnalysis.case?.id} - {selectedAnalysis.case?.descricao}</p>
                                </Card>
                                
                                {selectedAnalysis.status === 'Pendente' && !aiReport && (
                                    <Card className="!bg-brand-primary">
                                        <h3 className="font-bold text-brand-accent mb-2">Comparar com Suspeito</h3>
                                        <div className="flex gap-4">
                                            <select 
                                                value={selectedSuspectId}
                                                onChange={(e) => setSelectedSuspectId(e.target.value)}
                                                className="w-full bg-brand-secondary border border-slate-600 rounded-md text-brand-text"
                                            >
                                                <option value="">Selecione um suspeito...</option>
                                                {data.suspeitos.map(s => <option key={s.id} value={s.id}>{s.apelido} ({s.nome})</option>)}
                                            </select>
                                            <button 
                                                onClick={handleRunAI}
                                                disabled={!selectedSuspectId || isLoading || !canPerformActions}
                                                className="bg-brand-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-accent-hover transition-colors flex items-center justify-center gap-x-2 disabled:bg-brand-accent/50 disabled:cursor-not-allowed"
                                            >
                                                <SparklesIcon /> Iniciar Análise
                                            </button>
                                        </div>
                                    </Card>
                                )}

                                <div className="flex-grow flex items-start justify-center">
                                    {isLoading ? (
                                        <DnaAnimation />
                                    ) : aiReport ? (
                                        <Card className="w-full !bg-brand-primary font-mono text-sm">
                                            <h3 className="font-bold text-brand-accent mb-2 text-lg">Relatório da I.A.</h3>
                                            <p className="whitespace-pre-wrap"><strong className="text-brand-text-secondary">Conclusão:</strong> <span className={aiReport.conclusion === 'Correspondência Positiva' ? 'text-success' : 'text-danger'}>{aiReport.conclusion}</span></p>
                                            {aiReport.matchProbability && <p className="whitespace-pre-wrap"><strong className="text-brand-text-secondary">Probabilidade de Correspondência:</strong> {aiReport.matchProbability}%</p>}
                                            {aiReport.markers && <p className="whitespace-pre-wrap"><strong className="text-brand-text-secondary">Marcadores Identificados:</strong> {aiReport.markers.join(', ')}</p>}
                                            <p className="mt-4 whitespace-pre-wrap"><strong className="text-brand-text-secondary">Resumo:</strong> {aiReport.summary}</p>
                                        </Card>
                                    ) : (
                                        <p className="text-brand-text-secondary">Análise concluída. O relatório aparecerá aqui.</p>
                                    )}
                                </div>
                            </div>
                        ) : (
                            <div className="flex-grow flex items-center justify-center">
                                <p className="text-brand-text-secondary text-lg">Selecione uma análise da lista para ver os detalhes.</p>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default ForensePage;
