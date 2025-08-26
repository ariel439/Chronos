import { User, Detective, Suspect, Case, Victim, Evidence, Witness, CaseStatus, CaseSeverity, WitnessReliability, ProcessedData, ForenseAnalysis, AIForenseAnalysis, RawData, RawCase, Anexo, RawSuspect, TimelineEvent } from './types';

export const users: User[] = [
    { id: 1, name: 'Delegada Sofia Costa', role: 'Delegada Chefe', roleName: 'Delegada Chefe', avatar: 'https://i.imgur.com/W1Xd1M1.png' },
    { id: 2, name: 'Detetive Marco Aurélio', role: 'Detetive', roleName: 'Detetive', avatar: 'https://i.imgur.com/b1B13qi.png' },
    { id: 3, name: 'Perito Ricardo Neves', role: 'Perito Forense', roleName: 'Perito Forense', avatar: 'https://i.imgur.com/TMYmznH.png' },
];

const detectivesRaw: Omit<Detective, 'foto'>[] = [
    {id: 1, nome: 'Sofia Costa', cargo: 'Delegada Chefe', especialidade: 'Análise de Padrões e Crimes Complexos'},
    {id: 2, nome: 'Marco Aurélio', cargo: 'Investigador Chefe', especialidade: 'Crimes Cibernéticos'},
    {id: 3, nome: 'Ricardo Neves', cargo: 'Perito Forense Chefe', especialidade: 'Análise de Evidências'},
    {id: 4, nome: 'Juliana Santos', cargo: 'Detetive de Vítimas Especiais', especialidade: 'Violência Doméstica e Desaparecimentos'},
    {id: 5, nome: 'Roberto Lima', cargo: 'Detetive de Roubos e Furtos', especialidade: 'Roubo de Cargas e Veículos'},
    {id: 6, nome: 'Laura Bastos', cargo: 'Agente Especial', especialidade: 'Crimes Ambientais e Tráfico'},
    {id: 7, nome: 'Sherlock Holmes', cargo: 'Detetive Consultor', especialidade: 'Lógica Dedutiva e Casos Impossíveis'},
];

const suspectsRaw: RawSuspect[] = [
    {id: 100, nome: 'Ricardo Vargas', apelido: 'O Sombra', idade: 45, historico_criminal: 'Inteligência estratégica, manipulação, sem condenações.', fisico: { altura: '1.85m', peso: '80kg', marcas_distintivas: 'Cicatriz na sobrancelha esquerda.' }},
    {id: 101, nome: 'Júlio "Mão Leve" Andrade', apelido: 'Mão Leve', idade: 32, historico_criminal: 'Pequenos furtos, arrombamentos.', fisico: { altura: '1.70m', peso: '65kg', marcas_distintivas: 'Tatuagem de uma chave na mão direita.' }},
    {id: 102, nome: 'Carla "A Dama de Copas" Ferraz', apelido: 'Dama de Copas', idade: 38, historico_criminal: 'Estelionato, fraude de identidade.', fisico: { altura: '1.75m', peso: '68kg', marcas_distintivas: 'Nenhuma visível.' }},
    {id: 103, nome: 'Carl Johnson', apelido: 'CJ', idade: 35, historico_criminal: 'Roubo de veículos, associação criminosa.', fisico: { altura: '1.80m', peso: '85kg', marcas_distintivas: 'Várias tatuagens de gangue.' }},
    {id: 104, nome: 'Eduardo "O Químico" Moraes', apelido: 'O Químico', idade: 52, historico_criminal: 'Produção e tráfico de narcóticos, incêndio criminoso.', fisico: { altura: '1.78m', peso: '90kg', marcas_distintivas: 'Manchas químicas nas mãos.' }},
    {id: 105, nome: 'Bianca "A Hacker" Oliveira', apelido: 'A Hacker', idade: 28, historico_criminal: 'Invasão de sistemas, extorsão digital.', fisico: { altura: '1.65m', peso: '55kg', marcas_distintivas: 'Piercing no nariz.' }},
    {id: 106, nome: 'Marcos "O Brutamontes" Silva', apelido: 'O Brutamontes', idade: 41, historico_criminal: 'Agressão, intimidação, segurança ilegal.', fisico: { altura: '1.95m', peso: '120kg', marcas_distintivas: 'Nariz quebrado, cicatrizes nos nós dos dedos.' }},
    {id: 107, nome: 'Desconhecido', apelido: 'O Charadista', idade: null, historico_criminal: 'Deixa enigmas e quebra-cabeças nas cenas do crime.', fisico: { altura: 'Desconhecida', peso: 'Desconhecido', marcas_distintivas: 'Usa luvas e máscara.' }},
    {id: 108, nome: 'Professor Moriarty', apelido: 'O Napoleão do Crime', idade: 50, historico_criminal: 'Mentor intelectual de crimes organizados.', fisico: { altura: '1.82m', peso: '75kg', marcas_distintivas: 'Aparência de um acadêmico, sem traços marcantes.' }},
    {id: 109, nome: 'Desconhecido', apelido: 'O Fantasma', idade: null, historico_criminal: 'Especialista em infiltração e desaparecimento sem deixar rastros. Nenhum registro oficial.', fisico: { altura: 'Variável', peso: 'Variável', marcas_distintivas: 'Mestre em disfarces.' }},
];

const anexosMock: Record<number, Anexo[]> = {
    3: [
        { id: 'anx1', name: 'Relatorio_Tecnico_TechCorp.pdf', type: 'pdf', thumbnail: 'pdf', addedBy: 'Marco Aurélio', timestamp: '2023-11-05T10:20:00Z' },
        { id: 'anx2', name: 'Audio_Testemunha_Anonima.mp3', type: 'audio', thumbnail: 'audio', addedBy: 'Sofia Costa', timestamp: '2023-11-06T14:35:00Z' }
    ],
    26: [
        { id: 'anx3', name: 'Diagrama_Rede_CriptoBanco.png', type: 'image', thumbnail: 'image', addedBy: 'Marco Aurélio', timestamp: '2024-11-16T09:15:00Z' }
    ]
};

const casesRaw: RawCase[] = [
    {id: 1, descricao: 'O Roubo do Colar da Imperatriz', data_ocorrido: '2022-10-20', data_finalizacao: '2023-01-15', cidade: 'Florianópolis', status: 'arquivada', gravidade: 'Grave', anexos: []},
    {id: 2, descricao: 'A Fraude do Leilão de Arte Digital', data_ocorrido: '2023-05-15', cidade: 'Balneário Camboriú', status: 'investigação', gravidade: 'Grave', anexos: []},
    {id: 3, descricao: 'Desaparecimento do Diretor de Tecnologia da TechCorp', data_ocorrido: '2023-11-01', cidade: 'Joinville', status: 'reaberta', gravidade: 'Gravíssimo', anexos: anexosMock[3]},
    {id: 4, descricao: 'Invasão à Joalheria Monte Carlo', data_ocorrido: '2024-02-10', data_finalizacao: '2024-03-01', cidade: 'Blumenau', status: 'resolvido', gravidade: 'Grave', anexos: []},
    {id: 7, descricao: 'Esquema de pirâmide financeira com criptomoedas', data_ocorrido: '2024-05-10', cidade: 'Itajaí', status: 'investigação', gravidade: 'Grave', anexos: []},
    {id: 9, descricao: 'Roubo de carga de eletrônicos', data_ocorrido: '2024-07-11', cidade: 'Tubarão', status: 'investigação', gravidade: 'Grave', anexos: []},
    {id: 10, descricao: 'Incêndio criminoso em galpão abandonado', data_ocorrido: '2024-08-01', data_finalizacao: '2024-10-01', cidade: 'Criciúma', status: 'arquivada', gravidade: 'Grave', anexos: []},
    {id: 11, descricao: 'Ameaça a funcionário público', data_ocorrido: '2024-09-15', data_finalizacao: '2024-09-25', cidade: 'Lages', status: 'resolvido', gravidade: 'Médio', anexos: []},
    {id: 14, descricao: 'Roubo de trator em área rural', data_ocorrido: '2025-01-05', cidade: 'Rio do Sul', status: 'investigação', gravidade: 'Médio', anexos: []},
    {id: 15, descricao: 'Extorsão mediante sequestro de perfil em rede social', data_ocorrido: '2025-02-18', cidade: 'Brusque', status: 'investigação', gravidade: 'Médio', anexos: []},
    {id: 16, descricao: 'Homicídio em bar no centro da cidade', data_ocorrido: '2025-03-12', cidade: 'Palhoça', status: 'investigação', gravidade: 'Gravíssimo', anexos: []},
    {id: 17, descricao: 'Furto de notebooks em escola pública', data_ocorrido: '2025-04-01', data_finalizacao: '2025-05-10', cidade: 'Gaspar', status: 'arquivada', gravidade: 'Baixo', anexos: []},
    {id: 18, descricao: 'Tráfico de animais silvestres', data_ocorrido: '2025-05-25', cidade: 'Caçador', status: 'reaberta', gravidade: 'Grave', anexos: []},
    {id: 20, descricao: 'Fraude em seguro de vida', data_ocorrido: '2025-07-22', data_finalizacao: '2025-08-30', cidade: 'Florianópolis', status: 'arquivada', gravidade: 'Grave', anexos: []},
    {id: 21, descricao: 'O Enigma do Coringa de Ouro', data_ocorrido: '2025-08-20', cidade: 'Balneário Camboriú', status: 'investigação', gravidade: 'Crítico', anexos: []},
    {id: 22, descricao: 'O Mistério do Manuscrito Cifrado', data_ocorrido: '2025-09-01', cidade: 'Florianópolis', status: 'investigação', gravidade: 'Crítico', anexos: []},
    {id: 26, descricao: 'Grande Assalto ao Cripto-Banco', data_ocorrido: '2024-11-15', cidade: 'Joinville', status: 'investigação', gravidade: 'Crítico', anexos: anexosMock[26]},
    {id: 27, descricao: 'Sabotagem na Marina de Itajaí', data_ocorrido: '2025-01-20', cidade: 'Itajaí', status: 'investigação', gravidade: 'Gravíssimo', anexos: []},
    {id: 28, descricao: 'O Sumiço do Protótipo da AeroTech', data_ocorrido: '2025-06-10', cidade: 'São José', status: 'investigação', gravidade: 'Crítico', anexos: []},
    {id: 29, descricao: 'Vazamento de Dados do Sindicato', data_ocorrido: '2025-07-05', cidade: 'Florianópolis', status: 'investigação', gravidade: 'Grave', anexos: []},
    {id: 101, descricao: 'Caso do Falsário de Blumenau', data_ocorrido: '2019-05-20', data_finalizacao: '2019-07-10', cidade: 'Blumenau', status: 'resolvido', gravidade: 'Médio', anexos: []},
    {id: 102, descricao: 'Operação Carga Limpa', data_ocorrido: '2020-02-15', data_finalizacao: '2020-04-20', cidade: 'Itajaí', status: 'resolvido', gravidade: 'Grave', anexos: []},
    {id: 103, descricao: 'O Hacker da Meia-Noite', data_ocorrido: '2021-08-01', data_finalizacao: '2021-11-11', cidade: 'Florianópolis', status: 'resolvido', gravidade: 'Grave', anexos: []},
    {id: 104, descricao: 'Caso da Herança Envenenada', data_ocorrido: '2018-11-10', data_finalizacao: '2019-03-15', cidade: 'Joinville', status: 'resolvido', gravidade: 'Gravíssimo', anexos: []},
    {id: 105, descricao: 'A Quadrilha do PIX', data_ocorrido: '2022-01-30', data_finalizacao: '2022-03-05', cidade: 'Chapecó', status: 'resolvido', gravidade: 'Médio', anexos: []},
    {id: 106, descricao: 'O Ladrão de Orquídeas Raras', data_ocorrido: '2017-07-22', data_finalizacao: '2017-08-01', cidade: 'Timbó', status: 'resolvido', gravidade: 'Baixo', anexos: []},
    {id: 107, descricao: 'O Cão dos Baskervilles (SC)', data_ocorrido: '2015-03-12', data_finalizacao: '2015-06-20', cidade: 'Urubici', status: 'resolvido', gravidade: 'Gravíssimo', anexos: []},
    {id: 108, descricao: 'O Escândalo da Liga dos Cabeças Vermelhas', data_ocorrido: '2016-09-01', data_finalizacao: '2016-09-15', cidade: 'Lages', status: 'resolvido', gravidade: 'Médio', anexos: []},
    {id: 109, descricao: 'Um Estudo em Escarlate (Joinville)', data_ocorrido: '2014-01-19', data_finalizacao: '2014-04-01', cidade: 'Joinville', status: 'resolvido', gravidade: 'Gravíssimo', anexos: []},
    {id: 110, descricao: 'O Signo dos Quatro (Itajaí)', data_ocorrido: '2013-06-25', data_finalizacao: '2013-08-10', cidade: 'Itajaí', status: 'resolvido', gravidade: 'Grave', anexos: []},
    {id: 111, descricao: 'O Problema Final (Gaspar)', data_ocorrido: '2018-05-04', data_finalizacao: '2018-08-04', cidade: 'Gaspar', status: 'resolvido', gravidade: 'Crítico', anexos: []},
    {id: 112, descricao: 'O Vale do Medo (Rio do Sul)', data_ocorrido: '2019-10-15', data_finalizacao: '2020-01-20', cidade: 'Rio do Sul', status: 'resolvido', gravidade: 'Grave', anexos: []},
];

const victimsRaw: Omit<Victim, 'status'>[] = [
    {id: 1, nome: 'Dr. Arthur Valadares', idade: 65, ocupacao: 'Curador de Arte'},
    {id: 2, nome: 'Beatriz Rocha', idade: 42, ocupacao: 'Colecionadora de Arte'},
    {id: 3, nome: 'Fernando Lima', idade: 38, ocupacao: 'Diretor de Tecnologia'},
    {id: 4, nome: 'Cláudia Monte Carlo', idade: 55, ocupacao: 'Empresário'},
    {id: 7, nome: 'Marcos Andrade', idade: 29, ocupacao: 'Empresário'},
    {id: 9, nome: 'José Ferreira', idade: 48, ocupacao: 'Caminhoneiro'},
    {id: 11, nome: 'Sérgio Matos', idade: 51, ocupacao: 'Fiscal da Prefeitura'},
    {id: 14, nome: 'Adalberto Schmidt', idade: 62, ocupacao: 'Agricultor'},
    {id: 15, nome: 'Larissa Campos', idade: 23, ocupacao: 'Influenciadora Digital'},
    {id: 16, nome: 'Ricardo Alves', idade: 35, ocupacao: 'Desempregado'},
    {id: 17, nome: 'Helena Costa', idade: 49, ocupacao: 'Diretora Escolar'},
    {id: 18, nome: 'Pedro Mendes', idade: 34, ocupacao: 'Agente Ambiental'},
    {id: 20, nome: 'Laura Martins', idade: 31, ocupacao: 'Astronauta'},
    {id: 21, nome: 'Alfred Pennyworth', idade: 68, ocupacao: 'Diretor de Fundação'},
    {id: 22, nome: 'Dr. Elias Bastos', idade: 71, ocupacao: 'Bibliotecário Chefe'},
    {id: 26, nome: 'Júlia Neves', idade: 45, ocupacao: 'CEO'},
    {id: 27, nome: 'Roberto Medeiros', idade: 58, ocupacao: 'Empresário'},
    {id: 28, nome: 'Dr. Helena Schultz', idade: 47, ocupacao: 'Engenheira Aeroespacial'},
    {id: 29, nome: 'Sindicato dos Metalúrgicos', idade: 0, ocupacao: 'Organização'},
    {id: 104, nome: 'Coronel Adalberto Menezes', idade: 78, ocupacao: 'Militar Aposentado'},
];

const evidencesRaw: Evidence[] = [
    {id: 1, descricao: 'Fragmento de código em e-mail criptografado', data_descoberta: '2023-05-20', local_encontrado: 'Servidor da Galeria', analise_forense: true, chainOfCustody: [{ timestamp: '2023-05-20T11:00:00Z', user: 'Ricardo Neves', action: 'Coletado da cena do crime' }]},
    {id: 2, descricao: 'Transação anônima em criptomoeda para uma carteira offline', data_descoberta: '2023-11-10', local_encontrado: 'Rede da TechCorp', analise_forense: true, chainOfCustody: [{ timestamp: '2023-11-10T15:30:00Z', user: 'Marco Aurélio', action: 'Isolado do log de transações' }]},
    {id: 3, descricao: 'Poeira rara, não nativa da região, encontrada no duto de ventilação', data_descoberta: '2022-10-22', local_encontrado: 'Museu Histórico', analise_forense: true, chainOfCustody: [{ timestamp: '2022-10-22T09:45:00Z', user: 'Ricardo Neves', action: 'Coletado com amostrador de partículas' }]},
    {id: 4, descricao: 'Impressões digitais parciais em uma ferramenta de arrombamento', data_descoberta: '2024-02-10', local_encontrado: 'Joalheria', analise_forense: true, chainOfCustody: [{ timestamp: '2024-02-10T03:15:00Z', user: 'Roberto Lima', action: 'Coletado da cena do crime' }]},
    {id: 6, descricao: 'Carta de baralho (Coringa) deixada na cena do crime', data_descoberta: '2025-08-20', local_encontrado: 'Sede da Fundação Vayne', analise_forense: true, chainOfCustody: [{ timestamp: '2025-08-20T22:05:00Z', user: 'Sherlock Holmes', action: 'Coletado da mesa' }]},
    {id: 7, descricao: 'Manuscrito com cifra musical indecifrável', data_descoberta: '2025-09-01', local_encontrado: 'Biblioteca Nacional', analise_forense: true, chainOfCustody: []},
    {id: 8, descricao: 'Fibra de um casaco de tweed incomum', data_descoberta: '2025-09-01', local_encontrado: 'Biblioteca Nacional', analise_forense: true, chainOfCustody: []},
    {id: 10, descricao: 'Pegada digital de acesso remoto não autorizado', data_descoberta: '2024-05-11', local_encontrado: 'Servidores da CryptoMoedasJá', analise_forense: true, chainOfCustody: []},
    {id: 11, descricao: 'Relatório de anomalia na rede elétrica do prédio', data_descoberta: '2023-11-01', local_encontrado: 'Data Center TechCorp', analise_forense: true, chainOfCustody: []},
    {id: 12, descricao: 'Login de administrador usado fora do horário de expediente', data_descoberta: '2023-11-02', local_encontrado: 'Logs de Acesso TechCorp', analise_forense: true, chainOfCustody: []},
    {id: 13, descricao: 'Malware específico "GhostKey" encontrado nos logs', data_descoberta: '2023-05-16', local_encontrado: 'Servidor da Galeria', analise_forense: true, chainOfCustody: []},
    {id: 14, descricao: 'Depoimento de especialista em arte sobre a falsificação', data_descoberta: '2023-06-01', local_encontrado: 'Relatório Policial', analise_forense: false, chainOfCustody: []},
    {id: 15, descricao: 'Resíduo de pólvora em uma das páginas do manuscrito', data_descoberta: '2025-09-02', local_encontrado: 'Laboratório Forense', analise_forense: true, chainOfCustody: []},
    {id: 16, descricao: 'Mapa de Londres antigo com anotações encontrado na biblioteca', data_descoberta: '2025-09-03', local_encontrado: 'Biblioteca Nacional', analise_forense: false, chainOfCustody: []},
    {id: 19, descricao: 'Ferramenta de corte de vidro de alta precisão encontrada no local', data_descoberta: '2022-10-21', local_encontrado: 'Museu Histórico', analise_forense: true, chainOfCustody: []},
    {id: 20, descricao: 'Enigma adicional encontrado em um jornal local', data_descoberta: '2025-08-22', local_encontrado: 'Jornal de Balneário', analise_forense: false, chainOfCustody: []},
    {id: 21, descricao: 'Nenhuma imagem de segurança capturou a entrada ou saída.', data_descoberta: '2025-06-11', local_encontrado: 'Laboratório da AeroTech', analise_forense: false, chainOfCustody: []},
    {id: 22, descricao: 'Dados criptografados foram exfiltrados para um servidor offshore.', data_descoberta: '2025-07-06', local_encontrado: 'Rede do Sindicato', analise_forense: true, chainOfCustody: []},
];

const witnessesRaw: Omit<Witness, 'depoimentos'>[] = [
    {id: 1, nome: 'Antônio Borges (Guarda Noturno)', confiabilidade: 'alta'},
    {id: 2, nome: 'Clara Rios (Analista de Sistemas)', confiabilidade: 'alta'},
    {id: 3, nome: 'Anônimo', confiabilidade: 'media'},
    {id: 4, nome: 'Vizinho', confiabilidade: 'baixa'},
    {id: 5, nome: 'O Corvo', confiabilidade: 'media'},
    {id: 6, nome: 'Sentinela', confiabilidade: 'alta'},
    {id: 7, nome: 'Oráculo', confiabilidade: 'alta'},
    {id: 8, nome: 'Engenheiro de plantão', confiabilidade: 'alta'},
];

const forenseAnalysesRaw: Omit<ForenseAnalysis, 'case'|'evidence'|'suspectMatch'|'aiReport'>[] = [
    {id: 1, id_caso: 3, id_evidencia: 2, tipo: 'DNA', status: 'Pendente', id_suspeito_match: null },
    {id: 2, id_caso: 4, id_evidencia: 4, tipo: 'Impressão Digital', status: 'Correspondência', id_suspeito_match: 101 },
    {id: 3, id_caso: 22, id_evidencia: 8, tipo: 'Fibra', status: 'Sem Correspondência', id_suspeito_match: 108 },
    {id: 4, id_caso: 22, id_evidencia: 15, tipo: 'Balística', status: 'Pendente', id_suspeito_match: null },
    {id: 5, id_caso: 1, id_evidencia: 19, tipo: 'Impressão Digital', status: 'Pendente', id_suspeito_match: null },
];

const casos_detetives = [
    {id_caso: 1, id_detetive: 1}, {id_caso: 2, id_detetive: 1}, {id_caso: 3, id_detetive: 1}, {id_caso: 7, id_detetive: 1}, {id_caso: 26, id_detetive: 1}, {id_caso: 27, id_detetive: 1}, {id_caso: 101, id_detetive: 1}, {id_caso: 104, id_detetive: 1}, {id_caso: 28, id_detetive: 1},
    {id_caso: 2, id_detetive: 2}, {id_caso: 3, id_detetive: 2}, {id_caso: 7, id_detetive: 2}, {id_caso: 15, id_detetive: 2}, {id_caso: 26, id_detetive: 2}, {id_caso: 103, id_detetive: 2}, {id_caso: 105, id_detetive: 2}, {id_caso: 29, id_detetive: 2},
    {id_caso: 1, id_detetive: 3}, {id_caso: 3, id_detetive: 3}, {id_caso: 22, id_detetive: 3}, {id_caso: 27, id_detetive: 3}, {id_caso: 104, id_detetive: 3}, {id_caso: 28, id_detetive: 3},
    {id_caso: 16, id_detetive: 4}, {id_caso: 105, id_detetive: 4},
    {id_caso: 9, id_detetive: 5}, {id_caso: 102, id_detetive: 5},
    {id_caso: 18, id_detetive: 6},
    {id_caso: 21, id_detetive: 7}, {id_caso: 22, id_detetive: 7}, {id_caso: 106, id_detetive: 7}, {id_caso: 107, id_detetive: 7}, {id_caso: 108, id_detetive: 7}, {id_caso: 109, id_detetive: 7}, {id_caso: 110, id_detetive: 7}, {id_caso: 111, id_detetive: 7}, {id_caso: 112, id_detetive: 7},
];

const casos_suspeitos = [
    {id_caso: 1, id_suspeito: 100}, {id_caso: 4, id_suspeito: 101}, {id_caso: 17, id_suspeito: 101}, {id_caso: 20, id_suspeito: 102}, {id_caso: 10, id_suspeito: 104}, {id_caso: 11, id_suspeito: 106}, {id_caso: 21, id_suspeito: 107}, {id_caso: 22, id_suspeito: 108}, {id_caso: 28, id_suspeito: 109},
    {id_caso: 3, id_suspeito: 100}, {id_caso: 3, id_suspeito: 105}, {id_caso: 3, id_suspeito: 106},
    {id_caso: 26, id_suspeito: 100}, {id_caso: 26, id_suspeito: 105},
    {id_caso: 2, id_suspeito: 102}, {id_caso: 2, id_suspeito: 105},
    {id_caso: 7, id_suspeito: 102}, {id_caso: 7, id_suspeito: 105},
    {id_caso: 9, id_suspeito: 103}, {id_caso: 9, id_suspeito: 106},
    {id_caso: 14, id_suspeito: 103},
    {id_caso: 27, id_suspeito: 100}, {id_caso: 27, id_suspeito: 104},
    {id_caso: 29, id_suspeito: 105},
];

const casos_evidencias = [
    {id_caso: 1, id_evidencia: 3}, {id_caso: 1, id_evidencia: 19},
    {id_caso: 2, id_evidencia: 1}, {id_caso: 2, id_evidencia: 13}, {id_caso: 2, id_evidencia: 14},
    {id_caso: 3, id_evidencia: 2}, {id_caso: 3, id_evidencia: 11}, {id_caso: 3, id_evidencia: 12},
    {id_caso: 4, id_evidencia: 4},
    {id_caso: 7, id_evidencia: 10},
    {id_caso: 21, id_evidencia: 6}, {id_caso: 21, id_evidencia: 20},
    {id_caso: 22, id_evidencia: 7}, {id_caso: 22, id_evidencia: 8}, {id_caso: 22, id_evidencia: 15}, {id_caso: 22, id_evidencia: 16},
    {id_caso: 28, id_evidencia: 21}, {id_caso: 29, id_evidencia: 22},
];

const casos_vitimas = [
    {id_caso: 1, id_vitima: 1}, {id_caso: 2, id_vitima: 2}, {id_caso: 3, id_vitima: 3}, {id_caso: 4, id_vitima: 4}, {id_caso: 7, id_vitima: 7}, {id_caso: 9, id_vitima: 9}, {id_caso: 11, id_vitima: 11}, {id_caso: 14, id_vitima: 14}, {id_caso: 15, id_vitima: 15}, {id_caso: 16, id_vitima: 16}, {id_caso: 17, id_vitima: 17}, {id_caso: 18, id_vitima: 18}, {id_caso: 20, id_vitima: 20}, {id_caso: 21, id_vitima: 21}, {id_caso: 22, id_vitima: 22}, {id_caso: 26, id_vitima: 26}, {id_caso: 27, id_vitima: 27}, {id_caso: 28, id_vitima: 28}, {id_caso: 29, id_vitima: 29}, {id_caso: 104, id_vitima: 104},
];

const casos_testemunhas: {id_caso: number, id_testemunha: number, depoimento: string}[] = [
    {id_caso: 1, id_testemunha: 1, depoimento: 'O alarme não tocou. Foi como se o ladrão fosse um fantasma.'},
    {id_caso: 3, id_testemunha: 2, depoimento: 'A invasão foi perfeita. Não deixou rastros comuns.'},
    {id_caso: 2, id_testemunha: 3, depoimento: 'Ouvi dizer que a "Dama de Copas" estava planejando um novo golpe.'},
    {id_caso: 10, id_testemunha: 3, depoimento: 'O incêndio no galpão não foi acidente, foi queima de arquivo.'},
    {id_caso: 18, id_testemunha: 3, depoimento: 'Tem um novo traficante de animais na região de Caçador.'},
    {id_caso: 20, id_testemunha: 3, depoimento: 'A fraude do seguro foi feita por alguém de dentro da empresa.'},
    {id_caso: 21, id_testemunha: 3, depoimento: 'O Coringa de Ouro é só o começo.'},
    {id_caso: 4, id_testemunha: 4, depoimento: 'Vi um carro estranho parado na rua por volta das 2 da manhã.'},
    {id_caso: 1, id_testemunha: 5, depoimento: "O Colar da Imperatriz foi vendido no mercado negro de Dubai."},
    {id_caso: 3, id_testemunha: 5, depoimento: "O 'Sombra' não suja as mãos, ele usa peões para o trabalho pesado."},
    {id_caso: 22, id_testemunha: 5, depoimento: "O Manuscrito Cifrado é um mapa para uma fortuna escondida."},
    {id_caso: 27, id_testemunha: 5, depoimento: "A sabotagem na marina foi para acobertar uma operação de contrabando."},
    {id_caso: 9, id_testemunha: 6, depoimento: "A carga de eletrônicos foi descarregada em um depósito na saída da cidade."},
    {id_caso: 16, id_testemunha: 6, depoimento: "O assassinato no bar foi resultado de uma briga de gangues pelo controle da área."},
    {id_caso: 15, id_testemunha: 7, depoimento: "A extorsão da influenciadora foi feita por um hacker amador querendo se provar."},
    {id_caso: 7, id_testemunha: 7, depoimento: "O esquema de pirâmide usava uma vulnerabilidade em uma nova plataforma de cripto."},
    {id_caso: 26, id_testemunha: 7, depoimento: "A invasão ao Cripto-Banco foi orchestrada pela 'A Hacker' a mando do 'Sombra'."},
    {id_caso: 28, id_testemunha: 8, depoimento: 'A porta do laboratório estava trancada, mas o protótipo sumiu. Parece mágica.'},
];

export const aiSummaries: Record<number, string> = {
  3: "Resumo gerado por I.A.: O caso envolve o desaparecimento de um executivo de alta tecnologia, Fernando Lima. Evidências sugerem um sequestro complexo, possivelmente ligado a segredos corporativos. A Célula Criminosa, liderada por 'O Sombra' e com a participação de 'A Hacker' e 'O Brutamontes', é a principal linha de investigação. Transações em criptomoeda e um malware específico são as pistas mais fortes. A resolução é crítica devido à importância da vítima e à sofisticação dos suspeitos.",
  26: "Resumo gerado por I.A.: O Grande Assalto ao Cripto-Banco foi uma operação digital de alta complexidade, resultando no desvio de milhões em ativos digitais. A investigação aponta para 'A Hacker' como a executora técnica, com indícios de que a mente por trás da operação seja 'O Sombra'. As evidências digitais são a chave, mas estão fortemente criptografadas, exigindo a expertise combinada dos detetives Sofia Costa e Marco Aurélio.",
  28: "Resumo gerado por I.A.: O caso do protótipo da AeroTech é um mistério de 'sala trancada'. O suspeito, 'O Fantasma', parece ter contornado sistemas de segurança de ponta sem deixar vestígios. A falta de evidências físicas aponta para um crime de alta tecnologia, possivelmente com auxílio interno. A recuperação do protótipo é de segurança nacional."
};

export const aiProfiles: Record<number, string> = {
  100: "Perfil Gerado por I.A.: 'O Sombra' (Ricardo Vargas) exibe traços de um planejador mestre, com alta inteligência e narcisismo. Opera com precisão, evitando envolvimento direto e utilizando subordinados para execução. Sua pontuação de perigo (95) é justificada por sua capacidade de manipulação e planejamento a longo prazo. A falta de condenações sugere extrema cautela e habilidade em apagar rastros. Provavelmente motivado por poder e desafio intelectual, mais do que por ganho financeiro puro.",
  105: "Perfil Gerado por I.A.: 'A Hacker' (Bianca Oliveira) é uma especialista em cibersegurança com habilidades excepcionais em invasão de sistemas. Sua pontuação de perigo (90) deriva de sua capacidade de causar danos massivos à infraestrutura digital e financeira. Psicologicamente, parece ser motivada pela emoção do desafio e pela demonstração de superioridade intelectual. Frequentemente colabora com 'O Sombra', indicando uma possível aliança estratégica ou dependência.",
  109: "Perfil Gerado por I.A.: 'O Fantasma' é uma incógnita. A ausência de registros sugere um profissional de elite, possivelmente com treinamento militar ou de agências de inteligência. Opera com foco total no objetivo, demonstrando paciência e planejamento meticuloso. Sua pontuação de perigo (92) reflete a ameaça de um inimigo invisível e altamente competente. A motivação é provavelmente financeira ou espionagem industrial."
};

export const aiModusOperandi: Record<number, string> = {
    100: "Modus Operandi (M.O.) por I.A.: O Sombra utiliza planejamento meticuloso, explora falhas humanas e tecnológicas, e emprega uma rede de especialistas para executar operações complexas. Prefere crimes com alto ganho intelectual ou estratégico, como espionagem corporativa e grandes fraudes. Evita violência direta, optando pela manipulação e pelo controle de informações como suas principais armas.",
    105: "Modus Operandi (M.O.) por I.A.: A Hacker especializa-se em engenharia social e exploração de vulnerabilidades de dia zero. Utiliza malware customizado para evitar detecção. Seu alvo principal são grandes corporações financeiras e de tecnologia. Frequentemente deixa uma 'assinatura' digital sutil, um desafio para os investigadores, indicando um desejo de reconhecimento por sua habilidade.",
    109: "Modus Operandi (M.O.) por I.A.: O Fantasma opera com base em infiltração física e digital, sem deixar rastros. Seu M.O. inclui o uso de disfarces, a desativação de sistemas de segurança de forma não destrutiva e a exploração de rotinas de segurança. Age de forma solitária e demonstra disciplina extrema, sugerindo treinamento formal em espionagem."
};

export const aiDetectiveProfiles: Record<number, string> = {
    1: "Análise de Performance (I.A.): A Delegada Sofia Costa demonstra um padrão de sucesso em casos que envolvem múltiplas variáveis e análise de comportamento. Sua alta taxa de resolução em crimes complexos (Casos 3, 26, 27) sugere uma forte aptidão para conectar evidências aparentemente não relacionadas. Recomenda-se a sua alocação em investigações que exijam uma visão estratégica e a coordenação de múltiplas frentes de apuração.",
    2: "Análise de Performance (I.A.): O Investigador Marco Aurélio é um especialista cibernético de elite. Seus sucessos nos casos de fraude digital (2, 7) e hacking (103, 105) são notáveis. A análise de seus métodos revela uma abordagem metódica e persistente na análise de dados e rastreamento de pegadas digitais. É o agente ideal para qualquer caso com componente tecnológico significativo, especialmente aqueles envolvendo criptomoedas e vazamento de dados.",
    7: "Análise de Performance (I.A.): Sherlock Holmes possui uma taxa de sucesso de 100% em uma variedade de casos que foram considerados insolúveis por outros. Sua metodologia se baseia em observação aguçada e lógica dedutiva, muitas vezes ignorando o impossível para encontrar a verdade no improvável. Sua eficácia não é medida por estatísticas convencionais, mas por sua capacidade única de resolver enigmas que desafiam a investigação padrão. Ideal para casos 'Críticos' e 'cold cases'."
};

export const aiWitnessAnalysis: Record<number, string> = {
    1: "Análise de Depoimento (I.A.): Palavras-chave: 'alarme não tocou', 'fantasma'. A ausência do alarme é um ponto crítico, sugerindo manipulação interna do sistema ou uma falha deliberada. A palavra 'fantasma' indica uma operação silenciosa e profissional, sem sinais de arrombamento forçado. Foco da investigação: verificar logs de segurança internos e a possibilidade de um suspeito com conhecimento técnico avançado.",
    2: "Análise de Depoimento (I.A.): Palavras-chave: 'invasão perfeita', 'sem rastros comuns'. Sentimento: Admiração pela habilidade técnica do criminoso. Isso sugere que a testemunha, sendo uma analista de sistemas, reconhece a sofisticação do ataque. A ausência de 'rastros comuns' aponta para um hacker de elite, provavelmente utilizando ferramentas personalizadas e técnicas de ofuscação. Pista principal: procurar por anomalias de rede extremamente sutis, ao invés de assinaturas de malware conhecidas.",
    6: "Análise de Depoimento (I.A.): Análise cruzada de depoimentos: O relato sobre a 'carga de eletrônicos' (Caso 9) sendo descarregada em um depósito na saída da cidade, quando combinado com o relato sobre a 'briga de gangues' (Caso 16), sugere uma possível conexão entre as duas atividades criminosas. A briga pode ter sido por controle territorial para o armazenamento e distribuição de bens roubados. Recomenda-se investigar a relação entre as gangues e os locais de depósito conhecidos na área mencionada."
};

export const aiForenseAnalysis: Record<number, AIForenseAnalysis> = {
    1: { matchProbability: 99.8, markers: ['D8S1179', 'D21S11', 'D7S820', 'CSF1PO'], conclusion: 'Correspondência Positiva', summary: "A análise de DNA da transação em criptomoeda (Evidência #2) revela uma correspondência de 99.8% com o perfil genético do suspeito 'O Sombra'. Marcadores genéticos chave foram confirmados, vinculando-o diretamente à evidência digital." },
    2: { matchProbability: 100, markers: ['Arco', 'Presilha', 'Verticilo'], conclusion: 'Correspondência Exata', summary: "As impressões digitais parciais (Evidência #4) correspondem perfeitamente aos registros de 'Mão Leve'. Três pontos de identificação únicos foram confirmados. A evidência é conclusiva." },
    3: { conclusion: 'Sem Correspondência', summary: "A fibra do casaco de tweed (Evidência #8) não corresponde a nenhuma peça de vestuário conhecida de 'Professor Moriarty'. A análise microscópica e de composição química exclui o suspeito como a fonte da fibra." },
    4: { conclusion: 'Análise Inconclusiva', summary: 'O resíduo de pólvora (Evidência #15) está muito degradado para uma análise balística conclusiva. Não é possível determinar a arma de origem ou vincular a um suspeito específico com os dados atuais.' },
    5: { conclusion: 'Sem Correspondência', summary: "A análise das impressões digitais na ferramenta de corte de vidro (Evidência #19) não encontrou correspondência com 'O Sombra'. As digitais pertencem a um indivíduo não identificado no banco de dados." },
};

export const initialRawData: RawData = {
    detectivesRaw,
    suspectsRaw,
    casesRaw,
    victimsRaw,
    evidencesRaw,
    witnessesRaw,
    forenseAnalysesRaw,
    casos_detetives,
    casos_suspeitos,
    casos_evidencias,
    casos_vitimas,
    casos_testemunhas
};


export const processData = (rawData: RawData): ProcessedData => {
    const dangerScores: {[key: number]: number} = {100: 95, 101: 30, 102: 75, 103: 60, 104: 85, 105: 90, 106: 50, 107: 98, 108: 100, 109: 92};
    
    const customDetectivePhotos: {[key: number]: string} = {
        1: 'https://i.imgur.com/W1Xd1M1.png', // Sofia Costa
        2: 'https://i.imgur.com/b1B13qi.png', // Marco Aurélio
        3: 'https://i.imgur.com/TMYmznH.png', // Ricardo Neves
        4: 'https://i.imgur.com/yKqsbjb.png', // Juliana Santos
        5: 'https://i.imgur.com/8IACfsa.png', // Roberto Lima
        6: 'https://i.imgur.com/E09hs1W.png', // Laura Bastos
        7: 'https://i.imgur.com/vOrTWdv.png', // Sherlock Holmes
    };

    const detectives: Detective[] = rawData.detectivesRaw.map((d) => ({
        ...d,
        foto: customDetectivePhotos[d.id] || `https://api.dicebear.com/8.x/adventurer/svg?seed=${d.nome.replace(/\s/g, '')}&radius=50`
    }));
    
    const customSuspectPhotos: {[key: number]: string} = {
        108: 'https://i.imgur.com/3Fheynj.png', // Professor Moriarty
        100: 'https://i.imgur.com/12PJstc.png', // O Sombra
        105: 'https://i.imgur.com/e7IyY4a.png', // A Hacker
        104: 'https://i.imgur.com/QLVulmy.png', // O Químico
        102: 'https://i.imgur.com/wTMe9yb.png', // Dama de Copas
        103: 'https://i.imgur.com/EKThHH2.png', // CJ
        106: 'https://i.imgur.com/iVmvwzP.png', // O Brutamontes
        101: 'https://i.imgur.com/nvNml76.png',  // Mão Leve
        107: 'https://i.imgur.com/lKRE4zv.png',  // O Charadista
        109: 'https://i.imgur.com/lKRE4zv.png'   // O Fantasma
    };

    const suspects: Suspect[] = rawData.suspectsRaw.map(s => {
        const fotoUrl = customSuspectPhotos[s.id] || `https://api.dicebear.com/8.x/avataaars-neutral/svg?seed=${s.nome.replace(/\s/g, '')}&radius=50`;

        return {
            ...s,
            pontuacao_perigo: dangerScores[s.id] || 20,
            foto: fotoUrl,
        };
    });
    
    // Add simulated status to victims with a more optimistic distribution
    const victims: Victim[] = rawData.victimsRaw.map((v) => {
        const weightedStatuses: ('Viva' | 'Morta' | 'Desaparecida')[] = ['Viva', 'Viva', 'Viva', 'Viva', 'Desaparecida', 'Morta'];
        return {...v, status: weightedStatuses[v.id % weightedStatuses.length]};
    });

    const witnesses: Witness[] = rawData.witnessesRaw;

    const cases: Case[] = rawData.casesRaw.map(c => {
        const detectiveIds = rawData.casos_detetives.filter(cd => cd.id_caso === c.id).map(cd => cd.id_detetive);
        const suspectIds = rawData.casos_suspeitos.filter(cs => cs.id_caso === c.id).map(cs => cs.id_suspeito);
        const evidenceIds = rawData.casos_evidencias.filter(ce => ce.id_caso === c.id).map(ce => ce.id_evidencia);
        const victimIds = rawData.casos_vitimas.filter(cv => cv.id_caso === c.id).map(cv => cv.id_vitima);
        
        const caseWitnessLinks = rawData.casos_testemunhas.filter(ct => ct.id_caso === c.id);
        const witnessIdsInCase = [...new Set(caseWitnessLinks.map(ct => ct.id_testemunha))];
        const testemunhasForCase = witnessIdsInCase.map(witnessId => {
            const witnessData = witnesses.find(w => w.id === witnessId)!;
            const depoimentos = caseWitnessLinks
                .filter(link => link.id_testemunha === witnessId)
                .map(link => link.depoimento);
            return { ...witnessData, depoimentos };
        });

        const isCriminalCell = suspectIds.length > 1;

        const today = new Date();
        const ocorridoDate = new Date(c.data_ocorrido);
        let tempo_ativo_dias = 0;

        if (c.status === 'investigação' || c.status === 'reaberta') {
            const diffTime = today.getTime() - ocorridoDate.getTime();
            tempo_ativo_dias = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
        } else if (c.data_finalizacao) {
            const finalizacaoDate = new Date(c.data_finalizacao);
            if (c.status === 'resolvido') {
                const diffTime = finalizacaoDate.getTime() - ocorridoDate.getTime();
                tempo_ativo_dias = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
            } else if (c.status === 'arquivada') {
                const diffTime = today.getTime() - finalizacaoDate.getTime();
                tempo_ativo_dias = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));
            }
        }


        return {
            ...c,
            tempo_ativo_dias,
            detetives: detectives.filter(d => detectiveIds.includes(d.id)),
            suspeitos: suspects.filter(s => suspectIds.includes(s.id)),
            vitimas: victims.filter(v => victimIds.includes(v.id)),
            testemunhas: testemunhasForCase,
            evidencias: rawData.evidencesRaw.filter(e => evidenceIds.includes(e.id)),
            isCriminalCell,
            anexos: c.anexos || [],
        };
    });

    const detectivesWithStats = detectives.map(d => {
        const assignedCases = cases.filter(c => c.detetives.some(det => det.id === d.id));
        const resolvedCasesCount = assignedCases.filter(c => c.status === 'resolvido').length;
        const totalCases = assignedCases.length;
        const successRate = totalCases > 0 ? Math.round((resolvedCasesCount / totalCases) * 100) : 0;
        return {...d, cases: assignedCases, totalCases, resolvedCases: resolvedCasesCount, successRate};
    });

    const suspectsWithCases = suspects.map(s => {
        const allCasesForSuspect = cases.filter(c => 
            c.suspeitos.some(sus => sus.id === s.id)
        );
        const activeCases = allCasesForSuspect.filter(c => 
            (c.status === 'investigação' || c.status === 'reaberta')
        );

        // Find associates
        const associateIds = new Set<number>();
        allCasesForSuspect.forEach(c => {
            c.suspeitos.forEach(coSuspect => {
                if (coSuspect.id !== s.id) {
                    associateIds.add(coSuspect.id);
                }
            });
        });
        const associates = suspects.filter(sus => associateIds.has(sus.id));

        const isKeySuspect = activeCases.length > 1 || associates.length > 0;
        return {...s, activeCases, allCases: allCasesForSuspect, isKeySuspect, associates };
    });
    
    const victimsWithCase = victims.map(v => {
        const caseId = rawData.casos_vitimas.find(cv => cv.id_vitima === v.id)?.id_caso;
        const associatedCase = cases.find(c => c.id === caseId);
        return {...v, case: associatedCase};
    });

    const witnessesWithCaseCount = witnesses.map(w => {
        const witnessCaseLinks = rawData.casos_testemunhas.filter(ct => ct.id_testemunha === w.id);
        const caseCount = witnessCaseLinks.length;
        const depoimentos = witnessCaseLinks.map(l => l.depoimento);
        return {...w, caseCount, depoimentos };
    });

    const evidencesWithCase = rawData.evidencesRaw.map(e => {
        const caseId = rawData.casos_evidencias.find(ce => ce.id_evidencia === e.id)?.id_caso;
        const associatedCase = cases.find(c => c.id === caseId);
        return {...e, case: associatedCase};
    });

    const forenseAnalyses = rawData.forenseAnalysesRaw.map(fa => ({
        ...fa,
        case: cases.find(c => c.id === fa.id_caso),
        evidence: rawData.evidencesRaw.find(e => e.id === fa.id_evidencia),
        suspectMatch: suspects.find(s => s.id === fa.id_suspeito_match),
        aiReport: aiForenseAnalysis[fa.id],
    }));

    const activeCasesForStats = cases.filter(c => c.status === 'investigação' || c.status === 'reaberta');
    const totalActiveCases = activeCasesForStats.length;
    const criticalCases = cases.filter(c => c.gravidade === 'Crítico').length;
    const highDangerSuspects = suspects.filter(s => s.pontuacao_perigo > 80).length; // Adjusted threshold
    const totalSuccessRate = detectivesWithStats.reduce((acc, d) => acc + d.successRate, 0);
    const averageSuccessRate = detectivesWithStats.length > 0 ? Math.round(totalSuccessRate / detectivesWithStats.length) : 0;
    
    const totalActiveDays = activeCasesForStats.reduce((sum, c) => sum + c.tempo_ativo_dias, 0);
    const averageCaseAge = totalActiveCases > 0 ? Math.round(totalActiveDays / totalActiveCases) : 0;


    // Victim specific stats
    const occupationCounts: Record<string, number> = {};
    let totalAge = 0;
    let victimCountWithAge = 0;
    const statusCounts: Record<string, number> = { 'Viva': 0, 'Morta': 0, 'Desaparecida': 0 };
    const ageRanges: Record<string, number> = { '18-30': 0, '31-45': 0, '46-60': 0, '60+': 0};
    const ageDistributionRanges: Record<string, { min: number, max: number }> = {
      '18-30': { min: 18, max: 30 },
      '31-45': { min: 31, max: 45 },
      '46-60': { min: 46, max: 60 },
      '60+': { min: 61, max: Infinity },
    };


    victims.forEach(v => {
        if (v.ocupacao) occupationCounts[v.ocupacao] = (occupationCounts[v.ocupacao] || 0) + 1;
        if (v.idade) {
            totalAge += Number(v.idade); // Force conversion to number
            victimCountWithAge++;
        }
        statusCounts[v.status]++;
        
        if (v.idade) {
            const age = Number(v.idade); // Force conversion to number
            for (const range in ageDistributionRanges) {
                if (age >= ageDistributionRanges[range].min && age <= ageDistributionRanges[range].max) {
                    ageRanges[range]++;
                    break;
                }
            }
        }
    });
    
    const commonOccupations = Object.entries(occupationCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);

    const averageAge = victimCountWithAge > 0 ? Math.round(totalAge / victimCountWithAge) : 0;
    
    const statusDistribution = Object.entries(statusCounts).map(([name, count]) => ({ name: name as 'Viva' | 'Morta' | 'Desaparecida', count }));
    const ageDistribution = Object.entries(ageRanges).map(([range, count]) => ({ range, count }));
    
    const timelineEvents: TimelineEvent[] = [];
    
    cases.forEach(c => {
        timelineEvents.push({
            date: c.data_ocorrido,
            type: 'Ocorrência de Caso',
            description: `Início do caso: ${c.descricao}`,
            caseId: c.id,
            caseDescription: c.descricao
        });
    });

    rawData.evidencesRaw.forEach(e => {
        const caseLink = rawData.casos_evidencias.find(ce => ce.id_evidencia === e.id);
        if (caseLink) {
            const associatedCase = cases.find(c => c.id === caseLink.id_caso);
            if (associatedCase) {
                timelineEvents.push({
                    date: e.data_descoberta,
                    type: 'Evidência Encontrada',
                    description: `Evidência: "${e.descricao}"`,
                    caseId: associatedCase.id,
                    caseDescription: associatedCase.descricao
                });
            }
        }
    });

    timelineEvents.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());


    return {
        detectives: detectivesWithStats,
        suspeitos: suspectsWithCases,
        cases,
        victims: victimsWithCase,
        witnesses: witnessesWithCaseCount,
        evidences: evidencesWithCase,
        forenseAnalyses,
        stats: {
            totalActiveCases,
            criticalCases,
            highDangerSuspects,
            averageSuccessRate,
            averageCaseAge,
        },
        victimStats: {
            commonOccupations,
            averageAge,
            statusDistribution,
            ageDistribution,
        },
        timelineEvents,
    };
};