

import React, { useState, useMemo, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ProcessedData, RawData, Case as CaseType, Victim, Witness, Evidence, RawVictim, Witness as WitnessType, Evidence as EvidenceType, Anexo, User, Suspect } from '../types';
import { Card, Tag, getStatusColor, getSeverityColor, getReliabilityColor, Modal, getAgingColor } from '../components/ui';
import { UsersIcon, EditIcon, TrashIcon, SparklesIcon, ChevronDownIcon, LinkIcon as FileLinkIcon, XCircleIcon, CheckCircleIcon, FlaskIcon, CasesIcon, NetworkIcon, PDFIcon, PrintIcon, DownloadIcon } from '../components/Icons';
import { aiSummaries } from '../data';

// --- PDF Preview Modal Component ---
// This component is defined in the same file to keep changes self-contained.
interface PDFPreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  aCase: CaseType;
}

const PDFSection: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className }) => (
    <div className={`mb-4 break-inside-avoid ${className}`}>
        <h2 className="text-sm font-bold border-b border-gray-400 pb-1 mb-2 uppercase tracking-wider">{title}</h2>
        {children}
    </div>
);

const PDFKeyValue: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
    <div className="flex mb-1">
        <p className="w-1/3 font-semibold text-xs flex-shrink-0">{label}:</p>
        <p className="w-2/3 text-xs">{value}</p>
    </div>
);

const PDFPreviewModal: React.FC<PDFPreviewModalProps> = ({ isOpen, onClose, aCase }) => {
    if (!isOpen) return null;

    const handlePrint = () => {
        window.print();
    };

    const handleDownload = () => {
        alert("A simulação de download do PDF seria iniciada aqui.");
    };

    const logoUrl = 'https://i.imgur.com/ZPUbDku.png';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-center p-4 print:hidden" onClick={onClose} role="dialog" aria-modal="true">
            <style>
                {`
                    @media print {
                        body * {
                            visibility: hidden;
                        }
                        .pdf-printable, .pdf-printable * {
                            visibility: visible;
                        }
                        .pdf-printable {
                            position: absolute;
                            left: 0;
                            top: 0;
                            width: 100%;
                            height: auto;
                            margin: 0;
                            padding: 0;
                            box-shadow: none;
                            border: none;
                        }
                    }
                    @page {
                        size: A4;
                        margin: 1.5cm;
                    }
                `}
            </style>
            <div 
                className="bg-brand-primary rounded-xl shadow-2xl w-full max-w-5xl h-[95vh] flex flex-col overflow-hidden border border-brand-secondary"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="flex justify-between items-center p-4 border-b border-brand-secondary flex-shrink-0">
                    <h2 className="text-xl font-bold text-brand-text">Pré-visualização do Relatório</h2>
                    <div className="flex items-center gap-x-4">
                        <button onClick={handleDownload} className="flex items-center gap-x-2 text-brand-text hover:text-brand-accent">
                            <DownloadIcon className="h-5 w-5" /> Download
                        </button>
                        <button onClick={handlePrint} className="flex items-center gap-x-2 text-brand-text hover:text-brand-accent">
                            <PrintIcon className="h-5 w-5" /> Imprimir
                        </button>
                        <button onClick={onClose} className="text-brand-text-secondary hover:text-white transition-colors" aria-label="Fechar modal">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="flex-grow overflow-y-auto p-8 bg-brand-bg">
                    {/* A4 Page Simulation */}
                    <div className="mx-auto bg-white text-black font-serif shadow-2xl pdf-printable" style={{ width: '210mm', minHeight: '297mm', padding: '1.5cm' }}>
                        {/* Header */}
                        <header className="flex justify-between items-center border-b-2 border-black pb-4">
                            <div>
                                <h1 className="text-2xl font-bold">RELATÓRIO DE CASO</h1>
                                <p className="text-sm">CONFIDENCIAL</p>
                            </div>
                            <div className="flex items-center gap-x-2">
                                <img src={logoUrl} alt="Chronos Logo" className="h-12 w-12" />
                                <span className="font-bold">CHRONOS</span>
                            </div>
                        </header>

                        {/* Content */}
                        <main className="mt-6 text-xs leading-relaxed">
                            <PDFSection title="Resumo do Caso">
                                <PDFKeyValue label="ID do Caso" value={aCase.id} />
                                <PDFKeyValue label="Descrição" value={aCase.descricao} />
                                <PDFKeyValue label="Cidade" value={aCase.cidade} />
                                <PDFKeyValue label="Data do Ocorrido" value={new Date(aCase.data_ocorrido).toLocaleDateString()} />
                                <PDFKeyValue label="Status Atual" value={aCase.status} />
                                <PDFKeyValue label="Nível de Gravidade" value={aCase.gravidade} />
                            </PDFSection>
                            
                            {aiSummaries[aCase.id] && (
                                <PDFSection title="Análise Estratégica (I.A.)">
                                    <p className="text-xs italic">{aiSummaries[aCase.id]}</p>
                                </PDFSection>
                            )}

                            <PDFSection title="Detetives Designados">
                                {aCase.detetives.map(d => (
                                    <p key={d.id} className="text-xs">- {d.nome} ({d.cargo})</p>
                                ))}
                            </PDFSection>

                            <PDFSection title="Suspeitos Envolvidos">
                                {aCase.suspeitos.length > 0 ? aCase.suspeitos.map(s => (
                                    <p key={s.id} className="text-xs">- {s.apelido} ({s.nome})</p>
                                )) : <p className="text-xs italic">Nenhum suspeito formalmente vinculado.</p>}
                            </PDFSection>

                            <PDFSection title="Vítimas">
                                {aCase.vitimas.length > 0 ? aCase.vitimas.map(v => (
                                    <p key={v.id} className="text-xs">- {v.nome}, {v.idade} anos ({v.ocupacao})</p>
                                )) : <p className="text-xs italic">Nenhuma vítima registrada.</p>}
                            </PDFSection>

                             <PDFSection title="Testemunhas e Depoimentos">
                                {aCase.testemunhas.length > 0 ? aCase.testemunhas.map(w => (
                                    <div key={w.id} className="mb-2 break-inside-avoid">
                                        <p className="text-xs font-semibold">- {w.nome} (Confiabilidade: {w.confiabilidade})</p>
                                        <div className="pl-4">
                                            {w.depoimentos.map((d, i) => <p key={i} className="text-xs italic">"{d}"</p>)}
                                        </div>
                                    </div>
                                )) : <p className="text-xs italic">Nenhuma testemunha registrada.</p>}
                            </PDFSection>
                            
                             <PDFSection title="Evidências Coletadas">
                                {aCase.evidencias.length > 0 ? aCase.evidencias.map(e => (
                                    <p key={e.id} className="text-xs">- {e.descricao} (Encontrada em: {e.local_encontrado} em {new Date(e.data_descoberta).toLocaleDateString()})</p>
                                )) : <p className="text-xs italic">Nenhuma evidência registrada.</p>}
                            </PDFSection>
                        </main>

                        {/* Footer */}
                        <footer className="text-center text-gray-500 text-[10px] pt-4 mt-auto border-t border-gray-300">
                             Divisão de Crimes Complexos - Documento Gerado em {new Date().toLocaleString()}
                        </footer>
                    </div>
                </div>
            </div>
        </div>
    );
};


const EntityCard: React.FC<{
  title: string;
  children: React.ReactNode;
  onAdd?: () => void;
  addLabel?: string;
  className?: string;
  disabled?: boolean;
}> = ({ title, children, onAdd, addLabel="Adicionar", className = "", disabled=false }) => (
    <Card className={`flex flex-col ${className}`}>
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-bold font-sans">{title}</h3>
            {onAdd && (
                 <button 
                    onClick={onAdd} 
                    disabled={disabled}
                    className="bg-brand-accent/20 text-brand-accent font-semibold py-1 px-3 rounded-lg hover:bg-brand-accent/40 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                 >
                    {addLabel}
                </button>
            )}
        </div>
        <div className="space-y-3 max-h-60 overflow-y-auto pr-2 flex-grow">
            {children}
        </div>
    </Card>
);

const EntityRow: React.FC<{
    entity: any;
    onUnlink?: (id: number) => void;
    onEdit?: (entity: any) => void;
    onDelete?: (entity: any) => void;
    canEdit: boolean;
}> = ({ entity, onUnlink, onEdit, onDelete, canEdit }) => (
    <div className="flex items-center bg-brand-primary/50 p-2 rounded-lg justify-between group">
        <div className="flex items-center">
            {entity.foto && <img src={entity.foto} alt={entity.nome} className="w-10 h-10 rounded-full mr-3" />}
            <div>
                <p className="font-semibold">{entity.nome || entity.descricao} {entity.apelido ? `(${entity.apelido})` : ''}</p>
                {entity.cargo && <p className="text-xs text-brand-text-secondary">{entity.cargo}</p>}
                {entity.ocupacao && <p className="text-xs text-brand-text-secondary">{entity.ocupacao}</p>}
                {entity.local_encontrado && <p className="text-xs text-brand-text-secondary">{entity.local_encontrado}</p>}
            </div>
        </div>
        {canEdit && (
            <div className="flex items-center gap-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                {onEdit && <button onClick={() => onEdit(entity)} className="p-2 text-brand-text-secondary hover:text-white" title="Editar"><EditIcon className="h-4 w-4" /></button>}
                {onUnlink && <button onClick={() => onUnlink(entity.id)} className="p-2 text-brand-text-secondary hover:text-danger" title="Desvincular do caso"><TrashIcon className="h-4 w-4" /></button>}
                {onDelete && <button onClick={() => onDelete(entity)} className="p-2 text-brand-text-secondary hover:text-danger" title="Excluir permanentemente"><TrashIcon className="h-4 w-4" /></button>}
            </div>
        )}
    </div>
);


const AddEntitySelect = ({ options, onAdd, entityTypeLabel, disabled }: { options: any[], onAdd: (id: number) => void, entityTypeLabel: string, disabled: boolean }) => {
    const [selectedId, setSelectedId] = useState('');

    const handleAdd = () => {
        if (selectedId) {
            onAdd(parseInt(selectedId, 10));
            setSelectedId('');
        }
    };
    
    return (
        <div className="mt-4 flex gap-2">
            <select
                value={selectedId}
                onChange={(e) => setSelectedId(e.target.value)}
                disabled={disabled}
                className="w-full bg-brand-secondary border border-slate-600 rounded-md p-2 text-brand-text text-sm disabled:opacity-50"
            >
                <option value="" disabled>Selecione um {entityTypeLabel}...</option>
                {options.map(option => (
                    <option key={option.id} value={option.id}>{option.nome} {option.apelido ? `(${option.apelido})` : ''}</option>
                ))}
            </select>
            <button onClick={handleAdd} disabled={!selectedId || disabled} className="bg-brand-accent text-white font-semibold py-1 px-3 rounded-lg hover:bg-brand-accent-hover transition-colors text-sm whitespace-nowrap disabled:bg-brand-accent/50 disabled:cursor-not-allowed">
                Vincular
            </button>
        </div>
    );
};

const WitnessDetailRow: React.FC<{
    witness: Witness & { depoimentos: string[] };
    onEdit: (witness: Witness & { depoimentos: string[] }) => void;
    onDelete: (witness: Witness & { depoimentos: string[] }) => void;
    canEdit: boolean;
}> = ({ witness, onEdit, onDelete, canEdit }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="bg-brand-primary/50 p-3 rounded-lg group">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setIsExpanded(!isExpanded)}>
                <div>
                    <p className="font-semibold">{witness.nome}</p>
                    <div className="flex items-center gap-x-2 mt-1">
                        <Tag colorClass={getReliabilityColor(witness.confiabilidade)}>
                            Confiabilidade: {witness.confiabilidade}
                        </Tag>
                    </div>
                </div>
                <div className="flex items-center gap-x-2">
                    {canEdit && <div className="flex items-center gap-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={(e) => { e.stopPropagation(); onEdit(witness); }} className="p-2 text-brand-text-secondary hover:text-white" title="Editar"><EditIcon className="h-4 w-4" /></button>
                        <button onClick={(e) => { e.stopPropagation(); onDelete(witness); }} className="p-2 text-brand-text-secondary hover:text-danger" title="Excluir permanentemente"><TrashIcon className="h-4 w-4" /></button>
                    </div>}
                    <ChevronDownIcon className={`h-5 w-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                </div>
            </div>
            {isExpanded && (
                <div className="mt-3 pt-3 border-t border-brand-secondary/50">
                    <h4 className="font-semibold text-sm text-brand-accent mb-2">Depoimentos:</h4>
                    <ul className="space-y-2 list-disc list-inside pl-2 text-sm text-brand-text-secondary">
                        {witness.depoimentos.map((depo, index) => (
                            <li key={index} className="italic">"{depo}"</li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const AnexoCard: React.FC<{ anexo: Anexo; onDelete: (id: string) => void, canDelete: boolean }> = ({ anexo, onDelete, canDelete }) => {
    const getIcon = () => {
        switch(anexo.type) {
            case 'pdf': return <FileLinkIcon />;
            case 'audio': return <FileLinkIcon />; // Placeholder, replace with better icon if available
            case 'image': return <FileLinkIcon />; // Placeholder
        }
    };
    return (
        <div className="flex items-center justify-between bg-brand-primary/50 p-2 rounded-lg group">
            <div className="flex items-center gap-x-3">
                <div className="text-brand-accent">{getIcon()}</div>
                <div>
                    <p className="font-semibold text-sm">{anexo.name}</p>
                    <p className="text-xs text-brand-text-secondary">Adicionado por {anexo.addedBy} em {new Date(anexo.timestamp).toLocaleDateString()}</p>
                </div>
            </div>
            {canDelete && <button onClick={() => onDelete(anexo.id)} className="p-2 text-brand-text-secondary hover:text-danger opacity-0 group-hover:opacity-100 transition-opacity" title="Remover anexo"><XCircleIcon /></button>}
        </div>
    );
};

const UploadModal: React.FC<{ isOpen: boolean, onClose: () => void, onUpload: (anexo: Anexo) => void, currentUser: User }> = ({ isOpen, onClose, onUpload, currentUser }) => {
    const [isUploading, setIsUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [file, setFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const dropRef = useRef<HTMLDivElement>(null);

    const handleFileChange = (files: FileList | null) => {
        if (files && files.length > 0) {
            setFile(files[0]);
        }
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(true);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        handleFileChange(e.dataTransfer.files);
    };

    const handleUploadClick = () => {
        if (!file) return;
        setIsUploading(true);
        setProgress(0);
        // Simulate upload progress
        const interval = setInterval(() => {
            setProgress(prev => {
                const newProgress = prev + 10;
                if (newProgress >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        const newAnexo: Anexo = {
                            id: `anx${Date.now()}`,
                            name: file.name,
                            type: file.type.startsWith('image/') ? 'image' : file.type === 'application/pdf' ? 'pdf' : 'audio',
                            thumbnail: '',
                            addedBy: currentUser.name,
                            timestamp: new Date().toISOString()
                        };
                        onUpload(newAnexo);
                        setIsUploading(false);
                        setFile(null);
                        onClose();
                    }, 300);
                    return 100;
                }
                return newProgress;
            });
        }, 100);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Adicionar Anexo">
            <div 
                ref={dropRef}
                onDragOver={handleDragOver}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-lg p-10 text-center transition-colors ${isDragging ? 'border-brand-accent bg-brand-accent/10' : 'border-brand-secondary'}`}
            >
                <input
                    type="file"
                    id="file-upload"
                    className="hidden"
                    onChange={(e) => handleFileChange(e.target.files)}
                />
                <label htmlFor="file-upload" className="cursor-pointer text-brand-accent hover:underline font-semibold">
                    Selecione um arquivo
                </label>
                <p className="text-brand-text-secondary mt-2">ou arraste e solte aqui</p>
            </div>
            {file && !isUploading && (
                 <div className="mt-4 p-3 bg-brand-secondary rounded-lg flex justify-between items-center">
                    <p className="text-brand-text">Arquivo selecionado: {file.name}</p>
                    <button onClick={handleUploadClick} className="bg-brand-accent text-white font-semibold py-1 px-3 rounded-lg">Upload</button>
                </div>
            )}
            {isUploading && (
                <div className="mt-4">
                    <div className="w-full bg-brand-secondary rounded-full h-2.5">
                        <div className="bg-brand-accent h-2.5 rounded-full" style={{ width: `${progress}%`, transition: 'width 0.1s linear' }}></div>
                    </div>
                    <p className="text-center text-sm text-brand-text-secondary mt-2">Enviando... {progress}%</p>
                </div>
            )}
        </Modal>
    );
};


interface CaseDetailPageProps {
  data: ProcessedData;
  rawData: RawData;
  setRawData: React.Dispatch<React.SetStateAction<RawData | null>>;
  currentUser: User;
  onOpenMap: (focalPoint: { type: 'case' | 'suspect', id: number }) => void;
  onEditWitness: (witness: Partial<WitnessType & { depoimentos: string[], id: number, caseId?: number }>) => void;
  onDeleteWitness: (witness: WitnessType & { depoimentos: string[] }) => void;
  onEditEvidence: (evidence: Partial<EvidenceType & { caseId?: number }>) => void;
  onDeleteEvidence: (evidence: EvidenceType) => void;
  onEditVictim: (victim: Partial<RawVictim & { caseId?: number }>) => void;
  onDeleteVictim: (victim: Victim) => void;
}

const CaseDetailPage: React.FC<CaseDetailPageProps> = ({ data, rawData, setRawData, currentUser, onOpenMap, onEditWitness, onDeleteWitness, onEditEvidence, onDeleteEvidence, onEditVictim, onDeleteVictim }) => {
  const { caseId } = useParams<{ caseId: string }>();
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  
  const aCase = useMemo(() => {
    if (!data || !caseId) return null;
    return data.cases.find(c => c.id === parseInt(caseId, 10));
  }, [data, caseId]);

  const caseTimelineEvents = useMemo(() => {
    if (!aCase) return [];
    
    const events: {date: string; type: 'Ocorrência' | 'Evidência' | 'Anexo'; description: string}[] = [];

    // Case Occurrence
    events.push({
        date: aCase.data_ocorrido,
        type: 'Ocorrência',
        description: `Início do caso: ${aCase.descricao}`
    });

    // Evidence Discovery
    aCase.evidencias.forEach(e => {
        events.push({
            date: e.data_descoberta,
            type: 'Evidência',
            description: `Evidência: ${e.descricao}`
        });
    });

    // Annexes Added
    (aCase.anexos || []).forEach(a => {
        events.push({
            date: a.timestamp,
            type: 'Anexo',
            description: `Anexo: ${a.name}`
        });
    });
    
    // Sort events
    return events.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [aCase]);

  if (!aCase || !rawData) {
    return (
      <div className="text-center p-8">
        <h2 className="text-2xl font-bold">Caso não encontrado</h2>
        <Link to="/cases" className="text-brand-accent hover:underline mt-4 inline-block">Voltar para a lista de casos</Link>
      </div>
    );
  }

  const handleLink = (entityType: 'detective' | 'suspect', entityId: number) => {
    const joinTable = entityType === 'detective' ? 'casos_detetives' : 'casos_suspeitos';
    const idField = entityType === 'detective' ? 'id_detetive' : 'id_suspeito';

    setRawData(prev => {
        if (!prev) return null;
        const newLink = { id_caso: aCase.id, [idField]: entityId };
        // @ts-ignore
        const currentLinks = prev[joinTable];
        if (currentLinks.some(l => l.id_caso === aCase.id && l[idField] === entityId)) return prev;
        return {
            ...prev,
            // @ts-ignore
            [joinTable]: [...currentLinks, newLink],
        };
    });
  };
  
  const handleUnlink = (entityType: 'detective' | 'suspect' | 'victim', entityId: number) => {
    let joinTable: keyof RawData;
    let idField: string;

    switch(entityType) {
        case 'detective':
            joinTable = 'casos_detetives';
            idField = 'id_detetive';
            break;
        case 'suspect':
            joinTable = 'casos_suspeitos';
            idField = 'id_suspeito';
            break;
        case 'victim':
            joinTable = 'casos_vitimas';
            idField = 'id_vitima';
            break;
    }

    setRawData(prev => {
        if (!prev) return null;
        // @ts-ignore
        const updatedLinks = prev[joinTable].filter(link => !(link.id_caso === aCase.id && link[idField] === entityId));
        return { ...prev, [joinTable]: updatedLinks };
    });
  };

  const handleAnexoUpload = (newAnexo: Anexo) => {
    setRawData(prev => {
        if (!prev) return null;
        const updatedCases = prev.casesRaw.map(c => {
            if (c.id === aCase.id) {
                return { ...c, anexos: [...(c.anexos || []), newAnexo] };
            }
            return c;
        });
        return { ...prev, casesRaw: updatedCases };
    });
  };

  const handleAnexoDelete = (anexoId: string) => {
    setRawData(prev => {
        if (!prev) return null;
        const updatedCases = prev.casesRaw.map(c => {
            if (c.id === aCase.id) {
                return { ...c, anexos: (c.anexos || []).filter(anexo => anexo.id !== anexoId) };
            }
            return c;
        });
        return { ...prev, casesRaw: updatedCases };
    });
  };


  const availableDetectives = rawData.detectivesRaw.filter(d => !aCase.detetives.some(cd => cd.id === d.id));
  const availableSuspects = rawData.suspectsRaw.filter(s => !aCase.suspeitos.some(cs => cs.id === s.id));

  const canEdit = currentUser.role === 'Delegada Chefe' || currentUser.role === 'Detetive';

  const timelineIcons: Record<string, React.ReactElement<{ className?: string }>> = {
    'Ocorrência': <CasesIcon />,
    'Evidência': <FlaskIcon />,
    'Anexo': <FileLinkIcon />,
  };
  const timelineIconColors: Record<string, string> = {
    'Ocorrência': 'text-orange-400',
    'Evidência': 'text-sky-400',
    'Anexo': 'text-lime-400',
  };
  const timelineColors: Record<string, string> = {
    'Ocorrência': 'bg-orange-500',
    'Evidência': 'bg-sky-500',
    'Anexo': 'bg-lime-500',
  };


  return (
    <div className="space-y-6">
       <UploadModal isOpen={isUploadModalOpen} onClose={() => setIsUploadModalOpen(false)} onUpload={handleAnexoUpload} currentUser={currentUser} />
       <PDFPreviewModal isOpen={isPdfModalOpen} onClose={() => setIsPdfModalOpen(false)} aCase={aCase} />
      {/* Header */}
      <div>
        <Link to="/cases" className="text-brand-accent hover:underline mb-2 inline-block">&larr; Voltar para todos os casos</Link>
        <div className="flex justify-between items-start">
            <div>
                <h1 className="text-3xl font-bold font-sans">{aCase.descricao}</h1>
                <p className="text-brand-text-secondary">Caso #{aCase.id} &bull; {aCase.cidade} &bull; {new Date(aCase.data_ocorrido).toLocaleDateString()}</p>
            </div>
            <div className="flex items-center gap-x-2">
                 <button onClick={() => setIsPdfModalOpen(true)} className="flex items-center gap-x-2 bg-brand-accent/20 text-brand-accent font-semibold py-2 px-3 rounded-lg hover:bg-brand-accent/40 transition-colors text-sm" title="Gerar Relatório PDF">
                    <PDFIcon className="h-5 w-5" />
                    <span>Gerar Relatório</span>
                </button>
                <button onClick={() => onOpenMap({ type: 'case', id: aCase.id })} className="flex items-center gap-x-2 bg-brand-accent/20 text-brand-accent font-semibold py-2 px-3 rounded-lg hover:bg-brand-accent/40 transition-colors text-sm" title="Ver Mapa de Relações do Caso">
                    <NetworkIcon className="h-5 w-5" />
                    <span>Ver Mapa</span>
                </button>
            </div>
        </div>
        {aCase.isCriminalCell && <div className="mt-2 flex items-center gap-x-2 text-orange-400 font-semibold"><UsersIcon /> Célula Criminosa Identificada</div>}
      </div>

      {aiSummaries[aCase.id] && (
        <Card className="!bg-gradient-to-r from-brand-secondary to-brand-primary border border-brand-accent/50">
          <div className="flex gap-x-4 items-center">
            <SparklesIcon className="h-8 w-8 text-brand-accent" />
            <div>
              <h3 className="text-lg font-bold font-sans">Resumo Estratégico da I.A.</h3>
              <p className="text-sm text-brand-text-secondary font-mono">{aiSummaries[aCase.id]}</p>
            </div>
          </div>
        </Card>
      )}

      {/* Main Content */}
      <div className="space-y-6">
        {/* Row 1: Detectives & Suspects */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EntityCard title="Detetives Envolvidos">
                {aCase.detetives.map(d => <EntityRow key={d.id} entity={d} onUnlink={() => handleUnlink('detective', d.id)} canEdit={canEdit} />)}
                <AddEntitySelect options={availableDetectives} onAdd={(id) => handleLink('detective', id)} entityTypeLabel="detetive" disabled={!canEdit} />
            </EntityCard>
            <EntityCard title="Suspeitos">
                {aCase.suspeitos.map((s: Suspect) => (
                     <div key={s.id} className="flex items-center bg-brand-primary/50 p-2 rounded-lg justify-between group">
                        <Link to={`/suspects/${s.id}`} className="flex items-center flex-grow min-w-0">
                            {s.foto && <img src={s.foto} alt={s.nome} className="w-10 h-10 rounded-full mr-3 flex-shrink-0" />}
                            <div className="min-w-0">
                                <p className="font-semibold truncate">{s.apelido}</p>
                                <p className="text-xs text-brand-text-secondary truncate">{s.nome}</p>
                            </div>
                        </Link>
                         <div className="flex items-center gap-x-1 opacity-100 sm:opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ml-2">
                             <button onClick={(e) => { e.stopPropagation(); onOpenMap({ type: 'suspect', id: s.id }); }} className="p-2 text-brand-text-secondary hover:text-white" title="Ver Mapa de Relações do Suspeito">
                                <NetworkIcon className="h-4 w-4" />
                            </button>
                            {canEdit && (
                                <button onClick={(e) => { e.stopPropagation(); handleUnlink('suspect', s.id); }} className="p-2 text-brand-text-secondary hover:text-danger" title="Desvincular do caso">
                                    <TrashIcon className="h-4 w-4" />
                                </button>
                            )}
                        </div>
                    </div>
                ))}
                <AddEntitySelect options={availableSuspects} onAdd={(id) => handleLink('suspect', id)} entityTypeLabel="suspeito" disabled={!canEdit} />
            </EntityCard>
        </div>
        
        {/* Row 2: Evidence & Attachments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <EntityCard title="Evidências" onAdd={() => onEditEvidence({ caseId: aCase.id })} disabled={!canEdit}>
                {aCase.evidencias.map(e => (
                     <div key={e.id} className="flex items-center bg-brand-primary/50 p-2 rounded-lg justify-between group">
                        <div>
                            <p className="font-semibold text-sm">{e.descricao}</p>
                            <div className="flex items-center gap-x-2 text-xs text-brand-text-secondary">
                                <span>{e.local_encontrado}</span>
                                {e.analise_forense ? <CheckCircleIcon className="h-4 w-4 text-success" /> : <XCircleIcon className="h-4 w-4 text-danger"/>}
                            </div>
                        </div>
                        {canEdit && <div className="flex items-center gap-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => onEditEvidence({ ...e, caseId: aCase.id})} className="p-2 text-brand-text-secondary hover:text-white" title="Editar"><EditIcon className="h-4 w-4" /></button>
                            <button onClick={() => onDeleteEvidence(e)} className="p-2 text-brand-text-secondary hover:text-danger" title="Excluir"><TrashIcon className="h-4 w-4" /></button>
                        </div>}
                    </div>
                ))}
            </EntityCard>
            <EntityCard title="Anexos" onAdd={() => setIsUploadModalOpen(true)} disabled={!canEdit}>
                {aCase.anexos && aCase.anexos.length > 0 ? (
                    aCase.anexos.map(anexo => <AnexoCard key={anexo.id} anexo={anexo} onDelete={handleAnexoDelete} canDelete={canEdit} />)
                ) : (
                    <p className="text-brand-text-secondary text-sm">Nenhum anexo encontrado.</p>
                )}
            </EntityCard>
        </div>

        {/* Row 3: Victims & Witnesses */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <EntityCard title="Vítimas" onAdd={() => onEditVictim({ caseId: aCase.id })} disabled={!canEdit}>
                {aCase.vitimas.map(v => <EntityRow key={v.id} entity={v} onEdit={() => onEditVictim({ ...v, caseId: aCase.id})} onDelete={() => onDeleteVictim(v)} canEdit={canEdit} />)}
            </EntityCard>
            <EntityCard title="Testemunhas" onAdd={() => onEditWitness({ caseId: aCase.id })} disabled={!canEdit}>
                {aCase.testemunhas.map(w => <WitnessDetailRow key={w.id} witness={w} onEdit={() => onEditWitness({ ...w, caseId: aCase.id })} onDelete={() => onDeleteWitness(w)} canEdit={canEdit}/>)}
            </EntityCard>
        </div>

        {/* Row 4: Horizontal Timeline */}
        <Card>
            <h3 className="text-xl font-bold font-sans mb-6">Linha do Tempo do Caso</h3>
            <div className="w-full overflow-x-auto pb-4">
                <div className="relative inline-flex items-stretch py-10 px-8">
                    {/* Single Horizontal Line in the background */}
                    <div className="absolute top-1/2 left-0 -translate-y-1/2 w-full h-0.5 bg-brand-secondary z-0"></div>

                    {/* Map through events */}
                    {caseTimelineEvents.map((event, index) => (
                        <div key={index} className="flex flex-col items-center relative w-56 z-10">
                            
                            {/* Top half container */}
                            <div className="h-1/2 w-full flex flex-col justify-end items-center">
                                {index % 2 === 0 && (
                                    <>
                                        <div className="w-full text-center p-2">
                                            <div className="p-3 bg-brand-primary rounded-lg shadow-lg border border-brand-secondary inline-block min-w-[150px]">
                                                <p className="font-semibold text-sm flex items-center justify-center gap-x-1.5">
                                                    {React.cloneElement(timelineIcons[event.type], { className: `h-4 w-4 ${timelineIconColors[event.type]}` })}
                                                    <span>{new Date(event.date).toLocaleDateString()}</span>
                                                </p>
                                                <p className="text-xs text-brand-text-secondary mt-1">{event.description}</p>
                                            </div>
                                        </div>
                                        <div className="w-0.5 h-6 bg-brand-secondary"></div>
                                    </>
                                )}
                            </div>
                            
                            {/* Dot */}
                            <div className={`w-4 h-4 rounded-full border-4 border-brand-primary flex-shrink-0 ${timelineColors[event.type]}`}></div>
                            
                            {/* Bottom half container */}
                            <div className="h-1/2 w-full flex flex-col justify-start items-center">
                                {index % 2 !== 0 && (
                                    <>
                                        <div className="w-0.5 h-6 bg-brand-secondary"></div>
                                        <div className="w-full text-center p-2">
                                            <div className="p-3 bg-brand-primary rounded-lg shadow-lg border border-brand-secondary inline-block min-w-[150px]">
                                                <p className="font-semibold text-sm flex items-center justify-center gap-x-1.5">
                                                    {React.cloneElement(timelineIcons[event.type], { className: `h-4 w-4 ${timelineIconColors[event.type]}` })}
                                                    <span>{new Date(event.date).toLocaleDateString()}</span>
                                                </p>
                                                <p className="text-xs text-brand-text-secondary mt-1">{event.description}</p>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Card>
      </div>
    </div>
  );
};

export default CaseDetailPage;