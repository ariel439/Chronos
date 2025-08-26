

import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../components/ui';
import { 
  VictimsIcon, 
  WitnessesIcon, 
  EvidenceIcon, 
  TimelineIcon, 
  NetworkIcon, 
  ArrowRightIcon,
  MapIcon,
  TrendingUpIcon,
  SparklesIcon,
  LinkIcon
} from '../components/Icons';

type Tool = {
  path: string;
  icon: JSX.Element;
  title: string;
  description: string;
  color: string;
  disabled?: boolean;
};

const tools: Tool[] = [
  {
    path: '/victims',
    icon: <VictimsIcon />,
    title: 'Análise de Vítimas',
    description: 'Analise perfis de vítimas, identifique padrões e vulnerabilidades em todos os casos.',
    color: 'border-blue-400/50',
  },
  {
    path: '/witnesses',
    icon: <WitnessesIcon />,
    title: 'Quadro de Testemunhas',
    description: 'Gerencie depoimentos e avalie a credibilidade das testemunhas de forma visual.',
    color: 'border-purple-400/50',
  },
  {
    path: '/evidence',
    icon: <EvidenceIcon />,
    title: 'Locker de Evidências',
    description: 'Catalogue e rastreie todas as evidências coletadas em um banco de dados centralizado.',
    color: 'border-teal-400/50',
  },
  {
    path: '/timeline',
    icon: <TimelineIcon />,
    title: 'Linha do Tempo Mestra',
    description: 'Visualize uma cronologia consolidada de todos os eventos importantes entre casos.',
    color: 'border-yellow-400/50',
  },
];

const futureTools: Tool[] = [
  {
    path: '#',
    icon: <MapIcon />,
    title: 'Mapa de Calor Criminal',
    description: 'Visualize hotspots de crimes em um mapa interativo para alocação estratégica de recursos.',
    color: 'border-red-400/50',
    disabled: true,
  },
  {
    path: '#',
    icon: <TrendingUpIcon />,
    title: 'Analisador de Padrões Temporais',
    description: 'Identifique padrões de crimes baseados em hora, dia da semana e sazonalidade usando I.A.',
    color: 'border-indigo-400/50',
    disabled: true,
  },
  {
    path: '#',
    icon: <SparklesIcon />,
    title: 'Vigilância Preditiva',
    description: 'Simule previsões de I.A. sobre potenciais locais e tipos de crimes nas próximas 24-48 horas.',
    color: 'border-pink-400/50',
    disabled: true,
  },
  {
    path: '#',
    icon: <LinkIcon />,
    title: 'Conector de Vínculos Ocultos',
    description: 'Utilize I.A. para vasculhar dados não estruturados e descobrir conexões ocultas entre casos.',
    color: 'border-green-400/50',
    disabled: true,
  },
  {
    path: '#',
    icon: <NetworkIcon />,
    title: 'Analisador de Rede de Comunicações',
    description: 'Mapeie e visualize redes de comunicação entre suspeitos com base em metadados.',
    color: 'border-cyan-400/50',
    disabled: true,
  },
];

const allTools = [...tools, ...futureTools];

const ToolCard: React.FC<Tool> = ({ path, icon, title, description, color, disabled }) => {
    const cardContent = (
        <Card className={`border ${color} h-full flex flex-col ${disabled ? 'opacity-60 cursor-not-allowed !hover:scale-100 !hover:shadow-lg' : 'group !hover:scale-105'}`}>
            <div className="flex items-center gap-x-4 mb-4">
                <div className="p-3 bg-brand-primary rounded-lg">{icon}</div>
                <h3 className="text-xl font-bold font-sans text-brand-text">{title}</h3>
            </div>
            <p className="text-brand-text-secondary flex-grow mb-4">{description}</p>
            <div className={`flex justify-end items-center font-semibold transition-colors ${disabled ? 'text-brand-text-secondary' : 'text-brand-accent group-hover:text-brand-accent-hover'}`}>
                {disabled ? 'Em Breve' : 'Acessar Ferramenta'} <ArrowRightIcon />
            </div>
        </Card>
    );

    if (disabled) {
        return <div>{cardContent}</div>;
    }

    return <Link to={path}>{cardContent}</Link>;
};

const OthersPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold font-sans">Central de Inteligência</h1>
        <p className="text-brand-text-secondary mt-2">Acesse ferramentas de análise e visualização de dados para obter insights mais profundos.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allTools.map((tool) => (
          <ToolCard key={tool.title} {...tool} />
        ))}
      </div>
    </div>
  );
};

export default OthersPage;