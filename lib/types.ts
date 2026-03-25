export type Persona = 'ae' | 'bdr' | 'se';
export type Format = 'prompt' | 'gpt' | 'embedded' | 'download';

export const PERSONA_LABELS: Record<Persona, string> = {
  ae: 'Account Executive',
  bdr: 'BDR',
  se: 'Sales Engineer',
};

export const FORMAT_LABELS: Record<Format, string> = {
  prompt: 'Prompt',
  gpt: 'GPT / Gem',
  embedded: 'Live',
  download: 'Download',
};

export const FORMAT_ICONS: Record<Format, string> = {
  prompt: '📋',
  gpt: '🔗',
  embedded: '⚡',
  download: '📥',
};

export interface ToolInput {
  id: string;
  label: string;
  type: 'textarea' | 'select' | 'text';
  placeholder: string;
  required: boolean;
  rows?: number;
  options?: string[];
}

export interface Tool {
  id: string;
  slug: string;
  title: string;
  hook: string;
  description: string;
  whyItMatters: string;
  body: string;
  useCases: string[];
  howToUse: string[];
  personas: Persona[];
  format: Format;
  tags: string[];
  free: boolean;
  inputs?: ToolInput[];
  systemPrompt?: string;
  content?: string;
  externalUrl?: string;
  downloadUrl?: string;
  featured: boolean;
  publishedAt: string;
}
