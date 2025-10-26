import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Trophy, Star, Flame } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Task {
  id: string;
  title: string;
  description: string;
  points: number;
  completed: boolean;
}

interface Challenge {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
  total_points: number;
  bonus_badge?: string;
  week_start: string;
  week_end: string;
}

interface UserProgress {
  id: string;
  challenge_id: string;
  completed_tasks: string[];
  total_points_earned: number;
  completed: boolean;
}

export default function WeeklyChallenges() {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [progress, setProgress] = useState<UserProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchCurrentChallenge();
    subscribeToProgress();
  }, []);

  const subscribeToProgress = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const channel = supabase
      .channel('user_challenge_progress')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'user_challenge_progress',
          filter: `user_id=eq.${user.id}`
        },
        () => {
          fetchCurrentChallenge();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  };

  const fetchCurrentChallenge = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Fetch current week's challenge
      const today = new Date().toISOString().split('T')[0];
      const { data: challengeData, error: challengeError } = await supabase
        .from("weekly_challenges")
        .select("*")
        .eq("active", true)
        .lte("week_start", today)
        .gte("week_end", today)
        .single();

      if (challengeError) {
        console.error("Error fetching challenge:", challengeError);
        return;
      }

      if (challengeData) {
        setChallenge({
          ...challengeData,
          tasks: challengeData.tasks as unknown as Task[]
        } as Challenge);

        // Fetch user's progress
        const { data: progressData } = await supabase
          .from("user_challenge_progress")
          .select("*")
          .eq("user_id", user.id)
          .eq("challenge_id", challengeData.id)
          .single();

        if (progressData) {
          setProgress(progressData as UserProgress);
        }
      }
    } catch (error) {
      console.error("Error fetching challenge:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleTask = async (taskId: string, taskPoints: number) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !challenge) return;

      const currentCompletedTasks = progress?.completed_tasks || [];
      const isCompleting = !currentCompletedTasks.includes(taskId);
      
      const newCompletedTasks = isCompleting
        ? [...currentCompletedTasks, taskId]
        : currentCompletedTasks.filter(id => id !== taskId);

      const newPointsEarned = isCompleting
        ? (progress?.total_points_earned || 0) + taskPoints
        : (progress?.total_points_earned || 0) - taskPoints;

      const allTasksCompleted = newCompletedTasks.length === challenge.tasks.length;

      if (progress) {
        // Update existing progress
        const { error } = await supabase
          .from("user_challenge_progress")
          .update({
            completed_tasks: newCompletedTasks,
            total_points_earned: newPointsEarned,
            completed: allTasksCompleted,
            completed_at: allTasksCompleted ? new Date().toISOString() : null
          })
          .eq("id", progress.id);

        if (error) throw error;
      } else {
        // Create new progress
        const { error } = await supabase
          .from("user_challenge_progress")
          .insert({
            user_id: user.id,
            challenge_id: challenge.id,
            completed_tasks: newCompletedTasks,
            total_points_earned: newPointsEarned,
            completed: allTasksCompleted,
            completed_at: allTasksCompleted ? new Date().toISOString() : null
          });

        if (error) throw error;
      }

      if (isCompleting) {
        toast({
          title: "Tarefa Concluída! 🎉",
          description: `+${taskPoints} pontos ganhos!`,
        });
      }

      if (allTasksCompleted) {
        toast({
          title: "Desafio Completo! 🏆",
          description: `Você completou o desafio e ganhou ${newPointsEarned} pontos!`,
        });

        // Award badge if applicable
        if (challenge.bonus_badge) {
          await supabase.functions.invoke('award-badge', {
            body: { 
              badgeName: challenge.bonus_badge,
              context: `Desafio Semanal: ${challenge.title}`
            }
          });
        }
      }

      fetchCurrentChallenge();
    } catch (error) {
      console.error("Error toggling task:", error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a tarefa.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="h-32 bg-muted animate-pulse rounded" />
        </CardContent>
      </Card>
    );
  }

  if (!challenge) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <Trophy className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
          <p className="text-muted-foreground">
            Nenhum desafio ativo no momento
          </p>
        </CardContent>
      </Card>
    );
  }

  const completedTasks = progress?.completed_tasks || [];
  const progressPercentage = (completedTasks.length / challenge.tasks.length) * 100;
  const daysRemaining = Math.ceil(
    (new Date(challenge.week_end).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className="border-2 border-primary/20">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <Flame className="h-5 w-5 text-primary" />
              <CardTitle className="text-lg">Desafio da Semana</CardTitle>
              <Badge variant="outline" className="text-xs">
                {daysRemaining} {daysRemaining === 1 ? 'dia' : 'dias'} restantes
              </Badge>
            </div>
            <CardDescription className="text-base font-medium">
              {challenge.title}
            </CardDescription>
            <p className="text-sm text-muted-foreground mt-1">
              {challenge.description}
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-primary font-bold">
              <Star className="h-4 w-4" />
              <span>{progress?.total_points_earned || 0}/{challenge.total_points}</span>
            </div>
            <p className="text-xs text-muted-foreground">pontos</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-muted-foreground">Progresso</span>
            <span className="font-medium">{completedTasks.length}/{challenge.tasks.length} tarefas</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <div className="space-y-3">
          {challenge.tasks.map((task) => {
            const isCompleted = completedTasks.includes(task.id);
            
            return (
              <div
                key={task.id}
                className={`flex items-start gap-3 p-3 rounded-lg border ${
                  isCompleted ? 'bg-success/5 border-success/20' : 'bg-muted/50'
                }`}
              >
                <Checkbox
                  checked={isCompleted}
                  onCheckedChange={() => toggleTask(task.id, task.points)}
                  className="mt-1"
                />
                <div className="flex-1 min-w-0">
                  <h4 className={`font-medium text-sm ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                    {task.title}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-1">
                    {task.description}
                  </p>
                </div>
                <Badge variant={isCompleted ? 'default' : 'outline'} className="text-xs flex-shrink-0">
                  {task.points} pts
                </Badge>
              </div>
            );
          })}
        </div>

        {progress?.completed && (
          <div className="p-4 bg-success/10 border border-success/20 rounded-lg text-center">
            <Trophy className="h-8 w-8 mx-auto mb-2 text-success" />
            <p className="font-semibold text-success">Desafio Completo!</p>
            <p className="text-sm text-muted-foreground mt-1">
              Parabéns! Você ganhou {progress.total_points_earned} pontos!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}