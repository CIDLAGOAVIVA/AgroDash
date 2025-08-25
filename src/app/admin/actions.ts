
'use server';

import { db } from '@/lib/db';
import type { Property, AdminCrop, Station, Sensor, Quantity, AlertCriterion } from '@/types';
import { revalidatePath } from 'next/cache';

// --- Funções de Propriedade ---
export async function getProperties(): Promise<Property[]> {
  try {
    const { rows } = await db.query('SELECT id, uf, municipio, nome_propriedade FROM tab_propriedade ORDER BY nome_propriedade');
    return rows.map(r => ({...r, id: String(r.id)}));
  } catch (error) {
    console.error("Database Error (getProperties):", error);
    // Retorna um array vazio em caso de erro para não quebrar a página.
    // O erro real será logado no console do servidor.
    return [];
  }
}

export async function saveProperty(data: Omit<Property, 'id'> & { id?: string }) {
  const { id, nome_propriedade, municipio, uf } = data;
  if (id) {
    // Update
    await db.query('UPDATE tab_propriedade SET nome_propriedade = $1, municipio = $2, uf = $3 WHERE id = $4', [nome_propriedade, municipio, uf, id]);
  } else {
    // Create
    await db.query('INSERT INTO tab_propriedade (nome_propriedade, municipio, uf) VALUES ($1, $2, $3)', [nome_propriedade, municipio, uf]);
  }
  revalidatePath('/admin');
}

export async function deleteProperty(id: string) {
  await db.query('DELETE FROM tab_propriedade WHERE id = $1', [id]);
  revalidatePath('/admin');
}


// --- Funções de Cultura (AdminCrop) ---
export async function getCrops(): Promise<AdminCrop[]> {
    try {
        const { rows } = await db.query(`
            SELECT id, id_propriedade, produto, nome_cultura 
            FROM tab_cultura ORDER BY nome_cultura
        `);
        return rows.map(r => ({
            id: String(r.id),
            propertyId: String(r.id_propriedade),
            cropType: r.produto,
            fieldName: r.nome_cultura,
        }));
    } catch (error) {
        console.error("Database Error (getCrops):", error);
        return [];
    }
}


export async function saveCrop(data: Omit<AdminCrop, 'id'> & { id?: string }) {
    const { id, propertyId, cropType, fieldName } = data;
    if (id) {
        await db.query('UPDATE tab_cultura SET id_propriedade = $1, produto = $2, nome_cultura = $3 WHERE id = $4', [propertyId, cropType, fieldName, id]);
    } else {
        await db.query('INSERT INTO tab_cultura (id_propriedade, produto, nome_cultura) VALUES ($1, $2, $3)', [propertyId, cropType, fieldName]);
    }
    revalidatePath('/admin');
}

export async function deleteCrop(id: string) {
    await db.query('DELETE FROM tab_cultura WHERE id = $1', [id]);
    revalidatePath('/admin');
}


// --- Funções de Estação ---
export async function getStations(): Promise<Station[]> {
    try {
        const { rows } = await db.query(`
            SELECT id, id_propriedade, nome_estacao, descricao_estacao 
            FROM tab_estacao ORDER BY nome_estacao
        `);
        return rows.map(r => ({ ...r, id: String(r.id), id_propriedade: String(r.id_propriedade) }));
    } catch (error) {
        console.error("Database Error (getStations):", error);
        return [];
    }
}

export async function saveStation(data: Omit<Station, 'id'> & { id?: string }) {
    const { id, id_propriedade, nome_estacao, descricao_estacao } = data;
    if (id) {
        await db.query('UPDATE tab_estacao SET id_propriedade = $1, nome_estacao = $2, descricao_estacao = $3 WHERE id = $4', [id_propriedade, nome_estacao, descricao_estacao, id]);
    } else {
        await db.query('INSERT INTO tab_estacao (id_propriedade, nome_estacao, descricao_estacao) VALUES ($1, $2, $3)', [id_propriedade, nome_estacao, descricao_estacao]);
    }
    revalidatePath('/admin');
}

export async function deleteStation(id: string) {
    await db.query('DELETE FROM tab_estacao WHERE id = $1', [id]);
    revalidatePath('/admin');
}


// --- Funções de Sensor ---
export async function getSensors(): Promise<Sensor[]> {
    try {
        const { rows } = await db.query(`
            SELECT id, id_estacao, nome_sensor, descricao_sensor 
            FROM tab_sensor ORDER BY nome_sensor
        `);
        return rows.map(r => ({...r, id: String(r.id), id_estacao: String(r.id_estacao)}));
    } catch (error) {
        console.error("Database Error (getSensors):", error);
        return [];
    }
}

export async function saveSensor(data: Omit<Sensor, 'id'> & { id?: string }) {
    const { id, id_estacao, nome_sensor, descricao_sensor } = data;
    if (id) {
        await db.query('UPDATE tab_sensor SET id_estacao = $1, nome_sensor = $2, descricao_sensor = $3 WHERE id = $4', [id_estacao, nome_sensor, descricao_sensor, id]);
    } else {
        await db.query('INSERT INTO tab_sensor (id_estacao, nome_sensor, descricao_sensor) VALUES ($1, $2, $3)', [id_estacao, nome_sensor, descricao_sensor]);
    }
    revalidatePath('/admin');
}

export async function deleteSensor(id: string) {
    await db.query('DELETE FROM tab_sensor WHERE id = $1', [id]);
    revalidatePath('/admin');
}


// --- Funções de Grandeza ---
export async function getQuantities(): Promise<Quantity[]> {
    try {
        const { rows } = await db.query(`
            SELECT id, nome_grandeza, unidade_medida, descricao_grandeza 
            FROM tab_grandeza ORDER BY nome_grandeza
        `);
        return rows.map(r => ({...r, id: String(r.id)}));
    } catch (error) {
        console.error("Database Error (getQuantities):", error);
        return [];
    }
}

export async function saveQuantity(data: Omit<Quantity, 'id'> & { id?: string }) {
    const { id, nome_grandeza, unidade_medida, descricao_grandeza } = data;
    if (id) {
        await db.query('UPDATE tab_grandeza SET nome_grandeza = $1, unidade_medida = $2, descricao_grandeza = $3 WHERE id = $4', [nome_grandeza, unidade_medida, descricao_grandeza, id]);
    } else {
        await db.query('INSERT INTO tab_grandeza (nome_grandeza, unidade_medida, descricao_grandeza) VALUES ($1, $2, $3)', [nome_grandeza, unidade_medida, descricao_grandeza]);
    }
    revalidatePath('/admin');
}

export async function deleteQuantity(id: string) {
    await db.query('DELETE FROM tab_grandeza WHERE id = $1', [id]);
    revalidatePath('/admin');
}


// --- Funções de Critério de Alerta ---
export async function getAlertCriteria(): Promise<AlertCriterion[]> {
    try {
        const { rows } = await db.query(`
            SELECT id_sensor, id_grandeza, comparacao, valor_critico_1, valor_critico_2, alerta, repeticao_seg, ativo 
            FROM tab_criterio_alerta ORDER BY id_sensor, id_grandeza
        `);
        // O id é composto (id_sensor, id_grandeza), então criamos um id sintético para o lado do cliente
        return rows.map(r => ({
            ...r,
            id: `${r.id_sensor}-${r.id_grandeza}`,
            id_sensor: String(r.id_sensor),
            id_grandeza: String(r.id_grandeza)
        }));
    } catch (error) {
        console.error("Database Error (getAlertCriteria):", error);
        return [];
    }
}

export async function saveAlertCriterion(data: Omit<AlertCriterion, 'id'> & { id_sensor_original?: string, id_grandeza_original?: string }) {
    const { id_sensor, id_grandeza, comparacao, valor_critico_1, valor_critico_2, alerta, repeticao_seg, ativo, id_sensor_original, id_grandeza_original } = data;
    
    // Verifica se é uma atualização (se os ids originais foram passados)
    const isUpdate = id_sensor_original && id_grandeza_original;

    if (isUpdate) {
        await db.query(`
            UPDATE tab_criterio_alerta 
            SET id_sensor = $1, id_grandeza = $2, comparacao = $3, valor_critico_1 = $4, valor_critico_2 = $5, alerta = $6, repeticao_seg = $7, ativo = $8
            WHERE id_sensor = $9 AND id_grandeza = $10
        `, [id_sensor, id_grandeza, comparacao, valor_critico_1, valor_critico_2, alerta, repeticao_seg, ativo, id_sensor_original, id_grandeza_original]);
    } else {
        await db.query(`
            INSERT INTO tab_criterio_alerta (id_sensor, id_grandeza, comparacao, valor_critico_1, valor_critico_2, alerta, repeticao_seg, ativo) 
            VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        `, [id_sensor, id_grandeza, comparacao, valor_critico_1, valor_critico_2, alerta, repeticao_seg, ativo]);
    }
    revalidatePath('/admin');
}


export async function deleteAlertCriterion(ids: { sensorId: string; quantityId: string }) {
    await db.query('DELETE FROM tab_criterio_alerta WHERE id_sensor = $1 AND id_grandeza = $2', [ids.sensorId, ids.quantityId]);
    revalidatePath('/admin');
}
