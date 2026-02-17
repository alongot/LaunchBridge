import { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  description?: string;
  icon: LucideIcon;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  className?: string;
}

export function StatsCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  className,
}: StatsCardProps) {
  return (
    <Card className={cn("hover:shadow-md transition-shadow", className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-[var(--muted)] mb-1">{title}</p>
            <p className="text-3xl font-semibold">{value}</p>
            {description && (
              <p className="text-sm text-[var(--muted)] mt-1">{description}</p>
            )}
            {trend && (
              <p
                className={cn(
                  "text-sm mt-2",
                  trend.isPositive ? "text-[var(--success)]" : "text-[var(--error)]"
                )}
              >
                {trend.isPositive ? "+" : "-"}
                {Math.abs(trend.value)}% from last month
              </p>
            )}
          </div>
          <div className="w-12 h-12 rounded-[var(--radius-md)] bg-[var(--primary)]/10 flex items-center justify-center">
            <Icon className="h-6 w-6 text-[var(--primary)]" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
