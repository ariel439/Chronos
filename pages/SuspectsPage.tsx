


import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ProcessedData, SuspectWithCases, RawSuspect, UserRole } from '../types';
import { Card } from '../components/ui';
import { SearchIcon, EditIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon, EyeIcon } from '../components/Icons';

interface SuspectsPageProps {
  data: ProcessedData | null;
  currentUserRole: UserRole;
  onAdd: () => void;
  onEdit: (suspect: RawSuspect) => void;
  onDelete: (suspect: SuspectWithCases) => void;
}

const SuspectsPage: React.FC<SuspectsPageProps> = ({ data, currentUserRole, onAdd, onEdit, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof SuspectWithCases; direction: 'ascending' | 'descending' }>({ key: 'pontuacao_perigo', direction: 'descending' });

    if (!data) return null;

    const sortedAndFilteredSuspects = useMemo(() => {
        let filtered = data.suspeitos.filter(s => {
            const term = searchTerm.toLowerCase();
            return s.nome.toLowerCase().includes(term) || s.apelido.toLowerCase().includes(term);
        });

        if (sortConfig.key) {
            filtered.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];

                if (sortConfig.key === 'activeCases') {
                  const valA = a.activeCases.length;
                  const valB = b.activeCases.length;
                   if (valA < valB) return sortConfig.direction === 'ascending' ? -1 : 1;
                   if (valA > valB) return sortConfig.direction === 'ascending' ? 1 : -1;
                   return 0;
                }

                if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return filtered;
    }, [data.suspeitos, searchTerm, sortConfig]);
    
    const requestSort = (key: keyof SuspectWithCases) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };

    const getSortIndicator = (key: keyof SuspectWithCases) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'ascending' ? <ArrowUpIcon /> : <ArrowDownIcon />;
    };

    const canPerformActions = currentUserRole === 'Delegada Chefe' || currentUserRole === 'Detetive';

    const headers: { key: keyof SuspectWithCases; label: string }[] = [
        { key: 'apelido', label: 'Apelido' },
        { key: 'nome', label: 'Nome' },
        { key: 'pontuacao_perigo', label: 'Pontuação de Perigo' },
        { key: 'activeCases', label: 'Casos Ativos' },
    ];


    const DangerMeter = ({ score }: { score: number }) => {
        const percentage = score;
        const color = percentage > 80 ? 'bg-red-500' : percentage > 50 ? 'bg-orange-500' : 'bg-yellow-500';
        return (
            <div className="w-full bg-gray-700 rounded-full h-2.5 my-2">
                <div className={color} style={{ width: `${percentage}%`, height: '100%', borderRadius: 'inherit' }}></div>
            </div>
        );
    };


    return (
        <Card className="!p-0 overflow-hidden">
             <div className="p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold font-sans">Arquivo de Suspeitos</h2>
                    <button 
                      onClick={onAdd}
                      disabled={!canPerformActions}
                      className="bg-brand-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-accent-hover transition-colors disabled:bg-brand-accent/50 disabled:cursor-not-allowed"
                    >
                        Adicionar Suspeito
                    </button>
                </div>
                <div className="relative mb-4">
                    <input
                        type="text"
                        placeholder="Buscar por nome ou apelido..."
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
                            <th className="p-4 font-sans">Foto</th>
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
                        {sortedAndFilteredSuspects.map(s => (
                            <tr key={s.id} className="border-t border-brand-secondary hover:bg-brand-primary/50">
                                <td className="p-4">
                                    <img src={s.foto} alt={s.apelido} className="w-12 h-12 rounded-full" />
                                </td>
                                <td className="p-4 font-bold text-brand-accent">{s.apelido}</td>
                                <td className="p-4">{s.nome}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-x-3">
                                        <span className="font-bold text-lg text-red-400 w-8">{s.pontuacao_perigo}</span>
                                        <div className="w-24">
                                            <DangerMeter score={s.pontuacao_perigo} />
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">{s.activeCases.length}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-x-2">
                                        <Link to={`/suspects/${s.id}`} className="p-2 text-brand-text-secondary hover:text-white transition-colors" title="Ver Detalhes">
                                            <EyeIcon className="h-4 w-4" />
                                        </Link>
                                        <button onClick={() => onEdit(s)} disabled={!canPerformActions} className="p-2 text-brand-text-secondary hover:text-white transition-colors disabled:opacity-30 disabled:cursor-not-allowed" title="Editar"><EditIcon className="h-4 w-4" /></button>
                                        <button onClick={() => onDelete(s)} disabled={!canPerformActions} className="p-2 text-brand-text-secondary hover:text-danger transition-colors disabled:opacity-30 disabled:cursor-not-allowed" title="Excluir"><TrashIcon className="h-4 w-4" /></button>
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

export default SuspectsPage;