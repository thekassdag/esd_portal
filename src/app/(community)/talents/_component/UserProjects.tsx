import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import { TelegramPost } from "@/components/ui/TelegramPost";

interface UserProjectsProps {
  telegramChannel: string;
  telegramPosts: number[];
}

export function UserProjects({ telegramChannel, telegramPosts }: UserProjectsProps) {
  return (
    <Card className="glass-card rounded-2xl border-none shadow-md animate-fade-in">
      <CardHeader className="p-5 pb-0 flex flex-row items-center justify-between space-y-0">
        <CardTitle className="text-base font-bold text-foreground">Projects</CardTitle>
        <Button
          variant="link"
          size="sm"
          className="h-auto p-0 text-primary text-xs"
          nativeButton={false}
          render={
            <a
              href={`https://t.me/${telegramChannel}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              View All <ChevronRight size={12} className="ml-0.5" />
            </a>
          }
        />
      </CardHeader>
      <CardContent className="p-5">
        <div className="columns-1 sm:columns-2 gap-3 [&>div]:break-inside-avoid [&>div]:mb-3">
          {telegramPosts.map((postId) => (
            <TelegramPost
              key={postId}
              channel={telegramChannel}
              messageId={postId}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
