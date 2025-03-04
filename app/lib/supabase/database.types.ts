export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      delivery_zones: {
        Row: {
          id: number
          branch_id: number
          location: string
          vehicle_type: string
          daytime_fee: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          branch_id: number
          location: string
          vehicle_type: string
          daytime_fee: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          branch_id?: number
          location?: string
          vehicle_type?: string
          daytime_fee?: number
          created_at?: string
          updated_at?: string
        }
      }
      menu_items: {
        Row: {
          id: number
          category_id: number
          name: string
          description: string | null
          price: number
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          category_id: number
          name: string
          description?: string | null
          price: number
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          category_id?: number
          name?: string
          description?: string | null
          price?: number
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: number
          user_id: string
          delivery_zone_id: number
          status: string
          total_amount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: number
          user_id: string
          delivery_zone_id: number
          status?: string
          total_amount: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: number
          user_id?: string
          delivery_zone_id?: number
          status?: string
          total_amount?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}