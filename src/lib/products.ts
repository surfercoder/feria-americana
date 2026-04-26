import { supabase } from './supabaseClient';

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
  category: string;
};

export async function getAllProducts(): Promise<Product[]> {
  const { data, error } = await supabase.from('products').select('*').order('id');
  if (error) throw new Error(error.message);
  return data as Product[];
}

export async function updateProductStatus(id: number, status: string, buyer: string) {
  const { error } = await supabase.from('products').update({ status, buyer }).eq('id', id);
  if (error) throw new Error(error.message);
}

export async function getProductById(id: number | string): Promise<Product | null> {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single();
  if (error) return null;
  return data as Product;
} 