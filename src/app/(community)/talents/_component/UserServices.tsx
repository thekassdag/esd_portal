import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface UserServicesProps {
  services: string[];
}

export function UserServices({ services }: UserServicesProps) {
  return (
    <Card className="glass-card rounded-2xl border-none shadow-md animate-fade-in">
      <CardHeader className="px-5 pb-2">
        <CardTitle className="text-sm font-bold text-muted-foreground">Services I Offer</CardTitle>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <div className="flex flex-wrap gap-2">
          {services.map((service) => (
            <Badge
              key={service}
              variant="secondary"
              className="text-xs font-medium px-3 py-1 bg-primary/10 text-primary border-primary/20 hover:bg-primary hover:text-primary-foreground transition-all cursor-default"
            >
              {service}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
