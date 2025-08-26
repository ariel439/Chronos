
import React, { useState, useMemo } from 'react';
import { ProcessedData, VictimStats, VictimWithCase, RawVictim } from '../types';
import { Card, Tag } from '../components/ui';
import { ArrowUpIcon, ArrowDownIcon, SearchIcon, EditIcon, TrashIcon } from '../components/Icons';

const KpiCard: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
    <Card className="flex flex-col">
        <h3 className="text-lg font-semibold text-brand-text-secondary mb-3 font-sans">{title}</h3>
        <div className="flex-grow flex items-center justify-center">{children}</div>
    </Card>
);

const OccupationChart: React.FC<{ data: VictimStats['commonOccupations'] }> = ({ data }) => {
    const maxCount = Math.max(...data.map(d => d.count), 1);
    return (
        <Card className="col-span-1 md:col-span-2">
            <h3 className="text-lg font-semibold text-brand-text-secondary mb-4 font-sans">Ocupações Mais Comuns</h3>
            <div className="space-y-3">
                {data.map(item => (
                    <div key={item.name} className="flex items-center group">
                         <div className="w-1/3 text-sm text-brand-text-secondary text-right pr-4 truncate">{item.name}</div>
                         <div className="flex-1 bg-brand-primary rounded-full h-8">
                             <div
                                 className="bg-brand-accent h-8 rounded-full flex items-center justify-end pr-2 text-white font-bold text-sm transition-all duration-300 group-hover:bg-brand-accent-hover"
                                 style={{ width: `${(item.count / maxCount) * 100}%` }}
                                 title={`${item.name}: ${item.count}`}
                             >
                                 {item.count}
                             </div>
                         </div>
                    </div>
                ))}
            </div>
        </Card>
    );
};

const StatusDistributionChart: React.FC<{ data: VictimStats['statusDistribution'] }> = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.count, 0);
    const statusColors: Record<string, string> = { 'Viva': '#22c55e', 'Morta': '#ef4444', 'Desaparecida': '#f97316' };
    
    let accumulatedPercentage = 0;
    const gradientParts = data
        .filter(d => d.count > 0)
        .map(d => {
            const percentage = (d.count / total) * 100;
            const start = accumulatedPercentage;
            accumulatedPercentage += percentage;
            const end = accumulatedPercentage;
            return `${statusColors[d.name]} ${start}% ${end}%`;
        }).join(', ');

    return (
        <Card>
            <h3 className="text-lg font-semibold text-brand-text-secondary mb-4 font-sans">Distribuição de Status</h3>
            <div className="flex flex-col md:flex-row items-center gap-6">
                <div className="relative w-40 h-40 rounded-full" style={{ background: `conic-gradient(${gradientParts})` }}>
                    <div className="absolute inset-2 bg-brand-secondary rounded-full flex items-center justify-center">
                    <span className="text-3xl font-bold">{total}</span>
                    </div>
                </div>
                <div className="flex-1 space-y-2 w-full">
                    {data.map(item => (
                        <div key={item.name} className="flex items-center justify-between group" title={`${item.name}: ${item.count} (${(item.count/total*100).toFixed(1)}%)`}>
                            <div className="flex items-center">
                                <span className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: statusColors[item.name] }}></span>
                                <span className="capitalize text-brand-text-secondary">{item.name}</span>
                            </div>
                            <span className="font-bold">{item.count}</span>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
    );
};

interface VictimsPageProps {
  data: ProcessedData | null;
  onAdd: () => void;
  onEdit: (victim: RawVictim) => void;
  onDelete: (victim: VictimWithCase) => void;
}

const VictimsPage: React.FC<VictimsPageProps> = ({ data, onAdd, onEdit, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof VictimWithCase; direction: 'ascending' | 'descending' }>({ key: 'id', direction: 'ascending' });
    
    if (!data) return null;
    const { victimStats, victims } = data;

    const getStatusColorClass = (status: string) => {
        switch (status) {
            case 'Viva': return 'bg-green-500/20 text-green-300 border-green-500/30';
            case 'Morta': return 'bg-red-500/20 text-red-300 border-red-500/30';
            case 'Desaparecida': return 'bg-orange-500/20 text-orange-300 border-orange-500/30';
            default: return 'bg-gray-700';
        }
    };

    const sortedAndFilteredVictims = useMemo(() => {
        let sortableItems = victims.filter(v => {
            const term = searchTerm.toLowerCase();
            return v.nome.toLowerCase().includes(term) ||
                   v.ocupacao.toLowerCase().includes(term) ||
                   (v.case && v.case.descricao.toLowerCase().includes(term));
        });

        if (sortConfig.key) {
            sortableItems.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                if (typeof aValue === 'number' && typeof bValue === 'number') {
                    return sortConfig.direction === 'ascending' ? aValue - bValue : bValue - aValue;
                }
                if (typeof aValue === 'string' && typeof bValue === 'string') {
                    return sortConfig.direction === 'ascending' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
                }
                return 0;
            });
        }
        return sortableItems;
    }, [victims, sortConfig, searchTerm]);

    const requestSort = (key: keyof VictimWithCase) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key: keyof VictimWithCase) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'ascending' ? <ArrowUpIcon /> : <ArrowDownIcon />;
    };

    const headers: { key: keyof VictimWithCase; label: string }[] = [
        { key: 'nome', label: 'Nome da Vítima' },
        { key: 'idade', label: 'Idade' },
        { key: 'ocupacao', label: 'Ocupação' },
        { key: 'case', label: 'Caso Associado' },
        { key: 'status', label: 'Status' },
    ];

    return (
        <div className="space-y-8">
            <h2 className="text-3xl font-bold font-sans">Análise de Vítimas</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <OccupationChart data={victimStats.commonOccupations} />
                <div className="space-y-6">
                    <KpiCard title="Idade Média">
                        <div className="text-5xl font-bold text-brand-accent">{victimStats.averageAge}</div>
                    </KpiCard>
                    <StatusDistributionChart data={victimStats.statusDistribution} />
                </div>
            </div>

            <Card className="!p-0 overflow-hidden">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold font-sans">Registro Detalhado de Vítimas</h2>
                         <button onClick={onAdd} className="bg-brand-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-accent-hover transition-colors">
                            Adicionar Vítima
                        </button>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Buscar por nome, ocupação ou caso..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-brand-primary border border-brand-secondary rounded-lg p-3 pl-10 focus:ring-brand-accent focus:border-brand-accent font-body"
                        />
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <SearchIcon />
                        </div>
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-brand-primary">
                            <tr>
                                {headers.map(header => (
                                     <th key={header.key as string} className="p-4 cursor-pointer hover:bg-brand-secondary font-sans" onClick={() => header.key !== 'case' && requestSort(header.key)}>
                                        <div className="flex items-center gap-x-2">
                                            {header.label}
                                            {header.key !== 'case' && getSortIndicator(header.key)}
                                        </div>
                                    </th>
                                ))}
                                <th className="p-4 font-sans">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sortedAndFilteredVictims.map(victim => (
                                <tr key={victim.id} className="border-t border-brand-secondary hover:bg-brand-primary/50">
                                    <td className="p-4 font-medium">{victim.nome}</td>
                                    <td className="p-4">{victim.idade}</td>
                                    <td className="p-4">{victim.ocupacao}</td>
                                    <td className="p-4 text-brand-text-secondary">{victim.case ? victim.case.descricao : 'N/A'}</td>
                                    <td className="p-4"><Tag colorClass={getStatusColorClass(victim.status)}>{victim.status}</Tag></td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-x-2">
                                            <button onClick={() => onEdit(victim)} className="p-2 text-brand-text-secondary hover:text-white transition-colors" title="Editar"><EditIcon className="h-4 w-4" /></button>
                                            <button onClick={() => onDelete(victim)} className="p-2 text-brand-text-secondary hover:text-danger transition-colors" title="Excluir"><TrashIcon className="h-4 w-4" /></button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );
};

export default VictimsPage;
