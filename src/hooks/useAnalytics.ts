import { supabase } from "@/integrations/supabase/client";

export function useAnalytics() {
  const trackEvent = async (
    eventName: string,
    eventCategory: string,
    properties?: Record<string, any>
  ) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      await supabase.functions.invoke('track-event', {
        body: {
          eventName,
          eventCategory,
          pagePath: window.location.pathname,
          properties: {
            ...properties,
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer
          }
        }
      });
      
      console.log(`[Analytics] ${eventCategory}:${eventName}`, properties);
    } catch (error) {
      console.error('Error tracking event:', error);
    }
  };

  // Convenience methods for common events
  const trackGoalCreated = (goalData: any) => {
    trackEvent('goal_created', 'goals', {
      category: goalData.category,
      priority: goalData.priority,
      target_amount: goalData.target_amount
    });
  };

  const trackGoalCompleted = (goalData: any) => {
    trackEvent('goal_completed', 'goals', {
      category: goalData.category,
      target_amount: goalData.target_amount,
      days_to_complete: Math.ceil(
        (new Date(goalData.achieved_at).getTime() - new Date(goalData.created_at).getTime()) 
        / (1000 * 60 * 60 * 24)
      )
    });
  };

  const trackDiagnosticAbandoned = (diagnosticId: string, questionNumber: number) => {
    trackEvent('diagnostic_abandoned', 'diagnostic', {
      diagnosticId,
      questionNumber,
      completion_rate: (questionNumber / 39) * 100
    });
  };

  const trackDiagnosticCompleted = (diagnosticData: any) => {
    trackEvent('diagnostic_completed', 'diagnostic', {
      total_score: diagnosticData.total_score,
      classification: diagnosticData.score_classification,
      profile: diagnosticData.profile,
      duration_minutes: Math.ceil(
        (new Date(diagnosticData.updated_at).getTime() - new Date(diagnosticData.created_at).getTime()) 
        / (1000 * 60)
      )
    });
  };

  const trackConsultationBooked = (consultationType: string) => {
    trackEvent('consultation_booked', 'consultations', {
      consultation_type: consultationType
    });
  };

  const trackUpsellViewed = (score: number, debtScore: number) => {
    trackEvent('upsell_viewed', 'conversion', {
      total_score: score,
      debt_score: debtScore
    });
  };

  const trackUpsellConverted = (score: number) => {
    trackEvent('upsell_converted', 'conversion', {
      total_score: score
    });
  };

  const trackUpsellDismissed = (score: number) => {
    trackEvent('upsell_dismissed', 'conversion', {
      total_score: score
    });
  };

  return {
    trackEvent,
    trackGoalCreated,
    trackGoalCompleted,
    trackDiagnosticAbandoned,
    trackDiagnosticCompleted,
    trackConsultationBooked,
    trackUpsellViewed,
    trackUpsellConverted,
    trackUpsellDismissed
  };
}
