import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface UserAboutProps {
  about: string;
}

export function UserAbout({ about }: UserAboutProps) {
  return (
    <Card className="glass-card rounded-2xl border-none shadow-md animate-fade-in">
      <CardHeader className="p-5 pb-2">
        <CardTitle className="text-base font-bold">About Me</CardTitle>
      </CardHeader>
      <CardContent className="p-5 pt-0">
        <p className="text-xs text-muted-foreground leading-relaxed">{about}</p>
      </CardContent>
    </Card>
  );
}
