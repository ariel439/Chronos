
import React, { useState, useRef, useEffect } from 'react';
import { ProcessedData } from '../types';
import { Modal } from '../components/ui';
import { SuspectsIcon, CasesIcon, VictimsIcon, WitnessesIcon, EvidenceIcon, DetectivesIcon } from '../components/Icons';

// Define types for graph nodes and edges
type NodeType = 'case' | 'suspect' | 'detective' | 'victim' | 'witness' | 'evidence';
type Node = {
    id: string;
    label: string;
    type: NodeType;
    data: any;
    x: number;
    y: number;
};
type Edge = {
    id: string;
    source: string;
    target: string;
};

// Map entity types to icons and colors for consistent styling
const nodeStyles: Record<NodeType, { icon: React.ReactNode, color: string, textColor: string }> = {
    case: { icon: <CasesIcon />, color: 'bg-brand-accent', textColor: 'text-white' },
    suspect: { icon: <SuspectsIcon />, color: 'bg-danger', textColor: 'text-white' },
    detective: { icon: <DetectivesIcon />, color: 'bg-info', textColor: 'text-white' },
    victim: { icon: <VictimsIcon />, color: 'bg-blue-400', textColor: 'text-white' },
    witness: { icon: <WitnessesIcon />, color: 'bg-purple-400', textColor: 'text-white' },
    evidence: { icon: <EvidenceIcon />, color: 'bg-teal-400', textColor: 'text-white' },
};

const typeLabels: Record<NodeType, string> = {
    case: 'Caso',
    suspect: 'Suspeito',
    detective: 'Detetive',
    victim: 'Vítima',
    witness: 'Testemunha',
    evidence: 'Evidência',
};


interface RelationshipMapModalProps {
    isOpen: boolean;
    onClose: () => void;
    focalPoint: { type: 'case' | 'suspect', id: number } | null;
    data: ProcessedData | null;
}

export const RelationshipMapModal: React.FC<RelationshipMapModalProps> = ({ isOpen, onClose, focalPoint, data }) => {
    const mapContainerRef = useRef<HTMLDivElement>(null);
    const [graph, setGraph] = useState<{ nodes: Node[], edges: Edge[] }>({ nodes: [], edges: [] });

    useEffect(() => {
        if (!isOpen || !focalPoint || !data || !mapContainerRef.current) {
            setGraph({ nodes: [], edges: [] });
            return;
        }

        const newNodes: Node[] = [];
        const newEdges: Edge[] = [];
        
        const { width, height } = mapContainerRef.current.getBoundingClientRect();
        if (width === 0 || height === 0) return; // container not rendered yet

        const centerX = width / 2;
        const centerY = height / 2;
        const radius = Math.min(width, height) / 2.8;

        let centralNode: any;
        let connectedEntities: { type: NodeType, data: any[] }[] = [];
        let focalPointLabel = '';

        if (focalPoint.type === 'case') {
            const caseData = data.cases.find(c => c.id === focalPoint.id);
            if (!caseData) return;
            centralNode = { type: 'case', data: caseData };
            focalPointLabel = `Caso #${caseData.id}`;
            connectedEntities = [
                { type: 'suspect', data: caseData.suspeitos },
                { type: 'detective', data: caseData.detetives },
                { type: 'victim', data: caseData.vitimas },
                { type: 'witness', data: caseData.testemunhas },
                { type: 'evidence', data: caseData.evidencias },
            ];
        } else { // focalPoint.type === 'suspect'
            const suspectData = data.suspeitos.find(s => s.id === focalPoint.id);
            if (!suspectData) return;
            centralNode = { type: 'suspect', data: suspectData };
            focalPointLabel = `Suspeito: ${suspectData.apelido}`;
            connectedEntities = [
                { type: 'case', data: suspectData.allCases },
                { type: 'suspect', data: suspectData.associates },
            ];
        }
        
        const centralNodeId = `${centralNode.type}-${centralNode.data.id}`;
        newNodes.push({
            id: centralNodeId,
            label: centralNode.data.descricao || centralNode.data.apelido,
            type: centralNode.type,
            data: centralNode.data,
            x: centerX,
            y: centerY,
        });

        const allConnected = connectedEntities.flatMap(group => group.data.map(item => ({...item, type: group.type}))).filter(Boolean);
        const totalNodes = allConnected.length;

        allConnected.forEach((entity, index) => {
            if(!entity?.id) return;
            const angle = (index / totalNodes) * 2 * Math.PI;
            const nodeId = `${entity.type}-${entity.id}`;
            newNodes.push({
                id: nodeId,
                label: entity.descricao || entity.apelido || entity.nome,
                type: entity.type,
                data: entity,
                x: centerX + radius * Math.cos(angle),
                y: centerY + radius * Math.sin(angle),
            });
            newEdges.push({
                id: `${centralNodeId}-${nodeId}`,
                source: centralNodeId,
                target: nodeId,
            });
        });

        setGraph({ nodes: newNodes, edges: newEdges });

    }, [isOpen, focalPoint, data, mapContainerRef.current]);

    const { nodes, edges } = graph;
    const findNodeById = (id: string) => nodes.find(n => n.id === id);
    
    const getFocalPointLabel = () => {
        if (!focalPoint || !data) return "Carregando...";
        if (focalPoint.type === 'case') {
             const caseData = data.cases.find(c => c.id === focalPoint.id);
             return caseData ? `Caso #${caseData.id}: ${caseData.descricao}` : "Caso";
        } else {
            const suspectData = data.suspeitos.find(s => s.id === focalPoint.id);
            return suspectData ? `Suspeito: ${suspectData.apelido}` : "Suspeito";
        }
    }


    return (
        <Modal isOpen={isOpen} onClose={onClose} title={`Mapa de Relações: ${getFocalPointLabel()}`}>
            <div ref={mapContainerRef} className="w-full h-full relative">
                {nodes.length > 0 ? (
                     <>
                        <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0">
                            <defs>
                                <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
                                    <path d="M 0 0 L 10 5 L 0 10 z" fill="#4a4848" />
                                </marker>
                            </defs>
                            {edges.map(edge => {
                                const sourceNode = findNodeById(edge.source);
                                const targetNode = findNodeById(edge.target);
                                if (!sourceNode || !targetNode) return null;
                                return (
                                    <line 
                                        key={edge.id}
                                        x1={sourceNode.x} y1={sourceNode.y}
                                        x2={targetNode.x} y2={targetNode.y}
                                        stroke="#4a4848"
                                        strokeWidth="2"
                                        markerEnd="url(#arrow)"
                                    />
                                );
                            })}
                        </svg>
                        {nodes.map(node => (
                            <div
                                key={node.id}
                                className="absolute transform -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center text-center group z-10"
                                style={{ left: `${node.x}px`, top: `${node.y}px` }}
                                title={node.label}
                            >
                                <div className={`w-16 h-16 rounded-full flex items-center justify-center ${nodeStyles[node.type].color} shadow-lg border-2 border-brand-bg transition-transform group-hover:scale-110`}>
                                    <span className={nodeStyles[node.type].textColor}>{nodeStyles[node.type].icon}</span>
                                </div>
                                <p className={`mt-2 text-xs font-semibold p-1 rounded-md bg-brand-primary/80 transition-opacity max-w-[120px] truncate`}>
                                    {node.label}
                                </p>
                            </div>
                        ))}

                        <div className="absolute bottom-4 right-4 bg-brand-primary/80 backdrop-blur-sm p-3 rounded-lg border border-brand-secondary z-20">
                            <h4 className="font-bold text-sm mb-2 text-brand-text">Legenda</h4>
                            <ul className="space-y-1.5 text-xs text-brand-text-secondary">
                                {Object.entries(nodeStyles).map(([type, { color }]) => (
                                <li key={type} className="flex items-center gap-x-2">
                                    <span className={`w-3 h-3 rounded-full ${color}`}></span>
                                    <span className="capitalize">{typeLabels[type as NodeType]}</span>
                                </li>
                                ))}
                            </ul>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <p className="text-brand-text-secondary">Gerando mapa de relações...</p>
                    </div>
                )}
            </div>
        </Modal>
    );
};
