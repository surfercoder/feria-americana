import 'dotenv/config';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import fs from 'fs';
import path from 'path';
import Papa from 'papaparse';
import { supabase } from './supabaseClient';

type RawProductRow = {
  id: string;
  Prenda: string;
  Color: string;
  Descripcion: string;
  Marca: string;
  Talle: string;
  Valor: string;
  Otros: string;
  Estado?: string;
  Vendido?: string;
  Compradora?: string;
};

async function seed() {
  const csvPath = path.join(process.cwd(), 'feeding-data.csv');
  const file = fs.readFileSync(csvPath, 'utf8');
  const parsed = Papa.parse(file, { header: true, skipEmptyLines: true });
  const products = (parsed.data as RawProductRow[]).map((row) => {
    const id = Number(row.id);
    const image = `${id}.webp`;
    return {
      id,
      title: row.Prenda || '',
      color: row.Color || '',
      description: row.Descripcion || '',
      brand: row.Marca || '',
      size: row.Talle || '',
      price: row.Valor || '',
      other: row.Otros || '',
      status: (row.Estado || row.Vendido || '').toLowerCase(),
      buyer: row.Compradora || '',
      image,
    };
  });

  for (const product of products) {
    const { error } = await supabase.from('products').upsert(product);
    if (error) {
      console.error('Error inserting product', product.id, error);
    } else {
      console.log('Inserted product', product.id);
    }
  }
}

seed(); 