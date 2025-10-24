import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Search, BookOpen, Video, PlayCircle, Clock, TrendingUp } from "lucide-react";
import Logo from "@/components/Logo";

interface Content {
  id: string;
  title: string;
  content_type: string;
  category: string;
  description: string;
  content_url: string | null;
  thumbnail_url: string | null;
  difficulty_level: string;
  estimated_time_minutes: number | null;
  view_count: number;
}

interface UserProgress {
  content_id: string;
  status: string;
  progress_percentage: number;
}

export default function Education() {
  const [contents, setContents] = useState<Content[]>([]);
  const [userProgress, setUserProgress] = useState<Record<string, UserProgress>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    checkAuth();
    loadContent();
    loadProgress();
  }, []);

  const checkAuth = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/auth");
    }
  };

  const loadContent = async () => {
    try {
      const { data, error } = await supabase
        .from("educational_content")
        .select("*")
        .eq("is_published", true)
        .order("created_at", { ascending: false });

      if (error) throw error;
      setContents(data || []);
    } catch (error) {
      console.error("Error loading content:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadProgress = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from("user_content_progress")
        .select("*")
        .eq("user_id", user.id);

      if (error) throw error;

      const progressMap: Record<string, UserProgress> = {};
      data?.forEach((p) => {
        progressMap[p.content_id] = p;
      });
      setUserProgress(progressMap);
    } catch (error) {
      console.error("Error loading progress:", error);
    }
  };

  const startContent = async (contentId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { error } = await supabase
        .from("user_content_progress")
        .upsert({
          user_id: user.id,
          content_id: contentId,
          status: "started",
          progress_percentage: 0,
        });

      if (error) throw error;

      // Update view count
      const content = contents.find((c) => c.id === contentId);
      if (content) {
        await supabase
          .from("educational_content")
          .update({ view_count: content.view_count + 1 })
          .eq("id", contentId);
      }

      // Track journey event
      await supabase.from("customer_journey_events").insert({
        user_id: user.id,
        event_type: "content_viewed",
        event_title: "Conteúdo Educacional Iniciado",
        event_description: content?.title,
        metadata: { content_id: contentId },
      });

      toast({
        title: "Conteúdo iniciado",
        description: "Seu progresso está sendo rastreado",
      });

      loadProgress();
    } catch (error) {
      console.error("Error starting content:", error);
    }
  };

  const filteredContents = contents.filter((content) => {
    const matchesSearch = content.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      content.description?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "all" || content.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { value: "all", label: "Todos", icon: BookOpen },
    { value: "debts", label: "Dívidas", icon: TrendingUp },
    { value: "investments", label: "Investimentos", icon: TrendingUp },
    { value: "budget", label: "Orçamento", icon: BookOpen },
    { value: "savings", label: "Poupança", icon: TrendingUp },
  ];

  const getDifficultyColor = (level: string) => {
    switch (level) {
      case "beginner": return "bg-green-500";
      case "intermediate": return "bg-yellow-500";
      case "advanced": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  const getContentIcon = (type: string) => {
    switch (type) {
      case "video": return Video;
      case "article": return BookOpen;
      default: return BookOpen;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <Logo />
          </div>
          <h1 className="text-xl font-bold">Educação Financeira</h1>
          <div className="w-20" />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Aprenda sobre Finanças</h2>
          <p className="text-muted-foreground">
            Conteúdos selecionados para melhorar sua saúde financeira
          </p>
        </div>

        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar conteúdos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList>
            {categories.map((cat) => (
              <TabsTrigger key={cat.value} value={cat.value}>
                <cat.icon className="h-4 w-4 mr-2" />
                {cat.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {loading ? (
          <div className="text-center py-12">Carregando conteúdos...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredContents.map((content) => {
              const ContentIcon = getContentIcon(content.content_type);
              const progress = userProgress[content.id];

              return (
                <Card key={content.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="aspect-video bg-muted relative">
                    {content.thumbnail_url ? (
                      <img
                        src={content.thumbnail_url}
                        alt={content.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ContentIcon className="h-16 w-16 text-muted-foreground" />
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <Badge className={getDifficultyColor(content.difficulty_level)}>
                        {content.difficulty_level}
                      </Badge>
                    </div>
                  </div>

                  <div className="p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge variant="outline">{content.category}</Badge>
                      {content.estimated_time_minutes && (
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {content.estimated_time_minutes} min
                        </div>
                      )}
                    </div>

                    <h3 className="font-semibold mb-2">{content.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                      {content.description}
                    </p>

                    {progress ? (
                      <div className="space-y-2">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Progresso: {progress.progress_percentage}%</span>
                          <span className="capitalize">{progress.status}</span>
                        </div>
                        <Button className="w-full" onClick={() => startContent(content.id)}>
                          Continuar
                        </Button>
                      </div>
                    ) : (
                      <Button className="w-full" onClick={() => startContent(content.id)}>
                        <PlayCircle className="h-4 w-4 mr-2" />
                        Começar
                      </Button>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {filteredContents.length === 0 && !loading && (
          <div className="text-center py-12 text-muted-foreground">
            <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
            <p>Nenhum conteúdo encontrado</p>
          </div>
        )}
      </main>
    </div>
  );
}
