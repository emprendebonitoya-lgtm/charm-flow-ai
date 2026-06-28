import { getSupabase } from "./supabase";

// Tablas para backup de datos de usuarios premium
const BACKUP_TABLES = {
  savedItems: 'user_saved_items',
  history: 'user_history',
  progress: 'user_progress',
  preferences: 'user_preferences',
};

// Función para sincronizar datos locales con Supabase
export async function syncToSupabase(userId: string, data: {
  savedItems?: any[];
  history?: any[];
  progress?: any;
  preferences?: any;
}) {
  const supabase = getSupabase();
  if (!supabase) return { success: false, error: 'Supabase no configurado' };

  try {
    const results = await Promise.allSettled([
      // Guardar items guardados
      data.savedItems ? supabase
        .from(BACKUP_TABLES.savedItems)
        .upsert({ user_id: userId, items: data.savedItems, updated_at: new Date().toISOString() })
        .select() : Promise.resolve(null),
      
      // Guardar historial
      data.history ? supabase
        .from(BACKUP_TABLES.history)
        .upsert({ user_id: userId, history: data.history, updated_at: new Date().toISOString() })
        .select() : Promise.resolve(null),
      
      // Guardar progreso
      data.progress ? supabase
        .from(BACKUP_TABLES.progress)
        .upsert({ user_id: userId, progress: data.progress, updated_at: new Date().toISOString() })
        .select() : Promise.resolve(null),
      
      // Guardar preferencias
      data.preferences ? supabase
        .from(BACKUP_TABLES.preferences)
        .upsert({ user_id: userId, preferences: data.preferences, updated_at: new Date().toISOString() })
        .select() : Promise.resolve(null),
    ]);

    const errors = results.filter(r => r.status === 'rejected');
    if (errors.length > 0) {
      console.error('Errores en sync:', errors);
      return { success: false, error: 'Algunos datos no se sincronizaron' };
    }

    return { success: true };
  } catch (error) {
    console.error('Error en syncToSupabase:', error);
    return { success: false, error: 'Error al sincronizar con Supabase' };
  }
}

// Función para recuperar datos desde Supabase
export async function restoreFromSupabase(userId: string) {
  const supabase = getSupabase();
  if (!supabase) return { success: false, error: 'Supabase no configurado', data: null };

  try {
    const [savedItems, history, progress, preferences] = await Promise.all([
      supabase.from(BACKUP_TABLES.savedItems).select('items').eq('user_id', userId).single(),
      supabase.from(BACKUP_TABLES.history).select('history').eq('user_id', userId).single(),
      supabase.from(BACKUP_TABLES.progress).select('progress').eq('user_id', userId).single(),
      supabase.from(BACKUP_TABLES.preferences).select('preferences').eq('user_id', userId).single(),
    ]);

    return {
      success: true,
      data: {
        savedItems: savedItems.data?.items || [],
        history: history.data?.history || [],
        progress: progress.data?.progress || null,
        preferences: preferences.data?.preferences || null,
      },
    };
  } catch (error) {
    console.error('Error en restoreFromSupabase:', error);
    return { success: false, error: 'Error al recuperar datos de Supabase', data: null };
  }
}

// Función para verificar si existe backup
export async function hasBackup(userId: string): Promise<boolean> {
  const supabase = getSupabase();
  if (!supabase) return false;

  try {
    const { data } = await supabase
      .from(BACKUP_TABLES.savedItems)
      .select('user_id')
      .eq('user_id', userId)
      .single();
    
    return !!data;
  } catch {
    return false;
  }
}
