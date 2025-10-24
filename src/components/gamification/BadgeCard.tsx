import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface BadgeCardProps {
  badgeName: string;
  badgeDescription: string;
  earnedAt: string;
  locked?: boolean;
}

export default function BadgeCard({
  badgeName,
  badgeDescription,
  earnedAt,
  locked = false,
}: BadgeCardProps) {
  return (
    <Card
      className={`p-4 transition-all ${
        locked
          ? "opacity-50 grayscale"
          : "hover:shadow-lg hover:scale-105 cursor-pointer"
      }`}
    >
      <div className="flex flex-col items-center text-center space-y-2">
        <div className="text-5xl">{badgeName.split(" ")[0]}</div>
        <h3 className="font-semibold">{badgeName}</h3>
        <p className="text-sm text-muted-foreground">{badgeDescription}</p>
        {!locked && (
          <Badge variant="secondary" className="text-xs">
            Conquistado{" "}
            {formatDistanceToNow(new Date(earnedAt), {
              addSuffix: true,
              locale: ptBR,
            })}
          </Badge>
        )}
        {locked && (
          <Badge variant="outline" className="text-xs">
            🔒 Bloqueado
          </Badge>
        )}
      </div>
    </Card>
  );
}
