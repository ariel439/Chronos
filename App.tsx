import React, { useState, useEffect, useMemo, useRef } from 'react';
import { HashRouter, Routes, Route, NavLink, useLocation, Link } from 'react-router-dom';
import DashboardPage from './pages/DashboardPage';
import CasesPage from './pages/CasesPage';
import SuspectsPage from './pages/SuspectsPage';
import DetectivesPage from './pages/DetectivesPage';
import ForensePage from './pages/ForensePage';
import VictimsPage from './pages/VictimsPage';
import WitnessesPage from './pages/WitnessesPage';
import EvidencePage from './pages/EvidencePage';
import TimelinePage from './pages/TimelinePage';
import OthersPage from './pages/OthersPage';
import { RelationshipMapModal } from './pages/RelationshipMapPage';
import LoginPage from './pages/LoginPage';
import CaseDetailPage from './pages/CaseDetailPage';
import SuspectDetailPage from './pages/SuspectDetailPage';
import { processData, initialRawData, users } from './data';
import { User, Case as CaseType, ProcessedData, RawData, RawCase, SuspectWithCases, DetectiveWithStats, VictimWithCase, WitnessWithCaseCount, EvidenceWithCase, ForenseAnalysis, RawSuspect, RawDetective, RawVictim, Witness, Evidence, RawForenseAnalysis, Victim } from './types';
import { DashboardIcon, CasesIcon, SuspectsIcon, DetectivesIcon, FlaskIcon, MenuIcon, CloseIcon, SpinnerIcon, RefreshIcon, ChevronDownIcon, OthersIcon, SearchIcon, VictimsIcon, WitnessesIcon, EvidenceIcon } from './components/Icons';
import CaseFormModal from './pages/CaseFormModal';
import { ConfirmationModal, ToastContainer } from './components/ui';
import { SuspectFormModal, DetectiveFormModal, VictimFormModal, WitnessFormModal, EvidenceFormModal, ForenseAnalysisFormModal } from './pages/MoreFormModals';

const getPageTitle = (pathname: string): string => {
    const titles: Record<string, string> = {
        '/': 'Dashboard',
        '/cases': 'Casos',
        '/suspects': 'Suspeitos',
        '/detectives': 'Detetives',
        '/victims': 'Análise de Vítimas',
        '/witnesses': 'Quadro de Testemunhas',
        '/evidence': 'Locker de Evidências',
        '/forense': 'Lab Forense',
        '/timeline': 'Linha do Tempo Mestra',
        '/others': 'Central de Inteligência',
    };

    const pathSegments = pathname.split('/').filter(Boolean);
    const basePath = `/${pathSegments[0] || ''}`;
    
    return titles[basePath] || 'Painel de Controle';
};

interface SearchResult {
  type: 'Caso' | 'Suspeito' | 'Detetive' | 'Vítima' | 'Testemunha' | 'Evidência';
  label: string;
  path: string;
  icon: React.ReactNode;
}

const navLinks = [
  { path: '/', label: 'Dashboard', icon: <DashboardIcon /> },
  { path: '/cases', label: 'Casos', icon: <CasesIcon /> },
  { path: '/suspects', label: 'Suspeitos', icon: <SuspectsIcon /> },
  { path: '/detectives', label: 'Detetives', icon: <DetectivesIcon /> },
  { path: '/forense', label: 'Lab Forense', icon: <FlaskIcon /> },
  { path: '/others', label: 'Outros', icon: <OthersIcon /> },
];

const logoUrl = 'https://i.imgur.com/ZPUbDku.png';

const SidebarContent: React.FC<{
  isSidebarOpen: boolean;
  setIsSidebarOpen: (isOpen: boolean) => void;
}> = ({ isSidebarOpen, setIsSidebarOpen }) => (
    <div className="flex flex-col h-full">
      <div className="flex flex-col items-center justify-center gap-y-4 pt-8 pb-6 border-b border-brand-secondary">
        <div className="relative w-16 h-16 flex items-center justify-center">
          <div className="absolute inset-0 bg-brand-accent rounded-full shadow-[0_4px_15px_rgba(200,159,101,0.4)]"></div>
          <img src={logoUrl} alt="Chronos Logo" className="relative h-14 w-14 rounded-full object-cover" />
        </div>
        <h1 className="text-2xl font-bold tracking-widest text-brand-text font-sans">Chronos</h1>
      </div>
      <nav className="flex-grow p-4 space-y-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.path}
            to={link.path}
            onClick={() => isSidebarOpen && setIsSidebarOpen(false)}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'bg-brand-accent text-white shadow-lg'
                  : 'hover:bg-brand-secondary text-brand-text-secondary'
              }`
            }
          >
            {link.icon}
            <span className="ml-4 font-medium">{link.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="p-4 border-t border-brand-secondary text-center text-xs text-brand-text-secondary">
        <p>&copy; 2024 Divisão de Crimes Complexos</p>
      </div>
    </div>
);

const Header: React.FC<{
    isSidebarOpen: boolean;
    setIsSidebarOpen: (isOpen: boolean) => void;
    searchTerm: string;
    onSearchChange: (term: string) => void;
    searchResults: SearchResult[];
    clearSearch: () => void;
    searchContainerRef: React.RefObject<HTMLDivElement>;
    userMenuRef: React.RefObject<HTMLDivElement>;
    currentUser: User;
    isUserMenuOpen: boolean;
    setIsUserMenuOpen: (isOpen: boolean) => void;
    setCurrentUser: (user: User) => void;
    setIsResetModalOpen: (isOpen: boolean) => void;
}> = ({
    isSidebarOpen,
    setIsSidebarOpen,
    searchTerm,
    onSearchChange,
    searchResults,
    clearSearch,
    searchContainerRef,
    userMenuRef,
    currentUser,
    isUserMenuOpen,
    setIsUserMenuOpen,
    setCurrentUser,
    setIsResetModalOpen
}) => {
    const location = useLocation();
    const title = getPageTitle(location.pathname);
    
    const groupedResults = searchResults.reduce((acc, result) => {
        (acc[result.type] = acc[result.type] || []).push(result);
        return acc;
    }, {} as Record<SearchResult['type'], SearchResult[]>);

    return (
      <header className="bg-brand-primary/80 backdrop-blur-sm sticky top-0 z-20 flex items-center justify-between h-20 px-6 border-b border-brand-secondary gap-x-6">
        <div className="flex items-center flex-shrink-0">
            <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className="p-2 mr-4 md:hidden text-brand-text-secondary hover:text-white"
            >
                <MenuIcon />
            </button>
            <h1 className="text-2xl font-bold text-brand-text font-sans hidden sm:block">{title}</h1>
        </div>

        {/* Global Search */}
        <div ref={searchContainerRef} className="relative w-full max-w-xl">
             <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon />
                </div>
                <input
                    type="text"
                    placeholder="Pesquisar em todo o sistema..."
                    value={searchTerm}
                    onChange={(e) => onSearchChange(e.target.value)}
                    className="w-full bg-brand-secondary border border-brand-primary rounded-lg p-2.5 pl-10 focus:ring-2 focus:ring-brand-accent focus:border-brand-accent font-body transition-colors"
                />
            </div>
            {searchTerm.length > 1 && (
                <div className="absolute top-full mt-2 w-full bg-brand-secondary rounded-lg shadow-2xl border border-brand-primary z-30 max-h-96 overflow-y-auto">
                   {searchResults.length > 0 ? (
                        Object.entries(groupedResults).map(([type, items]) => (
                            <div key={type} className="p-2">
                                <h4 className="text-xs font-bold uppercase text-brand-text-secondary px-3 py-1">{type}</h4>
                                <ul>
                                    {items.map((item, index) => (
                                        <li key={`${type}-${index}`}>
                                            <Link 
                                                to={item.path} 
                                                onClick={clearSearch}
                                                className="flex items-center gap-x-3 w-full px-3 py-2 text-sm text-brand-text hover:bg-brand-primary rounded-md transition-colors"
                                            >
                                                <span className="text-brand-accent">{item.icon}</span>
                                                <span className="truncate">{item.label}</span>
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        ))
                   ) : (
                       <div className="p-4 text-center text-sm text-brand-text-secondary">Nenhum resultado encontrado.</div>
                   )}
                </div>
            )}
        </div>

        <div className="relative" ref={userMenuRef}>
            <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center gap-x-3 p-2 rounded-lg hover:bg-brand-secondary transition-colors flex-shrink-0"
            >
                <img
                    className="w-10 h-10 rounded-full object-cover"
                    src={currentUser.avatar}
                    alt="User Avatar"
                />
                <div className="text-left hidden md:block">
                  <p className="font-semibold text-sm">{currentUser.name}</p>
                  <p className="text-xs text-brand-text-secondary">{currentUser.roleName}</p>
                </div>
                <ChevronDownIcon className="h-5 w-5 text-brand-text-secondary hidden md:block"/>
            </button>
            {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-brand-secondary rounded-md shadow-lg py-1 z-30 ring-1 ring-black ring-opacity-5">
                    <div className="px-4 py-2 text-xs text-brand-text-secondary">Mudar de Perfil</div>
                    {users.map(user => (
                       <button
                          key={user.id}
                          onClick={() => {
                            setCurrentUser(user);
                            setIsUserMenuOpen(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-brand-text hover:bg-brand-primary transition-colors"
                        >
                            <img src={user.avatar} alt={user.name} className="w-6 h-6 rounded-full mr-2"/>
                            <span>{user.name} ({user.roleName})</span>
                        </button>
                    ))}
                    <div className="border-t border-brand-primary my-1"></div>
                    <button
                        onClick={() => {
                            setIsResetModalOpen(true);
                            setIsUserMenuOpen(false);
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-brand-text hover:bg-brand-primary transition-colors"
                    >
                        <RefreshIcon className="w-4 h-4 mr-2" />
                        Resetar Dados
                    </button>
                </div>
            )}
        </div>
      </header>
    );
};

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User>(users[0]);

  // State Management for all app data
  const [rawData, setRawData] = useState<RawData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  // Interaction State
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  
  // Global Search State
  const [globalSearchTerm, setGlobalSearchTerm] = useState('');
  const [globalSearchResults, setGlobalSearchResults] = useState<SearchResult[]>([]);
  const searchContainerRef = useRef<HTMLDivElement>(null);


  // Modal States
  const [caseToEdit, setCaseToEdit] = useState<Partial<RawCase> | null>(null);
  const [caseToDelete, setCaseToDelete] = useState<CaseType | null>(null);
  const [suspectToEdit, setSuspectToEdit] = useState<Partial<RawSuspect> | null>(null);
  const [suspectToDelete, setSuspectToDelete] = useState<SuspectWithCases | null>(null);
  const [detectiveToEdit, setDetectiveToEdit] = useState<Partial<RawDetective> | null>(null);
  const [detectiveToDelete, setDetectiveToDelete] = useState<DetectiveWithStats | null>(null);
  const [victimToEdit, setVictimToEdit] = useState<Partial<RawVictim & { caseId?: number }> | null>(null);
  const [victimToDelete, setVictimToDelete] = useState<VictimWithCase | Victim | null>(null);
  const [witnessToEdit, setWitnessToEdit] = useState<Partial<Witness & { depoimentos: string[], id: number, caseId?: number }> | null>(null);
  const [witnessToDelete, setWitnessToDelete] = useState<WitnessWithCaseCount | (Witness & { depoimentos: string[] }) | null>(null);
  const [evidenceToEdit, setEvidenceToEdit] = useState<Partial<Evidence & { caseId?: number }> | null>(null);
  const [evidenceToDelete, setEvidenceToDelete] = useState<EvidenceWithCase | Evidence | null>(null);
  const [forenseToEdit, setForenseToEdit] = useState<Partial<RawForenseAnalysis> | null>(null);
  const [forenseToDelete, setForenseToDelete] = useState<ForenseAnalysis | null>(null);
  const [mapFocalPoint, setMapFocalPoint] = useState<{ type: 'case' | 'suspect', id: number } | null>(null);
  
  const handleLogin = () => {
    window.location.hash = "/";
    setIsAuthenticated(true);
  };

  // FIX: Moved data processing logic before its usage in effects to resolve 'used before declaration' error.
  // Load initial data from localStorage or data.ts
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('chronos_data');
      if (savedData) {
        setRawData(JSON.parse(savedData));
      } else {
        setRawData(initialRawData);
      }
    } catch (error) {
      console.error("Failed to load or parse data from localStorage", error);
      setRawData(initialRawData);
    }
    setIsLoading(false);
  }, []);

  // Persist rawData to localStorage whenever it changes
  useEffect(() => {
    if (rawData && !isLoading) {
      localStorage.setItem('chronos_data', JSON.stringify(rawData));
    }
  }, [rawData, isLoading]);

  // Memoize processed data to avoid re-computation on every render
  const data = useMemo(() => {
    if (!rawData) return null;
    return processData(rawData);
  }, [rawData]);

  // Close user menu or search results on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
            setIsUserMenuOpen(false);
        }
        if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
            setGlobalSearchTerm('');
            setGlobalSearchResults([]);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced global search
  useEffect(() => {
    if (globalSearchTerm.length < 2) {
      setGlobalSearchResults([]);
      return;
    }

    const debounceTimer = setTimeout(() => {
      if (!data) return;
      const term = globalSearchTerm.toLowerCase();
      const results: SearchResult[] = [];

      data.cases.forEach(c => {
        if (c.descricao.toLowerCase().includes(term) || c.id.toString().includes(term) || c.cidade.toLowerCase().includes(term)) {
          results.push({ type: 'Caso', label: c.descricao, path: `/cases/${c.id}`, icon: <CasesIcon className="h-4 w-4" /> });
        }
      });
      data.suspeitos.forEach(s => {
        if (s.nome.toLowerCase().includes(term) || s.apelido.toLowerCase().includes(term)) {
          results.push({ type: 'Suspeito', label: `${s.apelido} (${s.nome})`, path: `/suspects/${s.id}`, icon: <SuspectsIcon /> });
        }
      });
      data.detectives.forEach(d => {
        if (d.nome.toLowerCase().includes(term)) {
          results.push({ type: 'Detetive', label: d.nome, path: `/detectives`, icon: <DetectivesIcon /> });
        }
      });
      data.victims.forEach(v => {
        if (v.nome.toLowerCase().includes(term)) {
          results.push({ type: 'Vítima', label: v.nome, path: `/victims`, icon: <VictimsIcon /> });
        }
      });
      data.witnesses.forEach(w => {
        if (w.nome.toLowerCase().includes(term)) {
          results.push({ type: 'Testemunha', label: w.nome, path: `/witnesses`, icon: <WitnessesIcon /> });
        }
      });
       data.evidences.forEach(e => {
        if (e.descricao.toLowerCase().includes(term) || e.local_encontrado.toLowerCase().includes(term)) {
          results.push({ type: 'Evidência', label: e.descricao, path: `/evidence`, icon: <EvidenceIcon /> });
        }
      });

      setGlobalSearchResults(results.slice(0, 15));
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [globalSearchTerm, data]);


  const handleResetData = () => {
    localStorage.removeItem('chronos_data');
    window.location.reload();
  };

  // CRUD Handlers
  const handleCreate = <T extends { id: number }>(
    collection: keyof RawData,
    newItemData: Omit<T, 'id'>,
    entityName: string
  ) => {
    setRawData(prev => {
      if (!prev) return null;
      const currentCollection = prev[collection] as unknown as T[];
      const newId = currentCollection.length > 0 ? Math.max(...currentCollection.map(c => c.id)) + 1 : 1;
      const newItem: T = { ...newItemData, id: newId } as T;
      return { ...prev, [collection]: [...currentCollection, newItem] };
    });
    setToastMessage({ type: 'success', message: `${entityName} adicionado(a) com sucesso!` });
  };

  const handleUpdate = <T extends { id: number }>(
    collection: keyof RawData,
    updatedItemData: T,
    entityName: string
  ) => {
    setRawData(prev => {
      if (!prev) return null;
      const currentCollection = prev[collection] as unknown as T[];
      return {
        ...prev,
        [collection]: currentCollection.map(item => item.id === updatedItemData.id ? updatedItemData : item),
      };
    });
    setToastMessage({ type: 'success', message: `${entityName} atualizado(a) com sucesso!` });
  };
  
  const handleDeleteCase = (caseId: number) => {
    if (!rawData) return;
    setRawData(prev => {
        if (!prev) return null;
        return {
            ...prev,
            casesRaw: prev.casesRaw.filter(c => c.id !== caseId),
            casos_detetives: prev.casos_detetives.filter(cd => cd.id_caso !== caseId),
            casos_suspeitos: prev.casos_suspeitos.filter(cs => cs.id_caso !== caseId),
            casos_evidencias: prev.casos_evidencias.filter(ce => ce.id_caso !== caseId),
            casos_vitimas: prev.casos_vitimas.filter(cv => cv.id_caso !== caseId),
            casos_testemunhas: prev.casos_testemunhas.filter(ct => ct.id_caso !== caseId),
            forenseAnalysesRaw: prev.forenseAnalysesRaw.filter(fa => fa.id_caso !== caseId),
        };
    });
    setCaseToDelete(null); // Close modal
    setToastMessage({ type: 'success', message: 'Caso excluído com sucesso!' });
  };

  const handleDeleteSuspect = (suspectId: number) => {
    setRawData(prev => {
        if (!prev) return null;
        return {
            ...prev,
            suspectsRaw: prev.suspectsRaw.filter(s => s.id !== suspectId),
            casos_suspeitos: prev.casos_suspeitos.filter(cs => cs.id_suspeito !== suspectId),
            forenseAnalysesRaw: prev.forenseAnalysesRaw.map(fa => fa.id_suspeito_match === suspectId ? {...fa, id_suspeito_match: null, status: 'Pendente' } : fa),
        };
    });
    setSuspectToDelete(null);
    setToastMessage({ type: 'success', message: 'Suspeito excluído com sucesso!' });
  };
  
  const handleDeleteDetective = (detectiveId: number) => {
      setRawData(prev => {
          if (!prev) return null;
          return {
              ...prev,
              detectivesRaw: prev.detectivesRaw.filter(d => d.id !== detectiveId),
              casos_detetives: prev.casos_detetives.filter(cd => cd.id_detetive !== detectiveId),
          };
      });
      setDetectiveToDelete(null);
      setToastMessage({ type: 'success', message: 'Detetive excluído com sucesso!' });
  };

  const handleVictimSubmit = (data: Partial<RawVictim & { caseId?: number }>) => {
    const { caseId, ...victimData } = data;
    if (victimData.id) { // Editing
        handleUpdate('victimsRaw', victimData as RawVictim & { id: number }, 'Vítima');
    } else if (caseId) { // Creating and linking
        setRawData(prev => {
            if (!prev) return null;
            const newId = (prev.victimsRaw.length > 0 ? Math.max(...prev.victimsRaw.map(v => v.id)) : 0) + 1;
            const newVictim = { ...victimData, id: newId } as RawVictim & { id: number };
            const newLink = { id_caso: caseId, id_vitima: newId };
            return {
                ...prev,
                victimsRaw: [...prev.victimsRaw, newVictim],
                casos_vitimas: [...prev.casos_vitimas, newLink]
            };
        });
        setToastMessage({ type: 'success', message: 'Vítima adicionada e vinculada com sucesso!' });
    } else { // Just creating (from global page)
        handleCreate('victimsRaw', victimData, 'Vítima');
    }
    setVictimToEdit(null);
  };

  const handleDeleteVictim = (victimId: number) => {
      setRawData(prev => {
          if (!prev) return null;
          return {
              ...prev,
              victimsRaw: prev.victimsRaw.filter(v => v.id !== victimId),
              casos_vitimas: prev.casos_vitimas.filter(cv => cv.id_vitima !== victimId),
          };
      });
      setVictimToDelete(null);
      setToastMessage({ type: 'success', message: 'Vítima excluída com sucesso!' });
  };

  const handleWitnessSubmit = (data: Partial<Witness & { depoimentos: string[], id: number, caseId?: number }>) => {
    const { depoimentos, caseId, ...witnessData } = data;
    
    if (data.id) { // Editing
        handleUpdate('witnessesRaw', witnessData as Witness & { id: number }, 'Testemunha');
        if (caseId && depoimentos) {
            setRawData(prev => {
                if (!prev) return null;
                const filteredTestimonials = prev.casos_testemunhas.filter(
                    ct => !(ct.id_caso === caseId && ct.id_testemunha === data.id)
                );
                const newTestimonials = depoimentos.map(depoimento => ({
                    id_caso: caseId,
                    id_testemunha: data.id!,
                    depoimento
                })).filter(d => d.depoimento);
                return { ...prev, casos_testemunhas: [...filteredTestimonials, ...newTestimonials] };
            });
        }
    } else if (caseId) { // Creating & Linking from Case Detail page
        setRawData(prev => {
            if (!prev) return null;
            const newId = (prev.witnessesRaw.length > 0 ? Math.max(...prev.witnessesRaw.map(w => w.id)) : 0) + 1;
            const newWitness = { ...witnessData, id: newId } as Witness & { id: number };
            const newTestimonials = (depoimentos || []).map(depoimento => ({
                id_caso: caseId,
                id_testemunha: newId,
                depoimento
            })).filter(d => d.depoimento);

            return {
                ...prev,
                witnessesRaw: [...prev.witnessesRaw, newWitness],
                casos_testemunhas: [...prev.casos_testemunhas, ...newTestimonials],
            };
        });
        setToastMessage({ type: 'success', message: 'Testemunha adicionada e vinculada com sucesso!' });
    } else { // Creating from global page
        handleCreate('witnessesRaw', witnessData, 'Testemunha');
    }
    setWitnessToEdit(null);
  };
  
  const handleDeleteWitness = (witnessId: number) => {
      setRawData(prev => {
          if (!prev) return null;
          return {
              ...prev,
              witnessesRaw: prev.witnessesRaw.filter(w => w.id !== witnessId),
              casos_testemunhas: prev.casos_testemunhas.filter(ct => ct.id_testemunha !== witnessId),
          };
      });
      setWitnessToDelete(null);
      setToastMessage({ type: 'success', message: 'Testemunha excluída com sucesso!' });
  };

  const handleEvidenceSubmit = (data: Partial<Evidence & { caseId?: number }>) => {
    const { caseId, ...evidenceData } = data;
    if (evidenceData.id) { // Editing
        // Simulate adding to chain of custody
        if ('chainOfCustody' in evidenceData) {
            const newLog = { timestamp: new Date().toISOString(), user: currentUser.name, action: `Descrição atualizada para: "${evidenceData.descricao}"` };
            (evidenceData as any).chainOfCustody.push(newLog);
        }
        handleUpdate('evidencesRaw', evidenceData as Evidence & { id: number }, 'Evidência');
    } else if (caseId) { // Creating and linking
        setRawData(prev => {
            if (!prev) return null;
            const newId = (prev.evidencesRaw.length > 0 ? Math.max(...prev.evidencesRaw.map(e => e.id)) : 0) + 1;
            const newEvidence = { ...evidenceData, id: newId, chainOfCustody: [{ timestamp: new Date().toISOString(), user: currentUser.name, action: `Evidência criada e vinculada ao caso #${caseId}` }] } as Evidence & { id: number };
            const newLink = { id_caso: caseId, id_evidencia: newId };
            return {
                ...prev,
                evidencesRaw: [...prev.evidencesRaw, newEvidence],
                casos_evidencias: [...prev.casos_evidencias, newLink]
            };
        });
        setToastMessage({ type: 'success', message: 'Evidência adicionada e vinculada com sucesso!' });
    } else { // Just creating
        const newEvidenceDataWithLog = { ...evidenceData, chainOfCustody: [{ timestamp: new Date().toISOString(), user: currentUser.name, action: "Evidência criada" }]};
        handleCreate('evidencesRaw', newEvidenceDataWithLog, 'Evidência');
    }
    setEvidenceToEdit(null);
  };

  const handleDeleteEvidence = (evidenceId: number) => {
      setRawData(prev => {
          if (!prev) return null;
          return {
              ...prev,
              evidencesRaw: prev.evidencesRaw.filter(e => e.id !== evidenceId),
              casos_evidencias: prev.casos_evidencias.filter(ce => ce.id_evidencia !== evidenceId),
              forenseAnalysesRaw: prev.forenseAnalysesRaw.filter(fa => fa.id_evidencia !== evidenceId),
          };
      });
      setEvidenceToDelete(null);
      setToastMessage({ type: 'success', message: 'Evidência excluída com sucesso!' });
  };

  const handleDeleteForenseAnalysis = (analysisId: number) => {
      setRawData(prev => {
          if (!prev) return null;
          return {
              ...prev,
              forenseAnalysesRaw: prev.forenseAnalysesRaw.filter(fa => fa.id !== analysisId),
          };
      });
      setForenseToDelete(null);
      setToastMessage({ type: 'success', message: 'Análise forense excluída com sucesso!' });
  };
  
  // Modal Control Functions
  const openCaseFormModal = (caseData: Partial<RawCase> | null = {}) => setCaseToEdit(caseData);
  const closeCaseFormModal = () => setCaseToEdit(null);
  const openDeleteConfirmModal = (aCase: CaseType) => setCaseToDelete(aCase);
  const closeDeleteConfirmModal = () => setCaseToDelete(null);

  if (!isAuthenticated) {
    return <LoginPage onLogin={handleLogin} />;
  }
  
  if (isLoading || !data || !rawData) {
    return (
        <div className="flex items-center justify-center h-screen bg-brand-bg">
            <SpinnerIcon className="h-10 w-10 text-brand-accent" />
        </div>
    );
  }

  return (
    <HashRouter>
      <div className="flex h-screen bg-brand-primary font-body">
        {/* Mobile Sidebar */}
        <div 
          className={`fixed inset-0 z-30 bg-black/50 transition-opacity duration-300 md:hidden ${isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
          onClick={() => setIsSidebarOpen(false)}
        />
        <aside className={`fixed top-0 left-0 h-full w-64 bg-brand-primary border-r border-brand-secondary z-40 transform transition-transform duration-300 md:hidden ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <SidebarContent isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          <button 
              onClick={() => setIsSidebarOpen(false)} 
              className="absolute top-4 right-4 p-2 text-brand-text-secondary hover:text-white md:hidden"
          >
              <CloseIcon />
          </button>
        </aside>

        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 bg-brand-primary border-r border-brand-secondary flex-shrink-0">
            <SidebarContent isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        </aside>

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header 
            isSidebarOpen={isSidebarOpen}
            setIsSidebarOpen={setIsSidebarOpen}
            searchTerm={globalSearchTerm}
            onSearchChange={setGlobalSearchTerm}
            searchResults={globalSearchResults}
            clearSearch={() => {
              setGlobalSearchTerm('');
              setGlobalSearchResults([]);
            }}
            searchContainerRef={searchContainerRef}
            userMenuRef={userMenuRef}
            currentUser={currentUser}
            isUserMenuOpen={isUserMenuOpen}
            setIsUserMenuOpen={setIsUserMenuOpen}
            setCurrentUser={setCurrentUser}
            setIsResetModalOpen={setIsResetModalOpen}
          />
          <main id="main-scroll-container" className="flex-1 overflow-y-auto p-6 lg:p-8 bg-brand-bg">
            <Routes>
              <Route path="/" element={<DashboardPage data={data} />} />
              <Route path="/cases" element={
                <CasesPage 
                  cases={data.cases} 
                  currentUserRole={currentUser.role}
                  onAdd={() => openCaseFormModal()}
                  onEdit={(c) => openCaseFormModal(c)}
                  onDelete={openDeleteConfirmModal}
                  onOpenMap={(caseId) => setMapFocalPoint({ type: 'case', id: caseId })}
                />} 
              />
              <Route path="/cases/:caseId" element={
                 <CaseDetailPage
                    data={data}
                    rawData={rawData}
                    setRawData={setRawData}
                    currentUser={currentUser}
                    onOpenMap={(focalPoint) => setMapFocalPoint(focalPoint)}
                    onEditWitness={(w) => setWitnessToEdit(w)}
                    onDeleteWitness={(w) => setWitnessToDelete(w)}
                    onEditEvidence={(e) => setEvidenceToEdit(e)}
                    onDeleteEvidence={(e) => setEvidenceToDelete(e)}
                    onEditVictim={(v) => setVictimToEdit(v)}
                    onDeleteVictim={(v) => setVictimToDelete(v)}
                />}
              />
              <Route path="/suspects" element={<SuspectsPage data={data} currentUserRole={currentUser.role} onAdd={() => setSuspectToEdit({})} onEdit={(s) => setSuspectToEdit(s)} onDelete={setSuspectToDelete} />} />
              <Route path="/suspects/:suspectId" element={<SuspectDetailPage data={data} onOpenMap={(focalPoint) => setMapFocalPoint(focalPoint)} />} />
              <Route path="/detectives" element={<DetectivesPage data={data} currentUserRole={currentUser.role} onAdd={() => setDetectiveToEdit({})} onEdit={(d) => setDetectiveToEdit(d)} onDelete={setDetectiveToDelete} />} />
              <Route path="/victims" element={<VictimsPage data={data} onAdd={() => setVictimToEdit({})} onEdit={(v) => setVictimToEdit(v)} onDelete={setVictimToDelete} />} />
              <Route path="/witnesses" element={<WitnessesPage data={data} onAdd={() => setWitnessToEdit({ depoimentos: [] })} onEdit={(w) => setWitnessToEdit(w)} onDelete={setWitnessToDelete} />} />
              <Route path="/evidence" element={<EvidencePage data={data} onAdd={() => setEvidenceToEdit({})} onEdit={(e) => setEvidenceToEdit(e)} onDelete={setEvidenceToDelete} />} />
              <Route path="/forense" element={<ForensePage data={data} currentUserRole={currentUser.role} onAdd={() => setForenseToEdit({})} onEdit={(f) => setForenseToEdit(f)} onDelete={setForenseToDelete} />} />
              <Route path="/timeline" element={<TimelinePage data={data} />} />
              <Route path="/others" element={<OthersPage />} />
            </Routes>
          </main>
        </div>
        
        {/* Modals & Toasts */}
        <ToastContainer message={toastMessage} onClear={() => setToastMessage(null)} />

        <RelationshipMapModal 
          isOpen={!!mapFocalPoint}
          onClose={() => setMapFocalPoint(null)}
          focalPoint={mapFocalPoint}
          data={data}
        />

        {isResetModalOpen && (
            <ConfirmationModal
                isOpen={isResetModalOpen}
                onClose={() => setIsResetModalOpen(false)}
                onConfirm={handleResetData}
                title="Confirmar Reset"
            >
                <p>Você tem certeza que deseja resetar todos os dados? Esta ação não pode ser desfeita e irá recarregar a aplicação.</p>
            </ConfirmationModal>
        )}
        
        {caseToEdit && (
            <CaseFormModal 
                isOpen={!!caseToEdit} 
                onClose={closeCaseFormModal}
                onSubmit={(d) => {
                    caseToEdit.id ? handleUpdate('casesRaw', d, 'Caso') : handleCreate('casesRaw', d, 'Caso');
                    closeCaseFormModal();
                }}
                initialData={caseToEdit}
            />
        )}
        {caseToDelete && (
            <ConfirmationModal
                isOpen={!!caseToDelete}
                onClose={closeDeleteConfirmModal}
                onConfirm={() => handleDeleteCase(caseToDelete.id)}
                title="Confirmar Exclusão"
            >
                <p>Você tem certeza que deseja excluir o caso "{caseToDelete.descricao}"? Esta ação não pode ser desfeita.</p>
            </ConfirmationModal>
        )}

        {suspectToEdit && <SuspectFormModal isOpen={!!suspectToEdit} onClose={() => setSuspectToEdit(null)} onSubmit={(d) => { suspectToEdit.id ? handleUpdate('suspectsRaw', d, 'Suspeito') : handleCreate('suspectsRaw', d, 'Suspeito'); setSuspectToEdit(null); }} initialData={suspectToEdit} />}
        {suspectToDelete && <ConfirmationModal isOpen={!!suspectToDelete} onClose={() => setSuspectToDelete(null)} onConfirm={() => handleDeleteSuspect(suspectToDelete.id)} title="Excluir Suspeito"><p>Deseja excluir o suspeito "{suspectToDelete.nome}"?</p></ConfirmationModal>}
        
        {detectiveToEdit && <DetectiveFormModal isOpen={!!detectiveToEdit} onClose={() => setDetectiveToEdit(null)} onSubmit={(d) => { detectiveToEdit.id ? handleUpdate('detectivesRaw', d, 'Detetive') : handleCreate('detectivesRaw', d, 'Detetive'); setDetectiveToEdit(null); }} initialData={detectiveToEdit} />}
        {detectiveToDelete && <ConfirmationModal isOpen={!!detectiveToDelete} onClose={() => setDetectiveToDelete(null)} onConfirm={() => handleDeleteDetective(detectiveToDelete.id)} title="Excluir Detetive"><p>Deseja excluir o detetive "{detectiveToDelete.nome}"?</p></ConfirmationModal>}

        {victimToEdit && <VictimFormModal isOpen={!!victimToEdit} onClose={() => setVictimToEdit(null)} onSubmit={handleVictimSubmit} initialData={victimToEdit} />}
        {victimToDelete && <ConfirmationModal isOpen={!!victimToDelete} onClose={() => setVictimToDelete(null)} onConfirm={() => handleDeleteVictim(victimToDelete.id)} title="Excluir Vítima"><p>Deseja excluir a vítima "{victimToDelete.nome}"?</p></ConfirmationModal>}

        {witnessToEdit && <WitnessFormModal isOpen={!!witnessToEdit} onClose={() => setWitnessToEdit(null)} onSubmit={handleWitnessSubmit} initialData={witnessToEdit} />}
        {witnessToDelete && <ConfirmationModal isOpen={!!witnessToDelete} onClose={() => setWitnessToDelete(null)} onConfirm={() => handleDeleteWitness(witnessToDelete.id)} title="Excluir Testemunha"><p>Deseja excluir a testemunha "{witnessToDelete.nome}"?</p></ConfirmationModal>}
        
        {evidenceToEdit && <EvidenceFormModal isOpen={!!evidenceToEdit} onClose={() => setEvidenceToEdit(null)} onSubmit={handleEvidenceSubmit} initialData={evidenceToEdit} currentUser={currentUser} />}
        {evidenceToDelete && <ConfirmationModal isOpen={!!evidenceToDelete} onClose={() => setEvidenceToDelete(null)} onConfirm={() => handleDeleteEvidence(evidenceToDelete.id)} title="Excluir Evidência"><p>Deseja excluir a evidência "{evidenceToDelete.descricao}"?</p></ConfirmationModal>}

        {forenseToEdit && <ForenseAnalysisFormModal rawData={rawData} isOpen={!!forenseToEdit} onClose={() => setForenseToEdit(null)} onSubmit={(d) => { forenseToEdit.id ? handleUpdate('forenseAnalysesRaw', d, 'Análise') : handleCreate('forenseAnalysesRaw', d, 'Análise'); setForenseToEdit(null); }} initialData={forenseToEdit} />}
        {forenseToDelete && <ConfirmationModal isOpen={!!forenseToDelete} onClose={() => setForenseToDelete(null)} onConfirm={() => handleDeleteForenseAnalysis(forenseToDelete.id)} title="Excluir Análise Forense"><p>Deseja excluir a análise #{forenseToDelete.id}?</p></ConfirmationModal>}

      </div>
    </HashRouter>
  );
};

export default App;