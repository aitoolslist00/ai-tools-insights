import { supabase } from './supabase';
import bcrypt from 'bcrypt';

export const db = {
  prepare: (query: string) => ({
    get: async (params?: any) => {
      const tableName = extractTableName(query);
      
      if (query.toUpperCase().includes('COUNT(*)')) {
        let countQuery = supabase
          .from(tableName)
          .select('*', { count: 'exact', head: true });
        
        if (query.includes('WHERE')) {
          const whereClause = extractWhereClause(query);
          const { column, value } = extractWhereCondition(whereClause);
          if (column && value) {
            countQuery = countQuery.eq(column, value);
          }
        }
        
        const { count, error } = await countQuery;
        
        if (error) {
          console.error('Supabase count error:', error);
          return { count: 0 };
        }
        
        return { count: count || 0 };
      }
      
      if (query.includes('WHERE')) {
        const whereClause = extractWhereClause(query);
        const columnName = extractColumnFromWhere(whereClause);
        
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .eq(columnName, params)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Supabase get error:', error);
          return null;
        }
        
        return data;
      } else {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1)
          .single();
        
        if (error && error.code !== 'PGRST116') {
          console.error('Supabase get error:', error);
          return null;
        }
        
        return data;
      }
    },
    
    all: async (params?: any) => {
      const tableName = extractTableName(query);
      let queryBuilder = supabase.from(tableName).select('*');
      
      if (query.includes('WHERE') && params) {
        const whereClause = extractWhereClause(query);
        const columnName = extractColumnFromWhere(whereClause);
        queryBuilder = queryBuilder.eq(columnName, params);
      }
      
      if (query.includes('ORDER BY')) {
        const orderClause = extractOrderByClause(query);
        const { column, ascending } = parseOrderBy(orderClause);
        queryBuilder = queryBuilder.order(column, { ascending });
      }
      
      if (query.includes('LIMIT')) {
        const limit = extractLimit(query);
        if (limit) {
          queryBuilder = queryBuilder.limit(limit);
        }
      }
      
      const { data, error } = await queryBuilder;
      
      if (error) {
        console.error('Supabase all error:', error);
        return [];
      }
      
      return data || [];
    },
    
    run: async (...params: any[]) => {
      const result = await executeQuery(query, params);
      return result;
    }
  }),
  
  exec: async (query: string) => {
    console.log('Exec called (no-op for Supabase):', query);
  }
};

function extractTableName(query: string): string {
  const insertMatch = query.match(/INSERT INTO (\w+)/i);
  if (insertMatch) return insertMatch[1];
  
  const updateMatch = query.match(/UPDATE (\w+)/i);
  if (updateMatch) return updateMatch[1];
  
  const deleteMatch = query.match(/DELETE FROM (\w+)/i);
  if (deleteMatch) return deleteMatch[1];
  
  const selectMatch = query.match(/FROM (\w+)/i);
  if (selectMatch) return selectMatch[1];
  
  return '';
}

function extractWhereClause(query: string): string {
  const match = query.match(/WHERE (.+?)(?:ORDER BY|LIMIT|$)/i);
  return match ? match[1].trim() : '';
}

function extractColumnFromWhere(whereClause: string): string {
  const match = whereClause.match(/(\w+)\s*=/);
  return match ? match[1] : '';
}

function extractWhereCondition(whereClause: string): { column: string; value: string } {
  const match = whereClause.match(/(\w+)\s*=\s*'([^']+)'/);
  if (match) {
    return { column: match[1], value: match[2] };
  }
  return { column: '', value: '' };
}

function extractOrderByClause(query: string): string {
  const match = query.match(/ORDER BY (.+?)(?:LIMIT|$)/i);
  return match ? match[1].trim() : '';
}

function parseOrderBy(orderClause: string): { column: string; ascending: boolean } {
  const parts = orderClause.split(/\s+/);
  const column = parts[0];
  const direction = parts[1]?.toUpperCase();
  return {
    column,
    ascending: direction !== 'DESC'
  };
}

function extractLimit(query: string): number | null {
  const match = query.match(/LIMIT\s+(\d+)/i);
  return match ? parseInt(match[1], 10) : null;
}

async function executeQuery(query: string, params: any[]): Promise<any> {
  const normalizedQuery = query.trim().toUpperCase();
  
  if (normalizedQuery.startsWith('INSERT')) {
    return await handleInsert(query, params);
  } else if (normalizedQuery.startsWith('UPDATE')) {
    return await handleUpdate(query, params);
  } else if (normalizedQuery.startsWith('DELETE')) {
    return await handleDelete(query, params);
  }
  
  return null;
}

async function handleInsert(query: string, params: any[]): Promise<any> {
  const tableName = extractTableName(query);
  const columns = extractInsertColumns(query);
  
  const data: any = {};
  columns.forEach((col, index) => {
    if (params[index] !== undefined && params[index] !== null) {
      data[col] = params[index];
    }
  });
  
  const { data: result, error } = await supabase
    .from(tableName)
    .insert(data)
    .select()
    .single();
  
  if (error) {
    if (error.code === '23505' && query.includes('IGNORE')) {
      return { lastInsertRowid: null };
    }
    console.error('Supabase insert error:', error);
    throw error;
  }
  
  return { lastInsertRowid: result?.id };
}

async function handleUpdate(query: string, params: any[]): Promise<any> {
  const tableName = extractTableName(query);
  const updateColumns = extractUpdateColumns(query);
  const whereColumn = extractColumnFromWhere(extractWhereClause(query));
  
  const data: any = {};
  updateColumns.forEach((col, index) => {
    if (params[index] !== undefined && params[index] !== null) {
      data[col] = params[index];
    }
  });
  
  const whereValue = params[params.length - 1];
  
  const { error } = await supabase
    .from(tableName)
    .update(data)
    .eq(whereColumn, whereValue);
  
  if (error) {
    console.error('Supabase update error:', error);
    throw error;
  }
  
  return {};
}

async function handleDelete(query: string, params: any[]): Promise<any> {
  const tableName = extractTableName(query);
  const whereColumn = extractColumnFromWhere(extractWhereClause(query));
  
  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq(whereColumn, params[0]);
  
  if (error) {
    console.error('Supabase delete error:', error);
    throw error;
  }
  
  return {};
}

function extractInsertColumns(query: string): string[] {
  const match = query.match(/\(([^)]+)\)\s*VALUES/i);
  if (!match) return [];
  
  return match[1].split(',').map(col => col.trim());
}

function extractUpdateColumns(query: string): string[] {
  const match = query.match(/SET (.+?) WHERE/i);
  if (!match) return [];
  
  return match[1].split(',').map(col => {
    const parts = col.trim().split('=');
    return parts[0].trim();
  });
}

export async function initializeAdmin(username: string, password: string) {
  const hashedPassword = bcrypt.hashSync(password, 10);
  
  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('username', username)
    .single();
  
  if (!existingUser) {
    await supabase
      .from('users')
      .insert({ username, password: hashedPassword });
  }
}

export async function getSetting(key: string): Promise<string | null> {
  const { data, error } = await supabase
    .from('settings')
    .select('value')
    .eq('key', key)
    .single();
  
  if (error && error.code !== 'PGRST116') {
    console.error('Supabase getSetting error:', error);
    return null;
  }
  
  return data?.value || null;
}

export async function setSetting(key: string, value: string): Promise<void> {
  const { data: existing } = await supabase
    .from('settings')
    .select('id')
    .eq('key', key)
    .single();
  
  if (existing) {
    await supabase
      .from('settings')
      .update({ value, updated_at: new Date().toISOString() })
      .eq('key', key);
  } else {
    await supabase
      .from('settings')
      .insert({ key, value });
  }
}
