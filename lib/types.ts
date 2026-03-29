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

// ─── Database types ───────────────────────────────────────────────────────────

export interface Account {
  id: string;
  user_id: string;
  company_name: string;
  industry: string | null;
  size: string | null;
  notes: string | null;
  created_at: string;
}

export interface Document {
  id: string;
  user_id: string;
  account_id: string | null;
  opportunity_id: string | null;
  title: string;
  content: string;
  doc_type: 'transcript' | 'email' | 'deal_note' | 'proposal' | 'other';
  char_count: number | null;
  storage_path: string | null;
  created_at: string;
}

export interface CustomAgent {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  system_prompt: string;
  inputs: ToolInput[];
  created_at: string;
}

export interface PlatformAgent {
  id: string;
  name: string;
  description: string | null;
  inputs: ToolInput[];
  is_active: boolean;
  created_at: string;
}

export interface Opportunity {
  id: string;
  user_id: string;
  account_id: string | null;
  name: string;
  stage: string | null;
  value: number | null;
  close_date: string | null;
  notes: string | null;
  created_at: string;
}

export interface AgentRun {
  id: string;
  user_id: string;
  agent_id: string | null;
  user_agent_id: string | null;
  account_id: string | null;
  opportunity_id: string | null;
  input_context: string | null;
  output: string | null;
  tokens_used: number | null;
  feedback: number | null;
  created_at: string;
}

// ─── Tool types ───────────────────────────────────────────────────────────────

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
