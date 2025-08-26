
import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { ProcessedData, TimelineEvent } from '../types';
import { Card } from '../components/ui';
import { SearchIcon, CasesIcon, FlaskIcon } from '../components/Icons';

const TimelineItem: React.FC<{ event: TimelineEvent; index: number }> = ({ event, index }) => {
    const isLeft = index % 2 === 0;
    const Icon = event.type === 'Ocorrência de Caso' ? CasesIcon : FlaskIcon;
    const color = event.type === 'Ocorrência de Caso' ? 'bg-orange-500/20 border-orange-500/50' : 'bg-sky-500/20 border-sky-500/50';
    const iconColor = event.type === 'Ocorrência de Caso' ? 'text-orange-400' : 'text-sky-400';

    return (
        <div className="relative">
            {/* The Timeline Item Card */}
            <div className={`w-[calc(50%-2rem)] absolute top-0 ${isLeft ? 'left-0 text-right' : 'right-0 text-left'}`}>
                <p className="font-bold text-brand-accent text-lg">{new Date(event.date).toLocaleDateString()}</p>
            </div>
            <div className={`w-[calc(50%-2rem)] absolute ${isLeft ? 'right-0' : 'left-0'}`}>
                <Card className={`!p-4 border ${color}`}>
                    <h3 className="font-bold text-brand-text">{event.type}</h3>
                    <p className="text-sm text-brand-text-secondary my-2">{event.description}</p>
                    <Link to={`/cases/${event.caseId}`} className="text-xs text-brand-accent hover:underline">
                        Ver Caso #{event.caseId}: {event.caseDescription}
                    </Link>
                </Card>
            </div>

            {/* The Dot on the timeline */}
            <div className="absolute top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2 w-8 h-8 bg-brand-secondary rounded-full border-4 border-brand-primary flex items-center justify-center">
                <Icon />
            </div>
        </div>
    );
};

const TimelinePage: React.FC<{ data: ProcessedData | null }> = ({ data }) => {
    const [searchTerm, setSearchTerm] = useState('');

    if (!data) return null;

    const filteredEvents = useMemo(() => {
        const lowercasedTerm = searchTerm.toLowerCase();
        if (!lowercasedTerm) {
            return data.timelineEvents;
        }
        return data.timelineEvents.filter(event =>
            event.description.toLowerCase().includes(lowercasedTerm) ||
            event.caseDescription.toLowerCase().includes(lowercasedTerm) ||
            event.type.toLowerCase().includes(lowercasedTerm)
        );
    }, [data.timelineEvents, searchTerm]);
    
    // We need to calculate height for each item to avoid overlap
    const itemHeights = useMemo(() => {
        return filteredEvents.map(event => {
            const baseHeight = 120; // min height for a card
            const descLength = event.description.length + event.caseDescription.length;
            const extraHeight = Math.floor(descLength / 50) * 20; // add height for longer text
            return baseHeight + extraHeight;
        });
    }, [filteredEvents]);

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-center">
                <h2 className="text-3xl font-bold font-sans">Linha do Tempo Mestra</h2>
            </div>
            <div className="relative">
                <input
                    type="text"
                    placeholder="Filtrar eventos por descrição, caso ou tipo..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-brand-primary border border-brand-secondary rounded-lg p-3 pl-10 focus:ring-brand-accent focus:border-brand-accent font-body"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <SearchIcon />
                </div>
            </div>

            <div className="relative max-w-5xl mx-auto py-8">
                {/* The line */}
                <div className="absolute top-0 h-full border-r-2 border-brand-secondary left-1/2 -translate-x-1/2"></div>
                
                <div className="relative">
                    {filteredEvents.map((event, index) => {
                        const height = itemHeights[index];
                        const topPosition = index > 0 ? itemHeights.slice(0, index).reduce((a, b) => a + b, 0) + (index * 48) : 0; // 48 is vertical gap
                        return (
                            <div key={`${event.date}-${event.description}-${index}`} style={{ height: `${height}px`, top: `${topPosition}px` }} className="absolute w-full">
                                <TimelineItem event={event} index={index} />
                            </div>
                        );
                    })}
                </div>
                {/* Spacer to make scroll container tall enough */}
                <div style={{ height: `${itemHeights.reduce((a, b) => a + b, 0) + (filteredEvents.length * 48)}px` }}></div>
            </div>
        </div>
    );
};

export default TimelinePage;
