import { supabase } from './supabase'

export const isAdmin = async (userId: string): Promise<boolean> => {
  const { data, error } = await supabase
    .from('user_roles')
    .select('role')
    .eq('id', userId)
    .single()

  if (error) {
    console.error('Error checking admin status:', error)
    return false
  }

  return data?.role === 'admin'
}

export const setUserRole = async (userId: string, role: 'admin' | 'user') => {
  const { error } = await supabase
    .from('user_roles')
    .upsert({ id: userId, role })
  
  if (error) {
    throw error
  }
}

export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from('user_roles')
    .select(`
      id,
      role,
      profiles:profiles (
        email,
        full_name
      )
    `)
  
  if (error) {
    throw error
  }
  
  return data
} 