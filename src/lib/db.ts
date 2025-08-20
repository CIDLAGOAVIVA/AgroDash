'use server';

import { Pool } from 'pg';

// A "pool" é mais eficiente para gerenciar múltiplas conexões
// A configuração será lida automaticamente das variáveis de ambiente
// PGHOST, PGUSER, PGPASSWORD, PGDATABASE, PGPORT
const pool = new Pool();

export const db = {
  query: (text: string, params?: any[]) => pool.query(text, params),
};

// Teste de conexão (opcional, mas bom para debug)
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Erro ao adquirir cliente do pool de conexões', err.stack);
  }
  console.log('Conectado ao banco de dados com sucesso!');
  client.release(); // Libera o cliente de volta para o pool
});
