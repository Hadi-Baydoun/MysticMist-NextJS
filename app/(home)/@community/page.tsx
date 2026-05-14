import { Suspense } from "react";

import {
  Community,
  CommunitySectionSkeleton,
} from "@/components/Homepage/Community";

export default function CommunitySlot() {
  return (
    <Suspense fallback={<CommunitySectionSkeleton />}>
      <Community />
    </Suspense>
  );
}
