import axios from 'axios';
import { Category, MenuItem } from '@/app/api/types';

const api = axios.create({
  baseURL: '/api',
});

export const fetchCategories = async (): Promise<Category[]> => {
  try {
    console.log('Fetching categories from API...');
    const { data } = await api.get<{ categories: Category[] }>('/categories');
    console.log('Categories response:', data);
    
    if (!data.categories) {
      console.error('No categories found in response:', data);
      return [];
    }
    
    return data.categories;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

export const fetchMenuItems = async (categoryId?: string) => {
  const { data } = await api.get<{ menuItems: MenuItem[] }>('/menu-items', {
    params: categoryId ? { category_id: categoryId } : undefined
  });
  return data.menuItems;
};

export const searchMenuItems = async (query: string) => {
  const { data } = await api.get<{ menuItems: MenuItem[] }>('/menu-items', {
    params: { search: query }
  });
  return data.menuItems;
};

export const fetchPopularItems = async () => {
  const { data } = await api.get<{ menuItems: MenuItem[] }>('/menu-items', {
    params: { popular: true }
  });
  return data.menuItems;
}; 