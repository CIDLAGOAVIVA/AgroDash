
import 'dotenv/config';

// Inicializa o Pool do pg de forma "lazy" usando import() dinâmico.
// Isso evita que o bundler (Turbopack) tente resolver/externaizar
// o pacote `pg` em contextos onde ele não está disponível.
// A configuração será lida do arquivo .env
// DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT

let pool: any = null;

async function getPool() {
  if (!pool) {
    // Valida e normaliza variáveis de ambiente do Postgres antes de criar o pool.
    // Isso dá mensagens de erro mais claras (ex.: senha ausente ou não-string).
    const host = process.env.DB_HOST;
    const user = process.env.DB_USER;
    const password = process.env.DB_PASS;
    const database = process.env.DB_NAME;
    const port = process.env.DB_PORT ? Number(process.env.DB_PORT) : undefined;

    if (typeof password !== 'string' || password.length === 0) {
      // Não expomos a senha no log — apenas avisamos que está ausente/inválida.
      throw new Error('Missing or invalid Postgres password: ensure DB_PASS is set as a string in .env');
    }

    const config: any = { host, user, password, database };
    if (port) config.port = port;

    // import dinâmico no runtime (server-only)
    const pg = await import('pg');
    const Pool = (pg && (pg.Pool || (pg as any).default)) || pg;
    pool = new Pool(config);
  }
  return pool;
}

export const db = {
  query: async (text: string, params?: any[]) => {
    const p = await getPool();
    return p.query(text, params);
  },
};
