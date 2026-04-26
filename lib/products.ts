import { supabase } from '@/lib/supabaseClient';

export type Product = {
  id: number;
  title: string;
  color: string;
  description: string;
  brand: string;
  size: string;
  price: string;
  other: string;
  status: string;
  buyer: string;
  image: string;
};

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from('products').select('*').order('id');
  if (error) throw new Error(error.message);
  return data as Product[];
}