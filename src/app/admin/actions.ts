'use server';

import { db } from '@/lib/db';
import type { Property, AdminCrop, Station, Sensor, Quantity, AlertCriterion } from '@/types';
import { revalidatePath } from 'next/cache';

// --- Funções de Leitura (Getters) ---

export async function getProperties(): Promise<Property[]> {
  const { rows } = await db.query('SELECT * FROM tab_propriedade ORDER BY nome_propriedade');
  return rows;
}

export async function getCrops(): Promise<AdminCrop[]> {
  // Nota: O schema de AdminCrop tem `propertyId`, mas a tabela `tab_cultura` tem `id_propriedade`
  const { rows } = await db.query(`
    SELECT id, id_propriedade as "propertyId", produto as "cropType", nome_cultura as "fieldName" 
    FROM tab_cultura ORDER BY nome_cultura
  `);
  return rows;
}

export async function getStations(): Promise<Station[]> {
  const { rows } = await db.query('SELECT * FROM tab_estacao ORDER BY nome_estacao');
  return rows;
}

export async function getSensors(): Promise<Sensor[]> {
  const { rows } = await db.query('SELECT * FROM tab_sensor ORDER BY nome_sensor');
  return rows;
}

export async function getQuantities(): Promise<Quantity[]> {
  const { rows } = await db.query('SELECT * FROM tab_grandeza ORDER BY nome_grandeza');
  return rows;
}

export async function getAlertCriteria(): Promise<AlertCriterion[]> {
  const { rows } = await db.query('SELECT * FROM tab_criterio_alerta ORDER BY id_sensor');
  return rows;
}


// --- Funções de Escrita (Create/Update/Delete) ---

// Propriedades
export async function saveProperty(data: Omit<Property, 'id'> & { id?: string }) {
  if (data.id) {
    await db.query(
      'UPDATE tab_propriedade SET nome_propriedade = $1, municipio = $2, uf = $3 WHERE id = $4',
      [data.nome_propriedade, data.municipio, data.uf, data.id]
    );
  } else {
    await db.query(
      'INSERT INTO tab_propriedade (nome_propriedade, municipio, uf) VALUES ($1, $2, $3)',
      [data.nome_propriedade, data.municipio, data.uf]
    );
  }
  revalidatePath('/admin');
}

export async function deleteProperty(id: string) {
  await db.query('DELETE FROM tab_propriedade WHERE id = $1', [id]);
  revalidatePath('/admin');
}

// Culturas
export async function saveCrop(data: Omit<AdminCrop, 'id'> & { id?: string }) {
  if (data.id) {
    await db.query(
      'UPDATE tab_cultura SET id_propriedade = $1, produto = $2, nome_cultura = $3 WHERE id = $4',
      [data.propertyId, data.cropType, data.fieldName, data.id]
    );
  } else {
    await db.query(
      'INSERT INTO tab_cultura (id_propriedade, produto, nome_cultura) VALUES ($1, $2, $3)',
      [data.propertyId, data.cropType, data.fieldName]
    );
  }
  revalidatePath('/admin');
}

export async function deleteCrop(id: string) {
  await db.query('DELETE FROM tab_cultura WHERE id = $1', [id]);
  revalidatePath('/admin');
}

// Estações
export async function saveStation(data: Omit<Station, 'id'> & { id?: string }) {
  if (data.id) {
    await db.query(
      'UPDATE tab_estacao SET id_propriedade = $1, nome_estacao = $2, descricao_estacao = $3 WHERE id = $4',
      [data.id_propriedade, data.nome_estacao, data.descricao_estacao, data.id]
    );
  } else {
    await db.query(
      'INSERT INTO tab_estacao (id_propriedade, nome_estacao, descricao_estacao) VALUES ($1, $2, $3)',
      [data.id_propriedade, data.nome_estacao, data.descricao_estacao]
    );
  }
  revalidatePath('/admin');
}

export async function deleteStation(id: string) {
    await db.query('DELETE FROM tab_estacao WHERE id = $1', [id]);
    revalidatePath('/admin');
}

// Sensores
export async function saveSensor(data: Omit<Sensor, 'id'> & { id?: string }) {
    if (data.id) {
        await db.query(
            'UPDATE tab_sensor SET id_estacao = $1, nome_sensor = $2, descricao_sensor = $3 WHERE id = $4',
            [data.id_estacao, data.nome_sensor, data.descricao_sensor, data.id]
        );
    } else {
        await db.query(
            'INSERT INTO tab_sensor (id_estacao, nome_sensor, descricao_sensor) VALUES ($1, $2, $3)',
            [data.id_estacao, data.nome_sensor, data.descricao_sensor]
        );
    }
    revalidatePath('/admin');
}

export async function deleteSensor(id: string) {
    await db.query('DELETE FROM tab_sensor WHERE id = $1', [id]);
    revalidatePath('/admin');
}

// Grandezas
export async function saveQuantity(data: Omit<Quantity, 'id'> & { id?: string }) {
    if (data.id) {
        await db.query(
            'UPDATE tab_grandeza SET nome_grandeza = $1, unidade_medida = $2, descricao_grandeza = $3 WHERE id = $4',
            [data.nome_grandeza, data.unidade_medida, data.descricao_grandeza, data.id]
        );
    } else {
        await db.query(
            'INSERT INTO tab_grandeza (nome_grandeza, unidade_medida, descricao_grandeza) VALUES ($1, $2, $3)',
            [data.nome_grandeza, data.unidade_medida, data.descricao_grandeza]
        );
    }
    revalidatePath('/admin');
}

export async function deleteQuantity(id: string) {
    await db.query('DELETE FROM tab_grandeza WHERE id = $1', [id]);
    revalidatePath('/admin');
}

// Critérios de Alerta
export async function saveAlertCriterion(data: Omit<AlertCriterion, 'id'> & { id?: string }) {
    if (data.id) {
        await db.query(
            'UPDATE tab_criterio_alerta SET id_sensor = $1, id_grandeza = $2, comparacao = $3, valor_critico_1 = $4, valor_critico_2 = $5, alerta = $6, repeticao_seg = $7, ativo = $8 WHERE id = $9',
            [data.id_sensor, data.id_grandeza, data.comparacao, data.valor_critico_1, data.valor_critico_2, data.alerta, data.repeticao_seg, data.ativo, data.id]
        );
    } else {
        await db.query(
            'INSERT INTO tab_criterio_alerta (id_sensor, id_grandeza, comparacao, valor_critico_1, valor_critico_2, alerta, repeticao_seg, ativo) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)',
            [data.id_sensor, data.id_grandeza, data.comparacao, data.valor_critico_1, data.valor_critico_2, data.alerta, data.repeticao_seg, data.ativo]
        );
    }
    revalidatePath('/admin');
}

export async function deleteAlertCriterion(id: string) {
    await db.query('DELETE FROM tab_criterio_alerta WHERE id = $1', [id]);
    revalidatePath('/admin');
}
