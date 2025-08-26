
import React, { useState, useMemo } from 'react';
import { ProcessedData, WitnessReliability, WitnessWithCaseCount, Witness } from '../types';
import { Card, Tag, getReliabilityColor } from '../components/ui';
import { ChevronDownIcon, SearchIcon, SparklesIcon, SpinnerIcon, EditIcon, TrashIcon } from '../components/Icons';
import { aiWitnessAnalysis } from '../data';

interface WitnessCardProps {
    witness: WitnessWithCaseCount;
    onEdit: (witness: Witness) => void;
    onDelete: (witness: WitnessWithCaseCount) => void;
}

const WitnessCard: React.FC<WitnessCardProps> = ({ witness, onEdit, onDelete }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [analysisStatus, setAnalysisStatus] = useState<'idle' | 'loading' | 'complete'>('idle');

    const handleGenerateAnalysis = () => {
        setAnalysisStatus('loading');
        setTimeout(() => {
            setAnalysisStatus('complete');
        }, 1500);
    };

    return (
        <Card className="!hover:scale-100 group">
            <div className="flex justify-between items-start">
                <div>
                    <h3 className="font-bold text-brand-text font-sans">{witness.nome}</h3>
                    <p className="text-xs text-brand-text-secondary">Associada a {witness.caseCount} caso(s)</p>
                </div>
                <div className="flex flex-col items-end gap-y-2">
                    <Tag colorClass={getReliabilityColor(witness.confiabilidade)}>{witness.confiabilidade}</Tag>
                    <div className="flex items-center gap-x-1 opacity-0 group-hover:opacity-100 transition-opacity -mr-1">
                        <button onClick={(e) => { e.stopPropagation(); onEdit(witness); }} className="p-1 text-brand-text-secondary hover:text-white transition-colors" title="Editar"><EditIcon className="h-4 w-4" /></button>
                        <button onClick={(e) => { e.stopPropagation(); onDelete(witness); }} className="p-1 text-brand-text-secondary hover:text-danger transition-colors" title="Excluir"><TrashIcon className="h-4 w-4" /></button>
                    </div>
                </div>
            </div>
            <div className="w-full border-t border-brand-secondary my-3"></div>

            {isExpanded ? (
                <div>
                    <h4 className="font-semibold text-sm text-brand-accent mb-2 font-sans">Depoimentos Registrados:</h4>
                    <ul className="space-y-2 list-disc list-inside pl-2 text-sm text-brand-text-secondary">
                        {witness.depoimentos.map((depo, index) => (
                            <li key={index} className="italic">"{depo}"</li>
                        ))}
                    </ul>
                    {aiWitnessAnalysis[witness.id] && (
                        <div className="mt-4">
                            <h4 className="font-bold text-brand-accent mb-2 flex items-center gap-x-2 text-sm font-sans">
                                <SparklesIcon /> Análise de Depoimento (I.A.)
                            </h4>
                            <div className="bg-brand-primary/50 p-3 rounded-lg text-sm min-h-[100px]">
                                {analysisStatus === 'idle' && (
                                    <button 
                                        onClick={handleGenerateAnalysis}
                                        className="w-full bg-brand-accent text-white font-semibold py-2 px-3 rounded-lg hover:bg-brand-accent-hover transition-colors flex items-center justify-center gap-x-2 text-xs font-sans"
                                    >
                                        <SparklesIcon className="h-4 w-4"/>
                                        Analisar com I.A.
                                    </button>
                                )}
                                {analysisStatus === 'loading' && (
                                    <div className="flex items-center justify-center text-brand-text-secondary py-2">
                                        <SpinnerIcon className="h-4 w-4 mr-2" />
                                        <p>Analisando...</p>
                                    </div>
                                )}
                                {analysisStatus === 'complete' && (
                                    <p className="text-brand-text-secondary font-mono text-xs leading-relaxed whitespace-pre-wrap">
                                        {aiWitnessAnalysis[witness.id]}
                                    </p>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            ) : (
                <p className="text-sm text-brand-text-secondary italic">"{witness.depoimentos[0]}"</p>
            )}

            <button 
                className="w-full text-xs text-brand-accent hover:text-white mt-3 flex items-center justify-center p-1 rounded-md transition-colors hover:bg-white/10"
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <span>{isExpanded ? 'Ocultar Detalhes' : 'Ver Mais'}</span>
                <ChevronDownIcon className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
        </Card>
    );
};

const WitnessColumn: React.FC<{ title: string; witnesses: WitnessWithCaseCount[]; color: string; onEdit: (witness: Witness) => void; onDelete: (witness: WitnessWithCaseCount) => void; }> = ({ title, witnesses, color, onEdit, onDelete }) => (
    <div className="bg-brand-primary p-4 rounded-lg flex-1">
        <h3 className={`font-bold text-lg mb-4 text-center pb-2 border-b-2 font-sans ${color}`}>{title}</h3>
        <div className="space-y-4 h-[calc(100vh-16rem)] overflow-y-auto pr-2">
            {witnesses.map(witness => (
                <WitnessCard key={witness.id} witness={witness} onEdit={onEdit} onDelete={onDelete} />
            ))}
        </div>
    </div>
);

interface WitnessesPageProps {
    data: ProcessedData | null;
    onAdd: () => void;
    onEdit: (witness: Witness) => void;
    onDelete: (witness: WitnessWithCaseCount) => void;
}

const WitnessesPage: React.FC<WitnessesPageProps> = ({ data, onAdd, onEdit, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');

    if (!data) return null;

    const reliabilityLevels: { level: WitnessReliability; title: string; color: string }[] = [
        { level: 'alta', title: 'Alta Confiabilidade', color: 'border-green-400 text-green-400' },
        { level: 'media', title: 'Média Confiabilidade', color: 'border-yellow-400 text-yellow-400' },
        { level: 'baixa', title: 'Baixa Confiabilidade', color: 'border-red-400 text-red-400' },
    ];
    
    const filteredWitnessesByReliability = useMemo(() => {
        const filtered = data.witnesses.filter(w => 
            w.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
            w.depoimentos.some(d => d.toLowerCase().includes(searchTerm.toLowerCase()))
        );

        return {
            alta: filtered.filter(w => w.confiabilidade === 'alta'),
            media: filtered.filter(w => w.confiabilidade === 'media'),
            baixa: filtered.filter(w => w.confiabilidade === 'baixa'),
        };
    }, [data.witnesses, searchTerm]);

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold font-sans">Quadro de Inteligência: Testemunhas</h2>
                 <button onClick={onAdd} className="bg-brand-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-accent-hover transition-colors">
                    Adicionar Testemunha
                </button>
            </div>
             <div className="relative">
                <input
                    type="text"
                    placeholder="Buscar por nome ou palavra-chave no depoimento..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-brand-primary border border-brand-secondary rounded-lg p-3 pl-10 focus:ring-brand-accent focus:border-brand-accent font-body"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon />
                </div>
            </div>
            <div className="flex gap-6">
                {reliabilityLevels.map(({level, title, color}) => (
                    <WitnessColumn 
                        key={level}
                        title={title}
                        witnesses={filteredWitnessesByReliability[level]}
                        color={color}
                        onEdit={onEdit}
                        onDelete={onDelete}
                    />
                ))}
            </div>
        </div>
    );
};

export default WitnessesPage;
