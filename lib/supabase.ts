import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Server-side client with service role (bypasses RLS — only use in API routes)
export function createServerClient() {
  return createClient(supabaseUrl, supabaseServiceKey);
}

// Supabase SQL schema to run in the Supabase console:
//
// CREATE TABLE accounts (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   user_id TEXT NOT NULL,
//   company_name TEXT NOT NULL,
//   industry TEXT,
//   size TEXT,
//   notes TEXT,
//   created_at TIMESTAMPTZ DEFAULT NOW()
// );
//
// CREATE TABLE documents (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   user_id TEXT NOT NULL,
//   account_id UUID REFERENCES accounts(id) ON DELETE CASCADE,
//   title TEXT NOT NULL,
//   content TEXT NOT NULL,
//   doc_type TEXT NOT NULL,
//   char_count INTEGER,
//   created_at TIMESTAMPTZ DEFAULT NOW()
// );
//
// CREATE TABLE agents (
//   id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//   user_id TEXT NOT NULL,
//   name TEXT NOT NULL,
//   description TEXT,
//   system_prompt TEXT NOT NULL,
//   inputs JSONB NOT NULL DEFAULT '[]',
//   created_at TIMESTAMPTZ DEFAULT NOW()
// );
