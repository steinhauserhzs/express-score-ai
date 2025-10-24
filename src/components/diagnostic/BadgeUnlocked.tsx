import { Card } from "@/components/ui/card";
import { Award, Sparkles } from "lucide-react";

interface BadgeUnlockedProps {
  badgeName: string;
  badgeDescription: string;
}

export default function BadgeUnlocked({ badgeName, badgeDescription }: BadgeUnlockedProps) {
  return (
    <Card className="p-6 bg-gradient-primary text-primary-foreground shadow-glow border-none overflow-hidden relative">
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
      <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12" />
      
      <div className="relative z-10 flex items-center gap-6">
        <div className="flex-shrink-0">
          <div className="w-20 h-20 bg-primary-foreground/20 rounded-full flex items-center justify-center animate-bounce-in">
            <Award className="w-12 h-12 text-primary-foreground" />
          </div>
        </div>
        
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="w-5 h-5" />
            <h3 className="text-xl font-bold">Conquista Desbloqueada!</h3>
          </div>
          <h4 className="text-2xl font-bold mb-1">{badgeName}</h4>
          <p className="text-primary-foreground/90">{badgeDescription}</p>
        </div>
      </div>
    </Card>
  );
}
