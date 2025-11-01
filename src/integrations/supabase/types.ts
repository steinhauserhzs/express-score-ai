export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      admin_audit_logs: {
        Row: {
          accessed_at: string
          action: string
          admin_id: string
          id: string
          ip_address: string | null
          record_id: string | null
          table_name: string
          user_agent: string | null
        }
        Insert: {
          accessed_at?: string
          action: string
          admin_id: string
          id?: string
          ip_address?: string | null
          record_id?: string | null
          table_name: string
          user_agent?: string | null
        }
        Update: {
          accessed_at?: string
          action?: string
          admin_id?: string
          id?: string
          ip_address?: string | null
          record_id?: string | null
          table_name?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      admin_notes: {
        Row: {
          admin_id: string
          client_id: string
          created_at: string | null
          id: string
          note: string
          updated_at: string | null
        }
        Insert: {
          admin_id: string
          client_id: string
          created_at?: string | null
          id?: string
          note: string
          updated_at?: string | null
        }
        Update: {
          admin_id?: string
          client_id?: string
          created_at?: string | null
          id?: string
          note?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_notes_admin_id_fkey"
            columns: ["admin_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "admin_notes_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      automation_triggers: {
        Row: {
          action_config: Json
          action_type: string
          condition_config: Json
          created_at: string
          id: string
          is_active: boolean
          last_executed_at: string | null
          trigger_name: string
          trigger_type: string
          updated_at: string
        }
        Insert: {
          action_config: Json
          action_type: string
          condition_config: Json
          created_at?: string
          id?: string
          is_active?: boolean
          last_executed_at?: string | null
          trigger_name: string
          trigger_type: string
          updated_at?: string
        }
        Update: {
          action_config?: Json
          action_type?: string
          condition_config?: Json
          created_at?: string
          id?: string
          is_active?: boolean
          last_executed_at?: string | null
          trigger_name?: string
          trigger_type?: string
          updated_at?: string
        }
        Relationships: []
      }
      chatbot_conversations: {
        Row: {
          conversation_type: string
          ended_at: string | null
          id: string
          message_count: number
          metadata: Json | null
          started_at: string
          user_id: string
        }
        Insert: {
          conversation_type?: string
          ended_at?: string | null
          id?: string
          message_count?: number
          metadata?: Json | null
          started_at?: string
          user_id: string
        }
        Update: {
          conversation_type?: string
          ended_at?: string | null
          id?: string
          message_count?: number
          metadata?: Json | null
          started_at?: string
          user_id?: string
        }
        Relationships: []
      }
      chatbot_messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string
          id: string
          metadata: Json | null
          role: string
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role: string
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string
          id?: string
          metadata?: Json | null
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "chatbot_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chatbot_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      consultations: {
        Row: {
          client_id: string
          consultant_id: string | null
          created_at: string
          id: string
          notes: string | null
          scheduled_date: string | null
          status: string
          updated_at: string
        }
        Insert: {
          client_id: string
          consultant_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          scheduled_date?: string | null
          status?: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          consultant_id?: string | null
          created_at?: string
          id?: string
          notes?: string | null
          scheduled_date?: string | null
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      customer_journey_events: {
        Row: {
          created_at: string
          event_description: string | null
          event_title: string
          event_type: string
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          created_at?: string
          event_description?: string | null
          event_title: string
          event_type: string
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          created_at?: string
          event_description?: string | null
          event_title?: string
          event_type?: string
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      diagnostic_history: {
        Row: {
          created_at: string
          diagnostic_id: string
          dimension_scores: Json
          id: string
          profile: string | null
          score_classification: string | null
          total_score: number
          user_id: string
        }
        Insert: {
          created_at?: string
          diagnostic_id: string
          dimension_scores: Json
          id?: string
          profile?: string | null
          score_classification?: string | null
          total_score: number
          user_id: string
        }
        Update: {
          created_at?: string
          diagnostic_id?: string
          dimension_scores?: Json
          id?: string
          profile?: string | null
          score_classification?: string | null
          total_score?: number
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "diagnostic_history_diagnostic_id_fkey"
            columns: ["diagnostic_id"]
            isOneToOne: false
            referencedRelation: "diagnostics"
            referencedColumns: ["id"]
          },
        ]
      }
      diagnostics: {
        Row: {
          completed: boolean
          conversation_context: Json | null
          created_at: string
          current_step: number | null
          dimension_scores: Json
          id: string
          last_question: number | null
          profile: string | null
          progress_percentage: number | null
          quality_of_life: number | null
          responses_json: Json
          score_classification: string | null
          total_score: number
          total_steps: number | null
          user_id: string
          validations_triggered: string[] | null
        }
        Insert: {
          completed?: boolean
          conversation_context?: Json | null
          created_at?: string
          current_step?: number | null
          dimension_scores: Json
          id?: string
          last_question?: number | null
          profile?: string | null
          progress_percentage?: number | null
          quality_of_life?: number | null
          responses_json: Json
          score_classification?: string | null
          total_score: number
          total_steps?: number | null
          user_id: string
          validations_triggered?: string[] | null
        }
        Update: {
          completed?: boolean
          conversation_context?: Json | null
          created_at?: string
          current_step?: number | null
          dimension_scores?: Json
          id?: string
          last_question?: number | null
          profile?: string | null
          progress_percentage?: number | null
          quality_of_life?: number | null
          responses_json?: Json
          score_classification?: string | null
          total_score?: number
          total_steps?: number | null
          user_id?: string
          validations_triggered?: string[] | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_diagnostics_user"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      educational_content: {
        Row: {
          category: string
          content_body: string | null
          content_type: string
          content_url: string | null
          created_at: string
          description: string | null
          difficulty_level: string
          estimated_time_minutes: number | null
          id: string
          is_published: boolean
          published_at: string | null
          thumbnail_url: string | null
          title: string
          updated_at: string
          view_count: number
        }
        Insert: {
          category: string
          content_body?: string | null
          content_type: string
          content_url?: string | null
          created_at?: string
          description?: string | null
          difficulty_level?: string
          estimated_time_minutes?: number | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string
          view_count?: number
        }
        Update: {
          category?: string
          content_body?: string | null
          content_type?: string
          content_url?: string | null
          created_at?: string
          description?: string | null
          difficulty_level?: string
          estimated_time_minutes?: number | null
          id?: string
          is_published?: boolean
          published_at?: string | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string
          view_count?: number
        }
        Relationships: []
      }
      email_logs: {
        Row: {
          clicked_at: string | null
          email_type: string
          external_id: string | null
          id: string
          metadata: Json | null
          opened_at: string | null
          recipient_email: string
          sent_at: string
          status: string
          subject: string
          user_id: string | null
        }
        Insert: {
          clicked_at?: string | null
          email_type: string
          external_id?: string | null
          id?: string
          metadata?: Json | null
          opened_at?: string | null
          recipient_email: string
          sent_at?: string
          status?: string
          subject: string
          user_id?: string | null
        }
        Update: {
          clicked_at?: string | null
          email_type?: string
          external_id?: string | null
          id?: string
          metadata?: Json | null
          opened_at?: string | null
          recipient_email?: string
          sent_at?: string
          status?: string
          subject?: string
          user_id?: string | null
        }
        Relationships: []
      }
      financial_alerts: {
        Row: {
          action_url: string | null
          alert_type: string
          created_at: string | null
          id: string
          message: string
          metadata: Json | null
          priority: string | null
          read: boolean | null
          read_at: string | null
          title: string
          user_id: string
        }
        Insert: {
          action_url?: string | null
          alert_type: string
          created_at?: string | null
          id?: string
          message: string
          metadata?: Json | null
          priority?: string | null
          read?: boolean | null
          read_at?: string | null
          title: string
          user_id: string
        }
        Update: {
          action_url?: string | null
          alert_type?: string
          created_at?: string | null
          id?: string
          message?: string
          metadata?: Json | null
          priority?: string | null
          read?: boolean | null
          read_at?: string | null
          title?: string
          user_id?: string
        }
        Relationships: []
      }
      financial_goals: {
        Row: {
          achieved_at: string | null
          category: string
          created_at: string | null
          current_amount: number | null
          deadline: string | null
          description: string | null
          id: string
          priority: string | null
          status: string | null
          target_amount: number
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          achieved_at?: string | null
          category: string
          created_at?: string | null
          current_amount?: number | null
          deadline?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          target_amount: number
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          achieved_at?: string | null
          category?: string
          created_at?: string | null
          current_amount?: number | null
          deadline?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          status?: string | null
          target_amount?: number
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      financial_milestones: {
        Row: {
          achieved_at: string | null
          description: string | null
          id: string
          metadata: Json | null
          milestone_type: string
          user_id: string
          value: number | null
        }
        Insert: {
          achieved_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          milestone_type: string
          user_id: string
          value?: number | null
        }
        Update: {
          achieved_at?: string | null
          description?: string | null
          id?: string
          metadata?: Json | null
          milestone_type?: string
          user_id?: string
          value?: number | null
        }
        Relationships: []
      }
      follow_ups: {
        Row: {
          client_id: string
          completed_at: string | null
          consultant_id: string | null
          created_at: string
          follow_up_type: string
          id: string
          notes: string | null
          outcome: string | null
          scheduled_date: string
          status: string
          updated_at: string
        }
        Insert: {
          client_id: string
          completed_at?: string | null
          consultant_id?: string | null
          created_at?: string
          follow_up_type: string
          id?: string
          notes?: string | null
          outcome?: string | null
          scheduled_date: string
          status?: string
          updated_at?: string
        }
        Update: {
          client_id?: string
          completed_at?: string | null
          consultant_id?: string | null
          created_at?: string
          follow_up_type?: string
          id?: string
          notes?: string | null
          outcome?: string | null
          scheduled_date?: string
          status?: string
          updated_at?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          created_at: string
          id: string
          message: string
          read: boolean
          title: string
          type: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          message: string
          read?: boolean
          title: string
          type: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          message?: string
          read?: boolean
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string
          id: string
          payment_method: string | null
          status: string
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string
          id?: string
          payment_method?: string | null
          status?: string
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string
          id?: string
          payment_method?: string | null
          status?: string
          user_id?: string
        }
        Relationships: []
      }
      product_events: {
        Row: {
          created_at: string
          event_category: string
          event_name: string
          id: string
          page_path: string | null
          properties: Json | null
          session_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string
          event_category: string
          event_name: string
          id?: string
          page_path?: string | null
          properties?: Json | null
          session_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string
          event_category?: string
          event_name?: string
          id?: string
          page_path?: string | null
          properties?: Json | null
          session_id?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          cep: string | null
          churn_risk: string | null
          city: string | null
          cpf: string | null
          created_at: string
          email: string
          full_name: string
          id: string
          last_login_at: string | null
          lead_score: number | null
          phone: string | null
          referral_code: string | null
          referred_by: string | null
          rg: string | null
          role: Database["public"]["Enums"]["user_role"]
          state: string | null
          street: string | null
          tags: string[] | null
          updated_at: string
        }
        Insert: {
          cep?: string | null
          churn_risk?: string | null
          city?: string | null
          cpf?: string | null
          created_at?: string
          email: string
          full_name: string
          id: string
          last_login_at?: string | null
          lead_score?: number | null
          phone?: string | null
          referral_code?: string | null
          referred_by?: string | null
          rg?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          state?: string | null
          street?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Update: {
          cep?: string | null
          churn_risk?: string | null
          city?: string | null
          cpf?: string | null
          created_at?: string
          email?: string
          full_name?: string
          id?: string
          last_login_at?: string | null
          lead_score?: number | null
          phone?: string | null
          referral_code?: string | null
          referred_by?: string | null
          rg?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          state?: string | null
          street?: string | null
          tags?: string[] | null
          updated_at?: string
        }
        Relationships: []
      }
      referrals: {
        Row: {
          accepted_at: string | null
          completed_at: string | null
          created_at: string
          id: string
          referral_code: string
          referred_email: string
          referred_user_id: string | null
          referrer_id: string
          reward_claimed: boolean
          reward_points: number | null
          status: string
        }
        Insert: {
          accepted_at?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          referral_code: string
          referred_email: string
          referred_user_id?: string | null
          referrer_id: string
          reward_claimed?: boolean
          reward_points?: number | null
          status?: string
        }
        Update: {
          accepted_at?: string | null
          completed_at?: string | null
          created_at?: string
          id?: string
          referral_code?: string
          referred_email?: string
          referred_user_id?: string | null
          referrer_id?: string
          reward_claimed?: boolean
          reward_points?: number | null
          status?: string
        }
        Relationships: []
      }
      segment_members: {
        Row: {
          added_at: string
          id: string
          segment_id: string
          user_id: string
        }
        Insert: {
          added_at?: string
          id?: string
          segment_id: string
          user_id: string
        }
        Update: {
          added_at?: string
          id?: string
          segment_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "segment_members_segment_id_fkey"
            columns: ["segment_id"]
            isOneToOne: false
            referencedRelation: "segments"
            referencedColumns: ["id"]
          },
        ]
      }
      segments: {
        Row: {
          created_at: string
          created_by: string | null
          filter_conditions: Json
          id: string
          is_dynamic: boolean
          last_calculated_at: string | null
          member_count: number | null
          segment_description: string | null
          segment_name: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          created_by?: string | null
          filter_conditions: Json
          id?: string
          is_dynamic?: boolean
          last_calculated_at?: string | null
          member_count?: number | null
          segment_description?: string | null
          segment_name: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          created_by?: string | null
          filter_conditions?: Json
          id?: string
          is_dynamic?: boolean
          last_calculated_at?: string | null
          member_count?: number | null
          segment_description?: string | null
          segment_name?: string
          updated_at?: string
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          auto_renew: boolean | null
          created_at: string | null
          expires_at: string | null
          id: string
          last_payment_at: string | null
          next_payment_at: string | null
          payment_method: string | null
          plan: string
          started_at: string | null
          status: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          auto_renew?: boolean | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          last_payment_at?: string | null
          next_payment_at?: string | null
          payment_method?: string | null
          plan?: string
          started_at?: string | null
          status?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          auto_renew?: boolean | null
          created_at?: string | null
          expires_at?: string | null
          id?: string
          last_payment_at?: string | null
          next_payment_at?: string | null
          payment_method?: string | null
          plan?: string
          started_at?: string | null
          status?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          badge_description: string
          badge_name: string
          badge_type: string
          earned_at: string
          id: string
          metadata: Json | null
          user_id: string
        }
        Insert: {
          badge_description: string
          badge_name: string
          badge_type: string
          earned_at?: string
          id?: string
          metadata?: Json | null
          user_id: string
        }
        Update: {
          badge_description?: string
          badge_name?: string
          badge_type?: string
          earned_at?: string
          id?: string
          metadata?: Json | null
          user_id?: string
        }
        Relationships: []
      }
      user_challenge_progress: {
        Row: {
          challenge_id: string
          completed: boolean | null
          completed_at: string | null
          completed_tasks: Json | null
          created_at: string | null
          id: string
          total_points_earned: number | null
          user_id: string
        }
        Insert: {
          challenge_id: string
          completed?: boolean | null
          completed_at?: string | null
          completed_tasks?: Json | null
          created_at?: string | null
          id?: string
          total_points_earned?: number | null
          user_id: string
        }
        Update: {
          challenge_id?: string
          completed?: boolean | null
          completed_at?: string | null
          completed_tasks?: Json | null
          created_at?: string | null
          id?: string
          total_points_earned?: number | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_challenge_progress_challenge_id_fkey"
            columns: ["challenge_id"]
            isOneToOne: false
            referencedRelation: "weekly_challenges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_content_progress: {
        Row: {
          completed_at: string | null
          content_id: string
          id: string
          progress_percentage: number
          started_at: string
          status: string
          user_id: string
        }
        Insert: {
          completed_at?: string | null
          content_id: string
          id?: string
          progress_percentage?: number
          started_at?: string
          status?: string
          user_id: string
        }
        Update: {
          completed_at?: string | null
          content_id?: string
          id?: string
          progress_percentage?: number
          started_at?: string
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_content_progress_content_id_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "educational_content"
            referencedColumns: ["id"]
          },
        ]
      }
      user_gamification: {
        Row: {
          created_at: string
          current_level: string
          id: string
          last_activity_date: string | null
          level_points: number
          streak_days: number
          total_points: number
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          current_level?: string
          id?: string
          last_activity_date?: string | null
          level_points?: number
          streak_days?: number
          total_points?: number
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          current_level?: string
          id?: string
          last_activity_date?: string | null
          level_points?: number
          streak_days?: number
          total_points?: number
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      weekly_challenges: {
        Row: {
          active: boolean | null
          bonus_badge: string | null
          created_at: string | null
          description: string | null
          id: string
          tasks: Json
          title: string
          total_points: number
          week_end: string
          week_start: string
        }
        Insert: {
          active?: boolean | null
          bonus_badge?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          tasks?: Json
          title: string
          total_points?: number
          week_end: string
          week_start: string
        }
        Update: {
          active?: boolean | null
          bonus_badge?: string | null
          created_at?: string | null
          description?: string | null
          id?: string
          tasks?: Json
          title?: string
          total_points?: number
          week_end?: string
          week_start?: string
        }
        Relationships: []
      }
      whatsapp_logs: {
        Row: {
          delivered_at: string | null
          external_id: string | null
          id: string
          message_content: string
          message_type: string
          metadata: Json | null
          phone_number: string
          read_at: string | null
          replied_at: string | null
          sent_at: string
          status: string
          user_id: string | null
        }
        Insert: {
          delivered_at?: string | null
          external_id?: string | null
          id?: string
          message_content: string
          message_type: string
          metadata?: Json | null
          phone_number: string
          read_at?: string | null
          replied_at?: string | null
          sent_at?: string
          status?: string
          user_id?: string | null
        }
        Update: {
          delivered_at?: string | null
          external_id?: string | null
          id?: string
          message_content?: string
          message_type?: string
          metadata?: Json | null
          phone_number?: string
          read_at?: string | null
          replied_at?: string | null
          sent_at?: string
          status?: string
          user_id?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_view_profile: {
        Args: { _profile_id: string }
        Returns: {
          cpf: string
          created_at: string
          email: string
          full_name: string
          id: string
          phone: string
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
        }[]
      }
      generate_referral_code: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      is_assigned_consultant: {
        Args: { _client_id: string; _consultant_id: string }
        Returns: boolean
      }
      log_admin_action: {
        Args: { p_action: string; p_record_id?: string; p_table_name: string }
        Returns: undefined
      }
    }
    Enums: {
      app_role: "client" | "consultant" | "admin"
      score_dimension:
        | "debts"
        | "behavior"
        | "spending"
        | "goals"
        | "reserves"
        | "income"
      user_role: "client" | "consultant" | "admin"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["client", "consultant", "admin"],
      score_dimension: [
        "debts",
        "behavior",
        "spending",
        "goals",
        "reserves",
        "income",
      ],
      user_role: ["client", "consultant", "admin"],
    },
  },
} as const
