import { aiSummaries } from '../data';

// Mock function to simulate a network delay
const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * MOCK - Simula a geração de texto da I.A. para briefings estratégicos.
 * Esta função não faz uma chamada de API real. Ela retorna dados pré-definidos
 * dos resumos de IA para simular a funcionalidade em um ambiente de demonstração
 * sem expor chaves de API.
 */
export async function generateText(prompt: string): Promise<string> {
  console.log("MOCK AI CALL: generateText with prompt:", prompt);
  await sleep(1500); // Simula a latência da rede

  // Tenta extrair o ID do caso do prompt para retornar um resumo relevante
  if (prompt.includes('Desaparecimento do Diretor de Tecnologia da TechCorp')) {
      return aiSummaries[3];
  }
  if (prompt.includes('Grande Assalto ao Cripto-Banco')) {
      return aiSummaries[26];
  }
  if (prompt.includes('O Sumiço do Protótipo da AeroTech')) {
      return aiSummaries[28];
  }

  // Retorna um resumo genérico se não houver correspondência
  return "Análise de I.A. concluída. O caso apresenta alta complexidade, envolvendo múltiplos suspeitos com habilidades distintas. A evidência digital é crucial, mas requer análise aprofundada para descriptografia. Recomenda-se focar na rede de associados do principal suspeito para identificar o próximo passo.";
}

/**
 * MOCK - Simula a geração de texto a partir de uma imagem para análise de evidências.
 * Esta função não faz uma chamada de API real. Ela retorna um relatório de análise
 * genérico e plausível para fins de demonstração.
 */
export async function generateTextWithImage(
    prompt: string,
    image: { inlineData: { data: string; mimeType: string } }
): Promise<string> {
    console.log("MOCK AI CALL: generateTextWithImage");
    await sleep(2500); // Simula uma análise de imagem mais longa

    return `RELATÓRIO DE ANÁLISE PRELIMINAR:
- Objeto Principal: Ferramenta metálica, possivelmente uma chave de fenda customizada ou um pé-de-cabra de precisão.
- Marcas Distintivas: Inscrição parcial "...X-5..." visível sob ampliação. Pode ser parte de um número de série ou modelo.
- Material: Aço com alto teor de carbono, apresentando sinais de oxidação em pontos específicos.
- Observações: Marcas de desgaste sugerem uso repetido. Resíduos de uma substância oleosa foram detectados na ponta da ferramenta.
- Recomendação: Proceder com análise forense para coleta de impressões digitais e amostras de DNA. Comparar o design da ferramenta com o banco de dados de casos não resolvidos.`;
}
