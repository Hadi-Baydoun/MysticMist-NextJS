import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <Card className="w-full max-w-xs transition-shadow hover:shadow-[0_18px_50px_-16px_rgba(161,86,180,0.42)]">
      <CardHeader className="space-y-2">
        <Skeleton className="h-3.5 w-2/3 rounded-full" />
        <Skeleton className="h-3.5 w-1/2 rounded-full" />
      </CardHeader>
      <CardContent>
        <Skeleton className="aspect-video w-full rounded-xl opacity-90" />
      </CardContent>
    </Card>
  );
}
