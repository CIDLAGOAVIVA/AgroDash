
import { Pool } from 'pg';

// A "pool" é mais eficiente para gerenciar múltiplas conexões
// A configuração será lida automaticamente das variáveis de ambiente
// PGHOST, PGUSER, PGPASSWORD, PGDATABASE, PGPORT
const pool = new Pool();

export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
};
