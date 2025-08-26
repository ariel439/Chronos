

import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Case as CaseType, CaseSeverity, CaseStatus, RawCase, UserRole } from '../types';
import { Card, Tag, getStatusColor, getSeverityColor, getAgingColor } from '../components/ui';
import { UsersIcon, SparklesIcon, ArrowUpIcon, ArrowDownIcon, SearchIcon, EditIcon, TrashIcon, EyeIcon } from '../components/Icons';
import { aiSummaries } from '../data';

interface CasesPageProps {
  cases: CaseType[];
  currentUserRole: UserRole;
  onAdd: () => void;
  onEdit: (aCase: RawCase) => void;
  onDelete: (aCase: CaseType) => void;
  onOpenMap: (caseId: number) => void;
}

const CasesPage: React.FC<CasesPageProps> = ({ cases, currentUserRole, onAdd, onEdit, onDelete, onOpenMap }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [filters, setFilters] = useState({ status: '', gravidade: '', cidade: '' });
    const [sortConfig, setSortConfig] = useState<{ key: keyof CaseType | 'tags'; direction: 'ascending' | 'descending' }>({ key: 'id', direction: 'ascending' });

    const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setFilters({ ...filters, [e.target.name]: e.target.value });
    };
    
    const uniqueCidades = useMemo(() => [...new Set(cases.map(c => c.cidade))].sort(), [cases]);
    
    const severityOrder: Record<CaseSeverity, number> = {
        'Crítico': 5,
        'Gravíssimo': 4,
        'Grave': 3,
        'Médio': 2,
        'Baixo': 1
    };

    const sortedAndFilteredCases = useMemo(() => {
        const lowercasedSearchTerm = searchTerm.toLowerCase();

        let filtered = cases.filter(c => {
            const matchesSearch = lowercasedSearchTerm === '' ||
                c.id.toString().includes(lowercasedSearchTerm) ||
                c.descricao.toLowerCase().includes(lowercasedSearchTerm) ||
                c.cidade.toLowerCase().includes(lowercasedSearchTerm);

            const matchesFilters = (filters.status ? c.status === filters.status : true) &&
                   (filters.gravidade ? c.gravidade === filters.gravidade : true) &&
                   (filters.cidade ? c.cidade === filters.cidade : true);

            return matchesSearch && matchesFilters;
        });

        if (sortConfig.key && sortConfig.key !== 'tags') {
            const sortKey = sortConfig.key;
            filtered.sort((a, b) => {
                if (sortKey === 'gravidade') {
                    const valA = severityOrder[a.gravidade];
                    const valB = severityOrder[b.gravidade];
                    if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
                    if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
                    return 0;
                }

                const aValue = a[sortKey as keyof CaseType];
                const bValue = b[sortKey as keyof CaseType];

                if (aValue < bValue) {
                    return sortConfig.direction === 'ascending' ? -1 : 1;
                }
                if (aValue > bValue) {
                    return sortConfig.direction === 'ascending' ? 1 : -1;
                }
                return 0;
            });
        }

        return filtered;
    }, [cases, filters, sortConfig, searchTerm]);

    const requestSort = (key: keyof CaseType | 'tags') => {
        if (key === 'tags') return; // Do not sort by tags column
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };
    
    const getSortIndicator = (key: keyof CaseType | 'tags') => {
      if (sortConfig.key !== key || key === 'tags') return null;
      return sortConfig.direction === 'ascending' ? <ArrowUpIcon /> : <ArrowDownIcon />;
    };

    const canPerformActions = currentUserRole === 'Delegada Chefe' || currentUserRole === 'Detetive';
    const canDelete = currentUserRole === 'Delegada Chefe';

    const headers: { key: keyof CaseType | 'tags'; label: string }[] = [
        { key: 'id', label: 'ID' },
        { key: 'descricao', label: 'Descrição' },
        { key: 'cidade', label: 'Cidade' },
        { key: 'data_ocorrido', label: 'Data' },
        { key: 'tempo_ativo_dias', label: 'Duração' },
        { key: 'gravidade', label: 'Gravidade' },
        { key: 'status', label: 'Status' },
    ];
    
    const formatDays = (days: number): string => {
        if (days < 30) return `${days} dia(s)`;
        if (days < 365) {
            const months = Math.floor(days / 30);
            return `${months} mes(es)`;
        }
        const years = Math.floor(days / 365);
        return `${years} ano(s)`;
    };


    return (
        <Card className="!p-0 overflow-hidden">
             <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold font-sans">Gerenciamento de Casos</h2>
                    <button 
                      onClick={onAdd} 
                      disabled={!canPerformActions}
                      className="bg-brand-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-accent-hover transition-colors disabled:bg-brand-accent/50 disabled:cursor-not-allowed"
                      title={!canPerformActions ? "Apenas Detetives e Chefes podem adicionar casos" : ""}
                    >
                        Adicionar Novo Caso
                    </button>
                </div>
                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Buscar por ID, descrição ou cidade..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full bg-brand-primary border border-brand-secondary rounded-lg p-3 pl-10 focus:ring-brand-accent focus:border-brand-accent font-body"
                    />
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <SearchIcon />
                    </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <select name="status" onChange={handleFilterChange} className="w-full bg-brand-primary border border-brand-secondary rounded-lg p-2 focus:ring-brand-accent focus:border-brand-accent font-body">
                        <option value="">Todos os Status</option>
                        {['investigação', 'resolvido', 'arquivada', 'reaberta'].map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                    </select>
                     <select name="gravidade" onChange={handleFilterChange} className="w-full bg-brand-primary border border-brand-secondary rounded-lg p-2 focus:ring-brand-accent focus:border-brand-accent font-body">
                        <option value="">Toda Gravidade</option>
                        {['Crítico', 'Gravíssimo', 'Grave', 'Médio', 'Baixo'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    <select name="cidade" onChange={handleFilterChange} className="w-full bg-brand-primary border border-brand-secondary rounded-lg p-2 focus:ring-brand-accent focus:border-brand-accent font-body">
                        <option value="">Todas as Cidades</option>
                        {uniqueCidades.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
            </div>
            
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-brand-primary">
                        <tr>
                            {headers.map(header => (
                                <th key={header.key as string} className="p-4 cursor-pointer hover:bg-brand-secondary font-sans" onClick={() => requestSort(header.key)}>
                                    <div className="flex items-center gap-x-2">
                                        {header.label}{getSortIndicator(header.key)}
                                    </div>
                                </th>
                            ))}
                            <th className="p-4 font-sans">Ações</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedAndFilteredCases.map(c => (
                            <tr key={c.id} className="border-t border-brand-secondary hover:bg-brand-primary/50">
                                <td className="p-4">{c.id}</td>
                                <td className="p-4 max-w-xs truncate">{c.descricao}</td>
                                <td className="p-4">{c.cidade}</td>
                                <td className="p-4">{new Date(c.data_ocorrido).toLocaleDateString()}</td>
                                <td className="p-4">
                                    {c.status === 'resolvido' ? (
                                        <Tag colorClass="bg-gray-500/20 text-gray-300 border-gray-500/30">
                                            Resolvido em {formatDays(c.tempo_ativo_dias)}
                                        </Tag>
                                    ) : c.status === 'arquivada' ? (
                                        <Tag colorClass="bg-gray-500/20 text-gray-300 border-gray-500/30">
                                            Arquivado há {formatDays(c.tempo_ativo_dias)}
                                        </Tag>
                                    ) : (
                                        <Tag colorClass={getAgingColor(c.tempo_ativo_dias)}>
                                            Ativo há {formatDays(c.tempo_ativo_dias)}
                                        </Tag>
                                    )}
                                </td>
                                <td className="p-4"><Tag colorClass={getSeverityColor(c.gravidade)}>{c.gravidade}</Tag></td>
                                <td className="p-4"><Tag colorClass={getStatusColor(c.status)}>{c.status}</Tag></td>
                                <td className="p-4">
                                    <div className="flex items-center gap-x-2">
                                        <Link to={`/cases/${c.id}`} className="p-2 text-brand-text-secondary hover:text-white transition-colors" title="Ver Detalhes">
                                            <EyeIcon className="h-4 w-4" />
                                        </Link>
                                        <button onClick={() => onEdit(c)} disabled={!canPerformActions} className="p-2 text-brand-text-secondary hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed" title="Editar"><EditIcon className="h-4 w-4" /></button>
                                        <button onClick={() => onDelete(c)} disabled={!canDelete || c.gravidade === 'Crítico'} className="p-2 text-brand-text-secondary hover:text-danger transition-colors disabled:opacity-30 disabled:cursor-not-allowed" title="Excluir"><TrashIcon className="h-4 w-4" /></button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </Card>
    );
};

export default CasesPage;