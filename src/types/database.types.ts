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
      users: {
        Row: {
          id: string
          username: string
          display_name: string | null
          bio: string | null
          location: string | null
          phone: string | null
          avatar_url: string | null
          created_at: string
        }
        Insert: {
          id: string
          username: string
          display_name?: string | null
          bio?: string | null
          location?: string | null
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          username?: string
          display_name?: string | null
          bio?: string | null
          location?: string | null
          phone?: string | null
          avatar_url?: string | null
          created_at?: string
        }
      }
      sticky_notes: {
        Row: {
          id: string
          user_id: string
          content: string | null
          color: string | null
          x_position: number | null
          y_position: number | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          content?: string | null
          color?: string | null
          x_position?: number | null
          y_position?: number | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          content?: string | null
          color?: string | null
          x_position?: number | null
          y_position?: number | null
          created_at?: string
          updated_at?: string
        }
      }
      events: {
        Row: {
          id: string
          user_id: string
          title: string
          description: string | null
          start_time: string
          end_time: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          description?: string | null
          start_time: string
          end_time: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          description?: string | null
          start_time?: string
          end_time?: string
          created_at?: string
        }
      }
      todo_lists: {
        Row: {
          id: string
          user_id: string
          title: string
          category: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          category?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          category?: string | null
          created_at?: string
        }
      }
      todos: {
        Row: {
          id: string
          list_id: string
          content: string
          is_completed: boolean | null
          created_at: string
        }
        Insert: {
          id?: string
          list_id: string
          content: string
          is_completed?: boolean | null
          created_at?: string
        }
        Update: {
          id?: string
          list_id?: string
          content?: string
          is_completed?: boolean | null
          created_at?: string
        }
      }
      habits: {
        Row: {
          id: string
          user_id: string
          title: string
          current_streak: number | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          current_streak?: number | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          current_streak?: number | null
          created_at?: string
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
