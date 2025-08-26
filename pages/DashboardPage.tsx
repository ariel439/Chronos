import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ProcessedData, Case as CaseType, SuspectWithCases, DetectiveWithStats, CaseSeverity, CaseStatus } from '../types';
import { Card } from '../components/ui';
import { ArrowRightIcon, LinkIcon, SparklesIcon, SpinnerIcon, TimelineIcon } from '../components/Icons';
import { aiSummaries } from '../data';
import { generateText } from '../lib/ai';

const KpiCard: React.FC<{ title: string; value: string | number; description: string; icon: React.ReactNode; className?: string }> = ({ title, value, description, icon, className }) => (
    <Card className={`flex flex-col justify-between ${className}`}>
      <div className="flex justify-between items-start">
        <h3 className="text-lg font-semibold text-brand-text-secondary font-sans">{title}</h3>
        <div className="text-brand-accent">{icon}</div>
      </div>
      <p className="text-4xl font-bold my-4">{value}</p>
      <p className="text-sm text-brand-text-secondary">{description}</p>
    </Card>
);

const StrategicBriefing: React.FC<{ cases: CaseType[], className?: string }> = ({ cases, className }) => {
    const [selectedCaseId, setSelectedCaseId] = useState<string>('');
    const [briefing, setBriefing] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    
    const aiReadyCases = useMemo(() => cases.filter(c => aiSummaries[c.id]), [cases]);

    const handleGenerate = async () => {
        if (!selectedCaseId) return;
        setIsLoading(true);
        setBriefing('');
        const selectedCase = cases.find(c => c.id === parseInt(selectedCaseId));
        if (!selectedCase) {
            setIsLoading(false);
            return;
        }

        const prompt = `Forneça um briefing estratégico de alto nível para o caso: '${selectedCase.descricao}'. Foque no objetivo principal, suspeitos-chave e nas evidências mais críticas. Mantenha a resposta concisa e em português.`;
        const result = await generateText(prompt);
        setBriefing(result);
        setIsLoading(false);
    };

    return (
        <Card className={`col-span-1 md:col-span-2 lg:col-span-4 !bg-gradient-to-r from-brand-secondary to-brand-primary border border-brand-accent/50 ${className}`}>
            <div className="flex flex-col md:flex-row gap-6 items-center">
                <div className="p-4 bg-brand-accent/20 rounded-full">
                    <SparklesIcon className="w-10 h-10 text-brand-accent" />
                </div>
                <div className="flex-1">
                     <h3 className="text-xl font-bold mb-2 font-sans">Briefing Estratégico com I.A.</h3>
                     <p className="text-brand-text-secondary mb-4">Selecione um caso de alta complexidade para gerar um resumo executivo instantâneo.</p>
                     <div className="flex flex-col sm:flex-row gap-4">
                        <select 
                            value={selectedCaseId} 
                            onChange={(e) => setSelectedCaseId(e.target.value)}
                            className="w-full sm:w-1/2 bg-brand-primary border border-brand-secondary rounded-lg p-2 focus:ring-brand-accent focus:border-brand-accent font-body"
                        >
                            <option value="" disabled>Selecione um caso...</option>
                            {aiReadyCases.map(c => (
                                <option key={c.id} value={c.id}>{c.descricao}</option>
                            ))}
                        </select>
                        <button 
                            onClick={handleGenerate} 
                            disabled={!selectedCaseId || isLoading}
                            className="bg-brand-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-accent-hover transition-colors flex items-center justify-center gap-x-2 disabled:bg-brand-accent/50 disabled:cursor-not-allowed font-sans"
                        >
                            {isLoading ? <SpinnerIcon /> : <SparklesIcon />}
                            Gerar Briefing
                        </button>
                    </div>
                </div>
                 <div className="w-full md:w-1/2 min-h-[100px] bg-brand-primary/50 p-4 rounded-lg font-mono text-sm text-brand-text-secondary">
                    {isLoading && <p>Gerando briefing...</p>}
                    {briefing && <p className="whitespace-pre-wrap">{briefing}</p>}
                </div>
            </div>
        </Card>
    );
};


const RecentCases: React.FC<{ cases: CaseType[], className?: string }> = ({ cases, className }) => {
    const recentUnsolved = cases
        .filter(c => c.status !== 'resolvido' && c.status !== 'arquivada')
        .sort((a, b) => new Date(b.data_ocorrido).getTime() - new Date(a.data_ocorrido).getTime())
        .slice(0, 5);

    return (
        <Card className={className}>
            <h3 className="text-xl font-bold mb-4 font-sans">Casos Recentes Não Resolvidos</h3>
            <div className="space-y-4">
                {recentUnsolved.length > 0 ? recentUnsolved.map(c => (
                    <div key={c.id} className="flex justify-between items-center p-3 bg-brand-primary/50 rounded-lg">
                        <div>
                            <p className="font-semibold">{c.descricao}</p>
                            <p className="text-sm text-brand-text-secondary">{c.cidade} - {new Date(c.data_ocorrido).toLocaleDateString()}</p>
                        </div>
                        <Link to="/cases" className="text-brand-accent hover:underline">Detalhes</Link>
                    </div>
                )) : <p className="text-brand-text-secondary">Nenhum caso recente não resolvido.</p>}
            </div>
        </Card>
    );
};

const MostWanted: React.FC<{ suspects: SuspectWithCases[], className?: string }> = ({ suspects, className }) => {
    const mostWanted = [...suspects].sort((a, b) => b.pontuacao_perigo - a.pontuacao_perigo).slice(0, 3);
    
    return (
        <Card className={className}>
            <h3 className="text-xl font-bold mb-4 font-sans">Ranking "Mais Procurados"</h3>
            <div className="space-y-4">
                {mostWanted.map(s => (
                    <div key={s.id} className="flex items-center p-3 bg-brand-primary/50 rounded-lg">
                        <img src={s.foto} alt={s.apelido} className="w-12 h-12 rounded-full mr-4 bg-brand-primary" />
                        <div className="flex-1">
                            <div className="flex items-center gap-x-2">
                                <p className="font-bold text-lg">{s.apelido}</p>
                            </div>
                            <p className="text-sm text-brand-text-secondary">Pontuação de Perigo</p>
                        </div>
                        <div className="text-2xl font-bold text-danger">{s.pontuacao_perigo}</div>
                    </div>
                ))}
                <Link to="/suspects" className="flex items-center justify-end mt-4 text-brand-accent hover:underline font-semibold">
                    Ver todos <ArrowRightIcon />
                </Link>
            </div>
        </Card>
    );
};

const TopDetectives: React.FC<{ detectives: DetectiveWithStats[], className?: string }> = ({ detectives, className }) => {
    const topDetectives = [...detectives].sort((a, b) => b.successRate - a.successRate).slice(0, 2);

    return (
        <Card className={className}>
            <h3 className="text-xl font-bold mb-4 font-sans">Detetives em Destaque</h3>
            <div className="space-y-4">
                {topDetectives.map(d => (
                    <div key={d.id} className="flex items-center p-3 bg-brand-primary/50 rounded-lg">
                        <img src={d.foto} alt={d.nome} className="w-12 h-12 rounded-full mr-4" />
                        <div className="flex-1">
                            <p className="font-bold text-lg">{d.nome}</p>
                            <p className="text-sm text-brand-text-secondary">Taxa de Sucesso</p>
                        </div>
                        <div className="text-2xl font-bold text-success">{d.successRate}%</div>
                    </div>
                ))}
                 <Link to="/detectives" className="flex items-center justify-end mt-4 text-brand-accent hover:underline font-semibold">
                    Ver equipe <ArrowRightIcon />
                </Link>
            </div>
        </Card>
    );
};

const CasesBySeverityChart: React.FC<{ cases: CaseType[], className?: string }> = ({ cases, className }) => {
    const severityData = useMemo(() => {
        const counts: Record<CaseSeverity, number> = { 'Crítico': 0, 'Gravíssimo': 0, 'Grave': 0, 'Médio': 0, 'Baixo': 0 };
        cases.forEach(c => { counts[c.gravidade]++; });
        return Object.entries(counts).map(([name, value]) => ({ name: name as CaseSeverity, value }));
    }, [cases]);

    const maxCount = Math.max(...severityData.map(d => d.value), 1);
    const severityColors: Record<CaseSeverity, string> = { 'Crítico': 'bg-red-500', 'Gravíssimo': 'bg-orange-500', 'Grave': 'bg-yellow-500', 'Médio': 'bg-amber-500', 'Baixo': 'bg-lime-500' };

    const [tooltip, setTooltip] = useState<{ visible: boolean, content: string, x: number, y: number } | null>(null);

    const handleMouseMove = (e: React.MouseEvent, item: { name: CaseSeverity; value: number }) => {
        setTooltip({
            visible: true,
            content: `${item.name}: ${item.value}`,
            x: e.clientX,
            y: e.clientY
        });
    };

    const handleMouseLeave = () => {
        setTooltip(null);
    };

    return (
        <>
            {tooltip && (
                <div className="fixed z-50 px-2 py-1 text-xs bg-brand-primary rounded-md shadow-lg pointer-events-none transition-opacity duration-200"
                    style={{ top: tooltip.y + 15, left: tooltip.x + 15 }}>
                    {tooltip.content}
                </div>
            )}
            <Card className={className}>
                <h3 className="text-xl font-bold mb-4 font-sans">Casos por Gravidade</h3>
                <div className="space-y-3">
                    {severityData.map(item => (
                        <div key={item.name} className="flex items-center" onMouseMove={(e) => handleMouseMove(e, item)} onMouseLeave={handleMouseLeave}>
                            <div className="w-24 text-sm text-brand-text-secondary truncate">{item.name}</div>
                            <div className="flex-1 bg-brand-primary rounded-full h-6 mr-2">
                            <div className={`${severityColors[item.name]} h-6 rounded-full text-right pr-2 text-white font-bold text-sm transition-all duration-300`} style={{ width: `${(item.value / maxCount) * 100}%` }}/>
                            </div>
                            <div className="w-8 font-bold text-lg">{item.value}</div>
                        </div>
                    ))}
                </div>
            </Card>
        </>
    );
};

const CasesByStatusChart: React.FC<{ cases: CaseType[], className?: string }> = ({ cases, className }) => {
    const statusData = useMemo(() => {
        const counts: Record<CaseStatus, number> = { 'investigação': 0, 'reaberta': 0, 'resolvido': 0, 'arquivada': 0 };
        cases.forEach(c => { counts[c.status]++; });
        return Object.entries(counts).map(([name, value]) => ({ name: name as CaseStatus, value }));
    }, [cases]);
    
    const totalCases = cases.length;
    const statusColors: Record<CaseStatus, string> = { 'investigação': '#f59e0b', 'resolvido': '#84cc16', 'arquivada': '#6b7280', 'reaberta': '#f97316' };

    const [tooltip, setTooltip] = useState<{ visible: boolean, content: string, x: number, y: number } | null>(null);

    const handleMouseMove = (e: React.MouseEvent, item: { name: CaseStatus; value: number }) => {
        const percentage = totalCases > 0 ? ((item.value / totalCases) * 100).toFixed(1) : 0;
        setTooltip({
            visible: true,
            content: `${item.name}: ${item.value} (${percentage}%)`,
            x: e.clientX,
            y: e.clientY
        });
    };

    const handleMouseLeave = () => {
        setTooltip(null);
    };

    let accumulatedPercentage = 0;
    const gradientParts = statusData
        .filter(d => d.value > 0)
        .map(d => {
            const percentage = (d.value / totalCases) * 100;
            const start = accumulatedPercentage;
            accumulatedPercentage += percentage;
            const end = accumulatedPercentage;
            return `${statusColors[d.name]} ${start}% ${end}%`;
        }).join(', ');

    return (
        <>
            {tooltip && (
                <div className="fixed z-50 px-2 py-1 text-xs bg-brand-primary rounded-md shadow-lg pointer-events-none transition-opacity duration-200"
                    style={{ top: tooltip.y + 15, left: tooltip.x + 15 }}>
                    {tooltip.content}
                </div>
            )}
            <Card className={className}>
                <h3 className="text-xl font-bold mb-4 font-sans">Status dos Casos</h3>
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="relative w-40 h-40 rounded-full" style={{ background: `conic-gradient(${gradientParts})` }}>
                        <div className="absolute inset-2 bg-brand-secondary rounded-full flex items-center justify-center">
                        <span className="text-3xl font-bold">{totalCases}</span>
                        </div>
                    </div>
                    <div className="flex-1 space-y-2 w-full">
                        {statusData.map(item => (
                            <div key={item.name} className="flex items-center justify-between" onMouseMove={(e) => handleMouseMove(e, item)} onMouseLeave={handleMouseLeave}>
                                <div className="flex items-center">
                                    <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: statusColors[item.name] }}></span>
                                    <span className="capitalize text-brand-text-secondary">{item.name}</span>
                                </div>
                                <span className="font-bold">{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </>
    );
};


const DashboardPage: React.FC<{ data: ProcessedData | null }> = ({ data }) => {
    
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsMounted(true), 100);
        return () => clearTimeout(timer);
    }, []);

    if (!data) return null; // or a loading spinner

    const { stats, cases, suspeitos, detectives } = data;
    
    const animationClasses = (delay: string) => 
        `transition-all duration-700 ease-out ${isMounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${delay}`;

    return (
        <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StrategicBriefing cases={cases} className={animationClasses('delay-0')} />
                <KpiCard title="Total de Casos Ativos" value={stats.totalActiveCases} description="Investigação ou Reaberta" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>} className={animationClasses('delay-100')} />
                <KpiCard title="Casos Críticos" value={stats.criticalCases} description="Nível de gravidade máximo" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>} className={animationClasses('delay-200')} />
                <KpiCard title="Suspeitos Perigosos" value={stats.highDangerSuspects} description="Pontuação de perigo > 80" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>} className={animationClasses('delay-300')} />
                <KpiCard title="Tempo Médio de Atividade" value={`${stats.averageCaseAge} dias`} description="Média para casos ativos" icon={<TimelineIcon />} className={animationClasses('delay-400')} />
            </div>
             <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <CasesBySeverityChart cases={cases} className={`lg:col-span-1 ${animationClasses('delay-500')}`} />
                <CasesByStatusChart cases={cases} className={`lg:col-span-1 ${animationClasses('delay-600')}`} />
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <RecentCases cases={cases} className={`lg:col-span-2 ${animationClasses('delay-700')}`} />
                <div className={`space-y-6 ${animationClasses('delay-800')}`}>
                    <MostWanted suspects={suspeitos} />
                    <TopDetectives detectives={detectives} />
                </div>
            </div>
        </div>
    );
};

export default DashboardPage;