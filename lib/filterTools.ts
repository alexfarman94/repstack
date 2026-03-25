import { Tool, Persona, Format } from './types';

export function filterTools(
  tools: Tool[],
  persona: Persona | 'all',
  format: Format | 'all'
): Tool[] {
  return tools.filter((tool) => {
    const personaMatch = persona === 'all' || tool.personas.includes(persona);
    const formatMatch = format === 'all' || tool.format === format;
    return personaMatch && formatMatch;
  });
}
