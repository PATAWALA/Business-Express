export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string
          name: string
          phone: string | null
          whatsapp: string | null
          city: string | null
          country: string | null
          type: "prospect" | "client"
          total_spent_fcfa: number | null
          notes: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          phone?: string | null
          whatsapp?: string | null
          city?: string | null
          country?: string | null
          type?: "prospect" | "client"
          total_spent_fcfa?: number | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          phone?: string | null
          whatsapp?: string | null
          city?: string | null
          country?: string | null
          type?: "prospect" | "client"
          total_spent_fcfa?: number | null
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      orders: {
        Row: {
          id: string
          order_ref: string
          client_id: string | null
          supplier_name: string | null
          supplier_city: string | null
          items_description: string
          quantity: number | null
          purchase_price_aed: number | null
          transport_cost_aed: number | null
          sale_price_fcfa: number | null
          margin_fcfa: number | null
          status: "sourcing" | "purchased" | "freight" | "delivered"
          expected_delivery: string | null
          source: "public" | "whatsapp" | "manual"
          source_detail: string | null
          exchange_rate_aed_to_fcfa: number
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          order_ref: string
          client_id?: string | null
          supplier_name?: string | null
          supplier_city?: string | null
          items_description: string
          quantity?: number | null
          purchase_price_aed?: number | null
          transport_cost_aed?: number | null
          sale_price_fcfa?: number | null
          margin_fcfa?: number | null
          status?: "sourcing" | "purchased" | "freight" | "delivered"
          expected_delivery?: string | null
          source?: "public" | "whatsapp" | "manual"
          source_detail?: string | null
          exchange_rate_aed_to_fcfa?: number
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          order_ref?: string
          client_id?: string | null
          supplier_name?: string | null
          supplier_city?: string | null
          items_description?: string
          quantity?: number | null
          purchase_price_aed?: number | null
          transport_cost_aed?: number | null
          sale_price_fcfa?: number | null
          margin_fcfa?: number | null
          status?: "sourcing" | "purchased" | "freight" | "delivered"
          expected_delivery?: string | null
          source?: "public" | "whatsapp" | "manual"
          source_detail?: string | null
          exchange_rate_aed_to_fcfa?: number
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          }
        ]
      }
      project_requests: {
        Row: {
          id: string
          client_id: string | null
          full_name: string
          whatsapp: string
          city: string
          project_type: string | null
          budget: string | null
          description: string
          status: "new" | "contacted" | "quoted" | "converted" | "archived"
          notes: string | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          client_id?: string | null
          full_name: string
          whatsapp: string
          city: string
          project_type?: string | null
          budget?: string | null
          description: string
          status?: "new" | "contacted" | "quoted" | "converted" | "archived"
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          client_id?: string | null
          full_name?: string
          whatsapp?: string
          city?: string
          project_type?: string | null
          budget?: string | null
          description?: string
          status?: "new" | "contacted" | "quoted" | "converted" | "archived"
          notes?: string | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "project_requests_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          }
        ]
      }
      settings: {
        Row: {
          id: number
          exchange_rate_aed_to_fcfa: number
          updated_at: string | null
          company_name: string | null
          company_email: string | null
          company_phone: string | null
          company_whatsapp: string | null
          company_address_dubai: string | null
          company_address_bukavu: string | null
          notifications_enabled: boolean | null
          auto_tasks_enabled: boolean | null
        }
        Insert: {
          id?: number
          exchange_rate_aed_to_fcfa?: number
          updated_at?: string | null
          company_name?: string | null
          company_email?: string | null
          company_phone?: string | null
          company_whatsapp?: string | null
          company_address_dubai?: string | null
          company_address_bukavu?: string | null
          notifications_enabled?: boolean | null
          auto_tasks_enabled?: boolean | null
        }
        Update: {
          id?: number
          exchange_rate_aed_to_fcfa?: number
          updated_at?: string | null
          company_name?: string | null
          company_email?: string | null
          company_phone?: string | null
          company_whatsapp?: string | null
          company_address_dubai?: string | null
          company_address_bukavu?: string | null
          notifications_enabled?: boolean | null
          auto_tasks_enabled?: boolean | null
        }
        Relationships: []
      }
      tasks: {
        Row: {
          id: string
          title: string
          description: string | null
          priority: "low" | "normal" | "high" | "urgent"
          due_date: string | null
          completed: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          priority?: "low" | "normal" | "high" | "urgent"
          due_date?: string | null
          completed?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          priority?: "low" | "normal" | "high" | "urgent"
          due_date?: string | null
          completed?: boolean | null
          created_at?: string | null
        }
        Relationships: []
      }
      transactions: {
        Row: {
          id: string
          order_id: string | null
          type: "purchase" | "transport" | "payment_received" | "refund"
          amount: number
          currency: "AED" | "USD" | "FCFA"
          label: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          order_id?: string | null
          type: "purchase" | "transport" | "payment_received" | "refund"
          amount: number
          currency?: "AED" | "USD" | "FCFA"
          label?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          order_id?: string | null
          type?: "purchase" | "transport" | "payment_received" | "refund"
          amount?: number
          currency?: "AED" | "USD" | "FCFA"
          label?: string | null
          created_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          }
        ]
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database["public"]

export type Tables<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Row"]

export type TablesInsert<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Insert"]

export type TablesUpdate<T extends keyof PublicSchema["Tables"]> =
  PublicSchema["Tables"][T]["Update"]

export type Enums<T extends keyof PublicSchema["Enums"]> =
  PublicSchema["Enums"][T]