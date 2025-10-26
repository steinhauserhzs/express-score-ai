import { memo } from "react";
import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { TrendingUp, TrendingDown } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  subtitle?: string;
  iconColor?: string;
  iconBg?: string;
}

const StatCard = memo(function StatCard({
  title,
  value,
  icon: Icon,
  trend,
  subtitle,
  iconColor = "text-primary",
  iconBg = "bg-primary/10"
}: StatCardProps) {
  return (
    <Card className="p-4 md:p-6 hover-lift">
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs md:text-sm text-muted-foreground mb-1 break-words">
            {title}
          </p>
          <h3 className="text-2xl md:text-3xl font-bold mb-2 break-words">
            {value}
          </h3>
          {subtitle && (
            <p className="text-xs text-muted-foreground break-words">{subtitle}</p>
          )}
          {trend && (
            <div className={`flex items-center gap-1 mt-2 text-sm ${
              trend.direction === 'up' ? 'text-success' : 'text-destructive'
            }`}>
              {trend.direction === 'up' ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              <span className="font-medium">{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        <div className={`${iconBg} p-2 md:p-3 rounded-xl flex-shrink-0`}>
          <Icon className={`h-5 w-5 md:h-6 md:w-6 ${iconColor}`} />
        </div>
      </div>
    </Card>
  );
});

export default StatCard;
