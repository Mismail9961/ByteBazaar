export const dynamic = "force-dynamic";

import { Suspense } from "react";
import LoginPage from "@/components/Login";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LoginPage />
    </Suspense>
  );
}