type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export interface Database {
  public: {
    Tables: {
      accounts: {
        Row: {
          id: string;
          user_id: string;
          company_name: string;
          industry: string | null;
          size: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          company_name: string;
          industry?: string | null;
          size?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          company_name?: string;
          industry?: string | null;
          size?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      opportunities: {
        Row: {
          id: string;
          user_id: string;
          account_id: string | null;
          name: string;
          stage: string | null;
          value: number | null;
          close_date: string | null;
          notes: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          account_id?: string | null;
          name: string;
          stage?: string | null;
          value?: number | null;
          close_date?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          account_id?: string | null;
          name?: string;
          stage?: string | null;
          value?: number | null;
          close_date?: string | null;
          notes?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'opportunities_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          }
        ];
      };
      documents: {
        Row: {
          id: string;
          user_id: string;
          account_id: string | null;
          opportunity_id: string | null;
          title: string;
          content: string;
          doc_type: string;
          char_count: number | null;
          storage_path: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          account_id?: string | null;
          opportunity_id?: string | null;
          title: string;
          content: string;
          doc_type: string;
          char_count?: number | null;
          storage_path?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          account_id?: string | null;
          opportunity_id?: string | null;
          title?: string;
          content?: string;
          doc_type?: string;
          char_count?: number | null;
          storage_path?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'documents_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'documents_opportunity_id_fkey';
            columns: ['opportunity_id'];
            isOneToOne: false;
            referencedRelation: 'opportunities';
            referencedColumns: ['id'];
          }
        ];
      };
      agents: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          system_prompt: string;
          inputs: Json;
          is_active: boolean;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          system_prompt: string;
          inputs?: Json;
          is_active?: boolean;
          created_by?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          system_prompt?: string;
          inputs?: Json;
          is_active?: boolean;
          created_by?: string | null;
          created_at?: string;
        };
        Relationships: [];
      };
      user_agents: {
        Row: {
          id: string;
          user_id: string;
          name: string;
          description: string | null;
          system_prompt: string;
          inputs: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          name: string;
          description?: string | null;
          system_prompt: string;
          inputs?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          name?: string;
          description?: string | null;
          system_prompt?: string;
          inputs?: Json;
          created_at?: string;
        };
        Relationships: [];
      };
      agent_runs: {
        Row: {
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
        };
        Insert: {
          id?: string;
          user_id: string;
          agent_id?: string | null;
          user_agent_id?: string | null;
          account_id?: string | null;
          opportunity_id?: string | null;
          input_context?: string | null;
          output?: string | null;
          tokens_used?: number | null;
          feedback?: number | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          agent_id?: string | null;
          user_agent_id?: string | null;
          account_id?: string | null;
          opportunity_id?: string | null;
          input_context?: string | null;
          output?: string | null;
          tokens_used?: number | null;
          feedback?: number | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: 'agent_runs_account_id_fkey';
            columns: ['account_id'];
            isOneToOne: false;
            referencedRelation: 'accounts';
            referencedColumns: ['id'];
          },
          {
            foreignKeyName: 'agent_runs_opportunity_id_fkey';
            columns: ['opportunity_id'];
            isOneToOne: false;
            referencedRelation: 'opportunities';
            referencedColumns: ['id'];
          }
        ];
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
}
