import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserStatsProps {
  stats: {
    label: string;
    value: string;
  }[];
}

export function UserStats({ stats }: UserStatsProps) {
  return (
    <Card className="glass-card rounded-2xl border-none shadow-md animate-fade-in">
      <CardHeader className="px-5 pb-2">
        <CardTitle className="text-sm font-bold text-muted-foreground">Project Submission Milestones</CardTitle>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <div className="grid grid-cols-3 gap-4 text-center">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center gap-1">
              <span className="text-lg md:text-xl font-black text-foreground">{stat.value}</span>
              <span className="text-[10px] md:text-xs text-muted-foreground font-medium">{stat.label}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
