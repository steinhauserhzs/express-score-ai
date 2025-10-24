-- ============================================================================
-- FASE 1: TABELAS DE GAMIFICAÇÃO
-- ============================================================================

-- Tabela de badges do usuário
CREATE TABLE IF NOT EXISTS public.user_badges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  badge_type TEXT NOT NULL CHECK (badge_type IN (
    'first_step', 'persistent', 'evolving', 'educated', 
    'saver', 'investor', 'influencer', 'consultant_ready',
    'debt_free', 'emergency_fund', 'consistent'
  )),
  badge_name TEXT NOT NULL,
  badge_description TEXT NOT NULL,
  earned_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  metadata JSONB DEFAULT '{}'::jsonb,
  UNIQUE(user_id, badge_type)
);

-- Tabela de gamificação (pontos e níveis)
CREATE TABLE IF NOT EXISTS public.user_gamification (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  total_points INTEGER NOT NULL DEFAULT 0,
  current_level TEXT NOT NULL DEFAULT 'bronze' CHECK (current_level IN ('bronze', 'silver', 'gold', 'platinum', 'diamond')),
  level_points INTEGER NOT NULL DEFAULT 0,
  streak_days INTEGER NOT NULL DEFAULT 0,
  last_activity_date DATE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================================
-- FASE 2: AUTOMAÇÕES E COMUNICAÇÃO
-- ============================================================================

-- Tabela de logs de email
CREATE TABLE IF NOT EXISTS public.email_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  email_type TEXT NOT NULL CHECK (email_type IN (
    'welcome', 'diagnostic_reminder', 'report_ready', 
    'consultation_reminder', 'post_consultation', 're_engagement',
    'score_improvement', 'lead_nurture', 'educational'
  )),
  recipient_email TEXT NOT NULL,
  subject TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  opened_at TIMESTAMP WITH TIME ZONE,
  clicked_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'opened', 'clicked', 'bounced', 'failed')),
  external_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Tabela de logs de WhatsApp
CREATE TABLE IF NOT EXISTS public.whatsapp_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  message_type TEXT NOT NULL CHECK (message_type IN (
    'welcome', 'consultation_reminder', 'report_ready', 
    'post_consultation', 'follow_up', 'promotional'
  )),
  phone_number TEXT NOT NULL,
  message_content TEXT NOT NULL,
  sent_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  delivered_at TIMESTAMP WITH TIME ZONE,
  read_at TIMESTAMP WITH TIME ZONE,
  replied_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'read', 'replied', 'failed')),
  external_id TEXT,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Tabela de triggers de automação
CREATE TABLE IF NOT EXISTS public.automation_triggers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trigger_name TEXT NOT NULL UNIQUE,
  trigger_type TEXT NOT NULL CHECK (trigger_type IN (
    'low_score', 'incomplete_diagnostic', 'inactive_user',
    'consultation_scheduled', 'score_improved', 'churn_risk',
    'lead_score_change', 'badge_earned'
  )),
  condition_config JSONB NOT NULL,
  action_type TEXT NOT NULL CHECK (action_type IN ('email', 'whatsapp', 'notification', 'tag', 'segment')),
  action_config JSONB NOT NULL,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_executed_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================================
-- FASE 3: JORNADA DO CLIENTE E ANALYTICS
-- ============================================================================

-- Tabela de eventos da jornada do cliente
CREATE TABLE IF NOT EXISTS public.customer_journey_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL CHECK (event_type IN (
    'signup', 'login', 'diagnostic_started', 'diagnostic_completed',
    'report_generated', 'report_viewed', 'consultation_scheduled',
    'consultation_completed', 'email_opened', 'email_clicked',
    'whatsapp_received', 'whatsapp_replied', 'badge_earned',
    'level_up', 'referral_made', 'content_viewed', 'payment_made'
  )),
  event_title TEXT NOT NULL,
  event_description TEXT,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de eventos de produto (analytics)
CREATE TABLE IF NOT EXISTS public.product_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id UUID,
  event_name TEXT NOT NULL,
  event_category TEXT NOT NULL CHECK (event_category IN (
    'page_view', 'diagnostic', 'consultation', 'report', 
    'engagement', 'conversion', 'error', 'performance'
  )),
  page_path TEXT,
  properties JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================================
-- FASE 4: SEGMENTAÇÃO E FOLLOW-UP
-- ============================================================================

-- Tabela de segmentos
CREATE TABLE IF NOT EXISTS public.segments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  segment_name TEXT NOT NULL UNIQUE,
  segment_description TEXT,
  filter_conditions JSONB NOT NULL,
  created_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  is_dynamic BOOLEAN NOT NULL DEFAULT true,
  last_calculated_at TIMESTAMP WITH TIME ZONE,
  member_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de membros de segmentos
CREATE TABLE IF NOT EXISTS public.segment_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  segment_id UUID NOT NULL REFERENCES public.segments(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  added_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(segment_id, user_id)
);

-- Tabela de follow-ups
CREATE TABLE IF NOT EXISTS public.follow_ups (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  client_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  consultant_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  follow_up_type TEXT NOT NULL CHECK (follow_up_type IN (
    'post_consultation', 'progress_check', 'reminder', 'custom'
  )),
  scheduled_date TIMESTAMP WITH TIME ZONE NOT NULL,
  completed_at TIMESTAMP WITH TIME ZONE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'cancelled', 'rescheduled')),
  notes TEXT,
  outcome TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================================
-- FASE 5: REFERRAL E EDUCAÇÃO
-- ============================================================================

-- Tabela de indicações (referrals)
CREATE TABLE IF NOT EXISTS public.referrals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  referrer_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  referred_email TEXT NOT NULL,
  referred_user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  referral_code TEXT NOT NULL UNIQUE,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'completed', 'expired')),
  reward_points INTEGER DEFAULT 0,
  reward_claimed BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  accepted_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE
);

-- Tabela de conteúdo educacional
CREATE TABLE IF NOT EXISTS public.educational_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content_type TEXT NOT NULL CHECK (content_type IN ('article', 'video', 'podcast', 'infographic', 'course')),
  category TEXT NOT NULL CHECK (category IN (
    'debts', 'investments', 'budget', 'savings', 
    'credit', 'taxes', 'retirement', 'insurance', 'general'
  )),
  description TEXT,
  content_url TEXT,
  content_body TEXT,
  thumbnail_url TEXT,
  difficulty_level TEXT NOT NULL DEFAULT 'beginner' CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
  estimated_time_minutes INTEGER,
  view_count INTEGER NOT NULL DEFAULT 0,
  is_published BOOLEAN NOT NULL DEFAULT true,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de progresso educacional do usuário
CREATE TABLE IF NOT EXISTS public.user_content_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  content_id UUID NOT NULL REFERENCES public.educational_content(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'started' CHECK (status IN ('started', 'in_progress', 'completed')),
  progress_percentage INTEGER NOT NULL DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  completed_at TIMESTAMP WITH TIME ZONE,
  UNIQUE(user_id, content_id)
);

-- ============================================================================
-- FASE 6: CHATBOT E CONVERSAS
-- ============================================================================

-- Tabela de conversas do chatbot
CREATE TABLE IF NOT EXISTS public.chatbot_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  conversation_type TEXT NOT NULL DEFAULT 'general' CHECK (conversation_type IN (
    'general', 'diagnostic_questions', 'admin_assistant', 'support'
  )),
  started_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ended_at TIMESTAMP WITH TIME ZONE,
  message_count INTEGER NOT NULL DEFAULT 0,
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Tabela de mensagens do chatbot
CREATE TABLE IF NOT EXISTS public.chatbot_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES public.chatbot_conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- ============================================================================
-- ADICIONAR CAMPOS EM PROFILES
-- ============================================================================

-- Adicionar campos de scoring e previsão em profiles
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS lead_score INTEGER DEFAULT 50 CHECK (lead_score >= 0 AND lead_score <= 100),
ADD COLUMN IF NOT EXISTS churn_risk TEXT DEFAULT 'low' CHECK (churn_risk IN ('low', 'medium', 'high')),
ADD COLUMN IF NOT EXISTS referral_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS referred_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;

-- ============================================================================
-- ÍNDICES PARA PERFORMANCE
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_user_badges_user_id ON public.user_badges(user_id);
CREATE INDEX IF NOT EXISTS idx_user_gamification_user_id ON public.user_gamification(user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_user_id ON public.email_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_email_logs_sent_at ON public.email_logs(sent_at DESC);
CREATE INDEX IF NOT EXISTS idx_whatsapp_logs_user_id ON public.whatsapp_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_journey_events_user_id ON public.customer_journey_events(user_id);
CREATE INDEX IF NOT EXISTS idx_customer_journey_events_created_at ON public.customer_journey_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_product_events_user_id ON public.product_events(user_id);
CREATE INDEX IF NOT EXISTS idx_product_events_created_at ON public.product_events(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_follow_ups_client_id ON public.follow_ups(client_id);
CREATE INDEX IF NOT EXISTS idx_follow_ups_scheduled_date ON public.follow_ups(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_referrals_referrer_id ON public.referrals(referrer_id);
CREATE INDEX IF NOT EXISTS idx_referrals_referral_code ON public.referrals(referral_code);
CREATE INDEX IF NOT EXISTS idx_chatbot_conversations_user_id ON public.chatbot_conversations(user_id);
CREATE INDEX IF NOT EXISTS idx_chatbot_messages_conversation_id ON public.chatbot_messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_user_content_progress_user_id ON public.user_content_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_lead_score ON public.profiles(lead_score DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_churn_risk ON public.profiles(churn_risk);

-- ============================================================================
-- RLS POLICIES
-- ============================================================================

-- Policies para user_badges
ALTER TABLE public.user_badges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own badges" ON public.user_badges
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all badges" ON public.user_badges
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert badges" ON public.user_badges
  FOR INSERT WITH CHECK (true);

-- Policies para user_gamification
ALTER TABLE public.user_gamification ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own gamification" ON public.user_gamification
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update own gamification" ON public.user_gamification
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all gamification" ON public.user_gamification
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert gamification" ON public.user_gamification
  FOR INSERT WITH CHECK (true);

-- Policies para email_logs
ALTER TABLE public.email_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all email logs" ON public.email_logs
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert email logs" ON public.email_logs
  FOR INSERT WITH CHECK (true);

-- Policies para whatsapp_logs
ALTER TABLE public.whatsapp_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all whatsapp logs" ON public.whatsapp_logs
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert whatsapp logs" ON public.whatsapp_logs
  FOR INSERT WITH CHECK (true);

-- Policies para automation_triggers
ALTER TABLE public.automation_triggers ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage automation triggers" ON public.automation_triggers
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Policies para customer_journey_events
ALTER TABLE public.customer_journey_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own journey events" ON public.customer_journey_events
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all journey events" ON public.customer_journey_events
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert journey events" ON public.customer_journey_events
  FOR INSERT WITH CHECK (true);

-- Policies para product_events
ALTER TABLE public.product_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view all product events" ON public.product_events
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

CREATE POLICY "System can insert product events" ON public.product_events
  FOR INSERT WITH CHECK (true);

-- Policies para segments
ALTER TABLE public.segments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage segments" ON public.segments
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Policies para segment_members
ALTER TABLE public.segment_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage segment members" ON public.segment_members
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Policies para follow_ups
ALTER TABLE public.follow_ups ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Clients can view own follow_ups" ON public.follow_ups
  FOR SELECT USING (auth.uid() = client_id);

CREATE POLICY "Consultants can view assigned follow_ups" ON public.follow_ups
  FOR SELECT USING (auth.uid() = consultant_id);

CREATE POLICY "Admins can manage all follow_ups" ON public.follow_ups
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Policies para referrals
ALTER TABLE public.referrals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own referrals" ON public.referrals
  FOR SELECT USING (auth.uid() = referrer_id);

CREATE POLICY "Users can create own referrals" ON public.referrals
  FOR INSERT WITH CHECK (auth.uid() = referrer_id);

CREATE POLICY "Admins can view all referrals" ON public.referrals
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- Policies para educational_content
ALTER TABLE public.educational_content ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Everyone can view published content" ON public.educational_content
  FOR SELECT USING (is_published = true OR has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage educational content" ON public.educational_content
  FOR ALL USING (has_role(auth.uid(), 'admin'));

-- Policies para user_content_progress
ALTER TABLE public.user_content_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own content progress" ON public.user_content_progress
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all content progress" ON public.user_content_progress
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- Policies para chatbot_conversations
ALTER TABLE public.chatbot_conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own conversations" ON public.chatbot_conversations
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all conversations" ON public.chatbot_conversations
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- Policies para chatbot_messages
ALTER TABLE public.chatbot_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversation messages" ON public.chatbot_messages
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.chatbot_conversations 
      WHERE id = conversation_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own conversation messages" ON public.chatbot_messages
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.chatbot_conversations 
      WHERE id = conversation_id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all messages" ON public.chatbot_messages
  FOR SELECT USING (has_role(auth.uid(), 'admin'));

-- ============================================================================
-- TRIGGERS
-- ============================================================================

-- Trigger para atualizar updated_at em user_gamification
CREATE OR REPLACE FUNCTION update_user_gamification_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_gamification_updated_at_trigger
  BEFORE UPDATE ON public.user_gamification
  FOR EACH ROW
  EXECUTE FUNCTION update_user_gamification_updated_at();

-- Trigger para atualizar updated_at em automation_triggers
CREATE TRIGGER update_automation_triggers_updated_at_trigger
  BEFORE UPDATE ON public.automation_triggers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para atualizar updated_at em segments
CREATE TRIGGER update_segments_updated_at_trigger
  BEFORE UPDATE ON public.segments
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para atualizar updated_at em follow_ups
CREATE TRIGGER update_follow_ups_updated_at_trigger
  BEFORE UPDATE ON public.follow_ups
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger para atualizar updated_at em educational_content
CREATE TRIGGER update_educational_content_updated_at_trigger
  BEFORE UPDATE ON public.educational_content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- ============================================================================
-- FUNÇÕES AUXILIARES
-- ============================================================================

-- Função para gerar código de referral único
CREATE OR REPLACE FUNCTION generate_referral_code()
RETURNS TEXT AS $$
DECLARE
  code TEXT;
  exists BOOLEAN;
BEGIN
  LOOP
    code := upper(substring(md5(random()::text) from 1 for 8));
    SELECT EXISTS(SELECT 1 FROM public.profiles WHERE referral_code = code) INTO exists;
    EXIT WHEN NOT exists;
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;

-- Trigger para gerar código de referral automaticamente
CREATE OR REPLACE FUNCTION set_referral_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.referral_code IS NULL THEN
    NEW.referral_code := generate_referral_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_referral_code_trigger
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION set_referral_code();