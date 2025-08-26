
import React, { useState, useMemo, useRef } from 'react';
import { ProcessedData, EvidenceWithCase, Evidence } from '../types';
import { Card } from '../components/ui';
import { CheckCircleIcon, XCircleIcon, SearchIcon, EditIcon, TrashIcon, ArrowUpIcon, ArrowDownIcon, SparklesIcon, SpinnerIcon, UploadIcon } from '../components/Icons';
import { generateTextWithImage } from '../lib/ai';


const fileToGenerativePart = async (file: File) => {
    const base64EncodedDataPromise = new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve((reader.result as string).split(',')[1]);
        reader.readAsDataURL(file);
    });
    return {
        inlineData: { data: await base64EncodedDataPromise, mimeType: file.type },
    };
};

const AIImageAnalyzer = () => {
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [prompt, setPrompt] = useState('Analise esta imagem de evidência. Identifique o objeto principal, possíveis marcas, modelos ou características únicas. Forneça um relatório preliminar conciso.');
    const [isLoading, setIsLoading] = useState(false);
    const [analysisResult, setAnalysisResult] = useState('');
    const [error, setError] = useState('');
    const [isDragging, setIsDragging] = useState(false);

    const handleFileChange = (files: FileList | null) => {
        if (files && files.length > 0) {
            setImageFile(files[0]);
            setAnalysisResult('');
            setError('');
        }
    };
    
    const handleDragOver = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(true); };
    const handleDrop = (e: React.DragEvent) => { e.preventDefault(); e.stopPropagation(); setIsDragging(false); handleFileChange(e.dataTransfer.files); };

    const handleAnalyze = async () => {
        if (!imageFile || !prompt) return;
        setIsLoading(true);
        setAnalysisResult('');
        setError('');
        try {
            const imagePart = await fileToGenerativePart(imageFile);
            const result = await generateTextWithImage(prompt, imagePart);
            setAnalysisResult(result);
        } catch (err) {
            setError('Falha ao analisar a imagem. Tente novamente.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card>
            <h2 className="text-2xl font-bold font-sans flex items-center gap-x-2 mb-4">
                <SparklesIcon /> Análise de Imagem com I.A.
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-4">
                     <div 
                        onDragOver={handleDragOver}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${isDragging ? 'border-brand-accent bg-brand-accent/10' : 'border-brand-secondary'}`}
                    >
                        <input type="file" id="image-upload" accept="image/*" className="hidden" onChange={(e) => handleFileChange(e.target.files)} />
                        <label htmlFor="image-upload" className="cursor-pointer">
                            <UploadIcon className="w-10 h-10 mx-auto text-brand-text-secondary" />
                            <p className="mt-2 text-brand-accent font-semibold">Selecione uma imagem</p>
                            <p className="text-xs text-brand-text-secondary">ou arraste e solte aqui</p>
                        </label>
                    </div>
                    {imageFile && <p className="text-sm text-center text-brand-text-secondary">Arquivo: {imageFile.name}</p>}
                    <textarea 
                        value={prompt}
                        onChange={(e) => setPrompt(e.target.value)}
                        placeholder="Insira seu prompt de análise aqui..."
                        className="w-full bg-brand-primary border border-brand-secondary rounded-lg p-3 focus:ring-brand-accent focus:border-brand-accent font-body h-32"
                    />
                     <button onClick={handleAnalyze} disabled={!imageFile || isLoading} className="w-full bg-brand-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-accent-hover transition-colors flex items-center justify-center gap-x-2 disabled:bg-brand-accent/50 disabled:cursor-not-allowed">
                        {isLoading ? <><SpinnerIcon /> Analisando...</> : <><SparklesIcon /> Analisar Imagem</>}
                    </button>
                </div>
                 <div className="bg-brand-primary/50 p-4 rounded-lg min-h-[300px] flex flex-col">
                    <h3 className="font-bold text-brand-accent mb-2">Relatório Preliminar</h3>
                    <div className="flex-grow overflow-y-auto font-mono text-sm text-brand-text-secondary whitespace-pre-wrap">
                        {isLoading && <p>Gerando relatório...</p>}
                        {error && <p className="text-danger">{error}</p>}
                        {analysisResult && <p>{analysisResult}</p>}
                        {!isLoading && !error && !analysisResult && <p>O relatório da análise aparecerá aqui.</p>}
                    </div>
                </div>
            </div>
        </Card>
    );
};

interface EvidencePageProps {
  data: ProcessedData;
  onAdd: () => void;
  onEdit: (evidence: Evidence) => void;
  onDelete: (evidence: EvidenceWithCase) => void;
}

const EvidencePage: React.FC<EvidencePageProps> = ({ data, onAdd, onEdit, onDelete }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortConfig, setSortConfig] = useState<{ key: keyof EvidenceWithCase; direction: 'ascending' | 'descending' }>({ key: 'id', direction: 'ascending' });

    const sortedAndFilteredEvidences = useMemo(() => {
        let filtered = data.evidences.filter(e => {
            const term = searchTerm.toLowerCase();
            return e.descricao.toLowerCase().includes(term) || e.local_encontrado.toLowerCase().includes(term);
        });

        if (sortConfig.key) {
            filtered.sort((a, b) => {
                const aValue = a[sortConfig.key];
                const bValue = b[sortConfig.key];
                if (aValue < bValue) return sortConfig.direction === 'ascending' ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === 'ascending' ? 1 : -1;
                return 0;
            });
        }
        return filtered;
    }, [data.evidences, searchTerm, sortConfig]);

    const requestSort = (key: keyof EvidenceWithCase) => {
        let direction: 'ascending' | 'descending' = 'ascending';
        if (sortConfig.key === key && sortConfig.direction === 'ascending') {
            direction = 'descending';
        }
        setSortConfig({ key, direction });
    };
    
    const getSortIndicator = (key: keyof EvidenceWithCase) => {
        if (sortConfig.key !== key) return null;
        return sortConfig.direction === 'ascending' ? <ArrowUpIcon /> : <ArrowDownIcon />;
    };

    const headers: { key: keyof EvidenceWithCase; label: string }[] = [
        { key: 'id', label: 'ID' },
        { key: 'descricao', label: 'Descrição' },
        { key: 'data_descoberta', label: 'Data Descoberta' },
        { key: 'local_encontrado', label: 'Local Encontrado' },
        { key: 'case', label: 'Caso Associado' },
        { key: 'analise_forense', label: 'Análise Forense' },
    ];

    return (
        <div className="space-y-8">
            <AIImageAnalyzer />
            <Card className="!p-0 overflow-hidden">
                <div className="p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h2 className="text-2xl font-bold font-sans">Gerenciamento de Evidências</h2>
                        <button onClick={onAdd} className="bg-brand-accent text-white font-semibold py-2 px-4 rounded-lg hover:bg-brand-accent-hover transition-colors">
                            Adicionar Evidência
                        </button>
                    </div>
                    <div className="relative mb-4">
                        <input
                            type="text"
                            placeholder="Buscar por descrição ou local..."
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
                            {sortedAndFilteredEvidences.map(e => (
                                <tr key={e.id} className="border-t border-brand-secondary hover:bg-brand-primary/50">
                                    <td className="p-4">{e.id}</td>
                                    <td className="p-4 max-w-xs truncate">{e.descricao}</td>
                                    <td className="p-4">{new Date(e.data_descoberta).toLocaleDateString()}</td>
                                    <td className="p-4">{e.local_encontrado}</td>
                                    <td className="p-4 text-brand-text-secondary">{e.case ? `#${e.case.id} - ${e.case.descricao}` : 'N/A'}</td>
                                    <td className="p-4">
                                        {e.analise_forense ? <CheckCircleIcon className="text-success" /> : <XCircleIcon />}
                                    </td>
                                    <td className="p-4">
                                        <div className="flex items-center gap-x-2">
                                            <button onClick={() => onEdit(e)} className="p-2 text-brand-text-secondary hover:text-white transition-colors" title="Editar"><EditIcon className="h-4 w-4" /></button>
                                            <button onClick={() => onDelete(e)} className="p-2 text-brand-text-secondary hover:text-danger transition-colors" title="Excluir"><TrashIcon className="h-4 w-4" /></button>
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

export default EvidencePage;
