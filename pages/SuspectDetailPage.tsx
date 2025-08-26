
import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProcessedData, Case as CaseType, ForenseAnalysis, Suspect, SuspectWithCases } from '../types';
import { Card, Tag, getStatusColor } from '../components/ui';
import { UsersIcon, SparklesIcon, SpinnerIcon, LinkIcon, NetworkIcon } from '../components/Icons';
import { aiProfiles, aiModusOperandi } from '../data';

const DangerMeter: React.FC<{ score: number }> = ({ score }) => {
    const percentage = score;
    const color = percentage > 80 ? 'bg-red-500' : percentage > 50 ? 'bg-orange-500' : 'bg-yellow-500';
    return (
        <div className="w-full bg-gray-700 rounded-full h-4 my-2">
            <div className={`${color} h-4 rounded-full text-right pr-2 text-white font-bold text-xs flex items-center justify-end`} style={{ width: `${percentage}%` }}>
                {score}
            </div>
        </div>
    );
};

const AIGeneratedCard: React.FC<{
    title: string;
    suspectId: number;
    aiData: Record<number, string>;
    onGenerateText: string;
    generatingText: string;
}> = ({ title, suspectId, aiData, onGenerateText, generatingText }) => {
    const [status, setStatus] = useState<'idle' | 'generating' | 'complete'>('idle');

    const handleGenerate = () => {
        setStatus('generating');
        setTimeout(() => {
            setStatus('complete');
        }, 1500);
    };

    return (
        <Card className="flex flex-col">
            <h3 className="text-xl font-bold font-sans mb-4 flex items-center gap-x-2"><SparklesIcon /> {title}</h3>
            <div className="flex-grow bg-brand-primary/50 p-4 rounded-lg min-h-[150px] flex items-center justify-center">
                {status === 'idle' && (
                    <button 
                        onClick={handleGenerate}
                        disabled={!aiData[suspectId]}
                        className="w-full bg-brand-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-accent-hover transition-colors flex items-center justify-center gap-x-2 disabled:bg-brand-accent/50 disabled:cursor-not-allowed font-sans"
                    >
                        <SparklesIcon className="h-4 w-4"/>
                        {onGenerateText}
                    </button>
                )}
                {status === 'generating' && (
                    <div className="flex items-center justify-center text-brand-text-secondary py-2 text-center">
                        <SpinnerIcon className="h-5 w-5 mr-3" />
                        <p>{generatingText}</p>
                    </div>
                )}
                {status === 'complete' && (
                    <p className="text-brand-text-secondary font-mono text-sm leading-relaxed whitespace-pre-wrap w-full">
                        {aiData[suspectId]}
                    </p>
                )}
            </div>
        </Card>
    );
};


const AssociatesCard: React.FC<{ suspect: SuspectWithCases }> = ({ suspect }) => {
    return (
        <Card>
            <h3 className="text-xl font-bold font-sans mb-4">Rede de Associados</h3>
            {suspect.associates.length > 0 ? (
                <div className="flex flex-wrap gap-4 items-center justify-center">
                    {suspect.associates.map(assoc => (
                        <Link to={`/suspects/${assoc.id}`} key={assoc.id} className="flex flex-col items-center group">
                            <img src={assoc.foto} alt={assoc.apelido} className="w-16 h-16 rounded-full border-2 border-brand-secondary group-hover:border-brand-accent transition-colors" />
                            <p className="text-sm font-semibold mt-1">{assoc.apelido}</p>
                        </Link>
                    ))}
                </div>
            ) : (
                <p className="text-brand-text-secondary text-sm">Nenhum associado conhecido nos casos registrados.</p>
            )}
        </Card>
    );
};


const useSuspectData = (data: ProcessedData) => {
    const { suspectId } = useParams<{ suspectId: string }>();

    const suspect = useMemo(() => {
        if (!data || !suspectId) return null;
        return data.suspeitos.find(s => s.id === parseInt(suspectId, 10));
    }, [data, suspectId]);

    const forenseMatches = useMemo(() => {
        if (!suspect) return [];
        return data.forenseAnalyses.filter(fa => fa.id_suspeito_match === suspect.id && fa.status === 'Correspondência');
    }, [data.forenseAnalyses, suspect]);

    const sortedCases = useMemo(() => {
        if (!suspect) return [];
        return [...suspect.allCases].sort((a, b) => new Date(a.data_ocorrido).getTime() - new Date(b.data_ocorrido).getTime());
    }, [suspect]);

    return { suspect, forenseMatches, sortedCases };
};

interface SuspectDetailPageProps {
  data: ProcessedData | null;
  onOpenMap: (focalPoint: { type: 'suspect', id: number }) => void;
}

const SuspectDetailPage: React.FC<SuspectDetailPageProps> = ({ data, onOpenMap }) => {
    if (!data) return null;
    
    const { suspect, forenseMatches, sortedCases } = useSuspectData(data);

    if (!suspect) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl font-bold">Suspeito não encontrado</h2>
                <Link to="/suspects" className="text-brand-accent hover:underline mt-4 inline-block">Voltar para a lista de suspeitos</Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <Link to="/suspects" className="text-brand-accent hover:underline mb-2 inline-block">&larr; Voltar para todos os suspeitos</Link>
                <Card className="!p-4">
                    <div className="flex justify-between items-start gap-x-6">
                        <div className="flex items-center gap-x-6">
                            <img src={suspect.foto} alt={suspect.apelido} className="w-32 h-32 rounded-full border-4 border-brand-accent" />
                            <div className="flex-1">
                                <div className="flex items-baseline gap-x-3">
                                    <h1 className="text-4xl font-bold font-sans text-brand-accent">{suspect.apelido}</h1>
                                    <p className="text-xl text-brand-text-secondary">{suspect.nome}</p>
                                </div>
                                <p className="text-brand-text-secondary mt-1">ID do Arquivo: {suspect.id}</p>
                                {suspect.isKeySuspect && <div className="mt-2 flex items-center gap-x-2 text-orange-400 font-semibold"><UsersIcon /> Suspeito-chave em célula criminosa</div>}
                                <div className="mt-2">
                                    <p className="text-sm font-semibold text-brand-text-secondary uppercase tracking-wider">Pontuação de Perigo</p>
                                    <DangerMeter score={suspect.pontuacao_perigo} />
                                </div>
                            </div>
                        </div>
                        <button
                            onClick={() => onOpenMap({ type: 'suspect', id: suspect.id })}
                            className="flex items-center gap-x-2 bg-brand-accent/20 text-brand-accent font-semibold py-2 px-3 rounded-lg hover:bg-brand-accent/40 transition-colors text-sm flex-shrink-0"
                            title="Ver Mapa de Relações do Suspeito"
                        >
                            <NetworkIcon className="h-5 w-5" />
                            <span>Mapa de Relações</span>
                        </button>
                    </div>
                </Card>
            </div>

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-1 space-y-6">
                    <Card>
                        <h3 className="text-xl font-bold font-sans mb-4">Dossiê</h3>
                        <div className="space-y-3 text-sm">
                            <p><strong>Idade:</strong> {suspect.idade || 'Desconhecida'}</p>
                            <p><strong>Altura:</strong> {suspect.fisico.altura}</p>
                            <p><strong>Peso:</strong> {suspect.fisico.peso}</p>
                            <p><strong>Marcas Distintivas:</strong> {suspect.fisico.marcas_distintivas}</p>
                            <h4 className="font-bold pt-2 border-t border-brand-secondary">Histórico Criminal:</h4>
                            <p className="text-brand-text-secondary">{suspect.historico_criminal}</p>
                        </div>
                    </Card>
                    <AssociatesCard suspect={suspect} />
                     {forenseMatches.length > 0 && (
                        <Card>
                            <h3 className="text-xl font-bold font-sans mb-4">Correspondências Forenses</h3>
                            <div className="space-y-2">
                            {forenseMatches.map(match => (
                                <div key={match.id} className="p-2 bg-brand-primary/50 rounded-md">
                                    <p className="font-semibold text-sm text-success">Correspondência de {match.tipo}</p>
                                    <p className="text-xs text-brand-text-secondary truncate">Evidência: {match.evidence?.descricao}</p>
                                    <p className="text-xs text-brand-text-secondary">Caso: <Link to={`/cases/${match.case?.id}`} className="hover:underline">{match.case?.descricao}</Link></p>
                                </div>
                            ))}
                            </div>
                        </Card>
                    )}
                </div>

                <div className="lg:col-span-2 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                         <AIGeneratedCard 
                            title="Perfil Psicológico (I.A.)"
                            suspectId={suspect.id}
                            aiData={aiProfiles}
                            onGenerateText="Gerar Perfil"
                            generatingText="Analisando padrões comportamentais..."
                        />
                         <AIGeneratedCard 
                            title="Modus Operandi (I.A.)"
                            suspectId={suspect.id}
                            aiData={aiModusOperandi}
                            onGenerateText="Analisar M.O."
                            generatingText="Compilando métodos e padrões..."
                        />
                    </div>
                    <Card>
                        <h3 className="text-xl font-bold font-sans mb-4">Linha do Tempo de Atividade ({sortedCases.length})</h3>
                        <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                            {sortedCases.map(c => (
                                <div key={c.id} className="flex justify-between items-center p-3 bg-brand-primary/50 rounded-lg">
                                    <div>
                                        <p className="font-semibold">{c.descricao}</p>
                                        <p className="text-sm text-brand-text-secondary">{c.cidade} - <span className="font-medium">{new Date(c.data_ocorrido).toLocaleDateString()}</span></p>
                                    </div>
                                    <div className="flex items-center gap-x-3">
                                        <Tag colorClass={getStatusColor(c.status)}>{c.status}</Tag>
                                        <Link to={`/cases/${c.id}`} className="text-brand-accent hover:underline text-sm font-semibold">Detalhes</Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
};

export default SuspectDetailPage;
