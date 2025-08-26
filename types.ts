
export type UserRole = 'Delegada Chefe' | 'Detetive' | 'Perito Forense';

export interface User {
  id: number;
  name: string;
  role: UserRole;
  roleName: string;
  avatar: string;
}

export interface Detective {
  id: number;
  nome: string;
  cargo: string;
  especialidade: string;
  foto: string;
}

export interface Suspect {
  id: number;
  nome: string;
  apelido: string;
  idade: number | null;
  historico_criminal: string;
  pontuacao_perigo: number;
  foto: string;
  fisico: {
      altura: string;
      peso: string;
      marcas_distintivas: string;
  };
}

export type CaseStatus = 'investigação' | 'resolvido' | 'arquivada' | 'reaberta';
export type CaseSeverity = 'Crítico' | 'Gravíssimo' | 'Grave' | 'Médio' | 'Baixo';
export type WitnessReliability = 'alta' | 'media' | 'baixa';

export interface Case {
  id: number;
  descricao: string;
  data_ocorrido: string;
  cidade: string;
  status: CaseStatus;
  gravidade: CaseSeverity;
  tempo_ativo_dias: number;
  detetives: Detective[];
  suspeitos: Suspect[];
  vitimas: Victim[];
  testemunhas: (Witness & { depoimentos: string[] })[];
  evidencias: Evidence[];
  isCriminalCell: boolean;
  anexos?: Anexo[];
}

export interface Victim {
  id: number;
  nome: string;
  idade: number;
  ocupacao: string;
  status: 'Viva' | 'Morta' | 'Desaparecida';
}

export interface ChainOfCustodyLog {
    timestamp: string;
    user: string;
    action: string;
}

export interface Evidence {
  id: number;
  descricao: string;
  data_descoberta: string;
  local_encontrado: string;
  analise_forense: boolean;
  chainOfCustody: ChainOfCustodyLog[];
}

export interface Witness {
  id: number;
  nome: string;
  confiabilidade: WitnessReliability;
}

export interface VictimStats {
  commonOccupations: { name: string; count: number }[];
  averageAge: number;
  statusDistribution: { name: 'Viva' | 'Morta' | 'Desaparecida'; count: number }[];
  ageDistribution: { range: string; count: number }[];
}

export type ForenseAnalysisType = 'DNA' | 'Impressão Digital' | 'Balística' | 'Fibra';
export type ForenseAnalysisStatus = 'Pendente' | 'Correspondência' | 'Sem Correspondência';

export interface AIForenseAnalysis {
    matchProbability?: number;
    markers?: string[];
    conclusion: string;
    summary: string;
}

export interface Anexo {
    id: string;
    name: string;
    type: 'image' | 'pdf' | 'audio';
    thumbnail: string; // base64 or url
    addedBy: string;
    timestamp: string;
}

export interface ForenseAnalysis {
  id: number;
  id_caso: number;
  id_evidencia: number;
  id_suspeito_match: number | null;
  tipo: ForenseAnalysisType;
  status: ForenseAnalysisStatus;
  case?: Case;
  evidence?: Evidence;
  suspectMatch?: Suspect;
  aiReport?: AIForenseAnalysis;
}

export interface TimelineEvent {
  date: string;
  type: 'Ocorrência de Caso' | 'Evidência Encontrada';
  description: string;
  caseId: number;
  caseDescription: string;
}

export interface ProcessedData {
  detectives: DetectiveWithStats[];
  suspeitos: SuspectWithCases[];
  cases: Case[];
  victims: VictimWithCase[];
  witnesses: WitnessWithCaseCount[];
  evidences: EvidenceWithCase[];
  forenseAnalyses: ForenseAnalysis[];
  stats: {
    totalActiveCases: number;
    criticalCases: number;
    highDangerSuspects: number;
    averageSuccessRate: number;
    averageCaseAge: number;
  }
  victimStats: VictimStats;
  timelineEvents: TimelineEvent[];
}

export interface DetectiveWithStats extends Detective {
    cases: Case[];
    totalCases: number;
    resolvedCases: number;
    successRate: number;
}

export interface SuspectWithCases extends Suspect {
    activeCases: Case[];
    allCases: Case[];
    isKeySuspect: boolean;
    associates: Suspect[];
}

export interface VictimWithCase extends Victim {
    case: Case | undefined;
}

export interface WitnessWithCaseCount extends Witness {
    caseCount: number;
    depoimentos: string[];
}

export interface EvidenceWithCase extends Evidence {
    case: Case | undefined;
}


// Raw data types for state management
export type RawCase = Omit<Case, 'detetives' | 'suspeitos' | 'vitimas' | 'testemunhas' | 'evidencias' | 'isCriminalCell' | 'tempo_ativo_dias'> & {
    data_finalizacao?: string;
};
export type RawSuspect = Omit<Suspect, 'pontuacao_perigo' | 'foto' | 'fisico'> & { fisico: { altura: string; peso: string; marcas_distintivas: string; } };
export type RawVictim = Omit<Victim, 'status'>;
export type RawDetective = Omit<Detective, 'foto'>;
export type RawForenseAnalysis = Omit<ForenseAnalysis, 'case'|'evidence'|'suspectMatch'|'aiReport'>;

export interface RawData {
  detectivesRaw: RawDetective[];
  suspectsRaw: RawSuspect[];
  casesRaw: RawCase[];
  victimsRaw: RawVictim[];
  evidencesRaw: Evidence[];
  witnessesRaw: Witness[];
  forenseAnalysesRaw: RawForenseAnalysis[];
  casos_detetives: {id_caso: number, id_detetive: number}[];
  casos_suspeitos: {id_caso: number, id_suspeito: number}[];
  casos_evidencias: {id_caso: number, id_evidencia: number}[];
  casos_vitimas: {id_caso: number, id_vitima: number}[];
  casos_testemunhas: {id_caso: number, id_testemunha: number, depoimento: string}[];
}