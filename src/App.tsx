import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";
import { EvaluateLessonGate } from "@/components/evaluate-lesson/EvaluateLessonGate";
import { AppLayout } from "@/components/layout/AppLayout";
import { OfflineBanner } from "@/components/layout/OfflineBanner";
import { Spinner } from "@/components/ui/States";
import { useEvaluateLessonGate } from "@/hooks/useEvaluateLessonGate";
import { useOnline } from "@/hooks/useOnline";
import { persistQueryCache } from "@/lib/persistQueryCache";
import { meQuery } from "@/lib/queries";
import { DashboardPage } from "@/pages/Dashboard";
import { GradesPage } from "@/pages/Grades";
import { HomeworkPage } from "@/pages/Homework";
import { LoginPage } from "@/pages/Login";
import { MarketPage } from "@/pages/Market";
import { MorePage } from "@/pages/More";
import { PaymentPage } from "@/pages/Payment";
import { ReviewsPage } from "@/pages/Reviews";
import { SchedulePage } from "@/pages/Schedule";
import { useAuthStore } from "@/store/auth";
import { isExpiredSession } from "@/utils/isExpiredSession";
import { resolveSession } from "@/utils/resolveSession";

function App() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const queryClient = useQueryClient();
  const online = useOnline();

  const me = useQuery(meQuery());
  const session = resolveSession(user, me, online);
  const evaluateGate = useEvaluateLessonGate(Boolean(session));

  useEffect(() => {
    if (me.data) {
      setUser(me.data);
    }
  }, [me.data, setUser]);

  useEffect(() => {
    if (!isExpiredSession(me.error, online)) {
      return;
    }

    setUser(null);
    queryClient.clear();
    void persistQueryCache(queryClient);
  }, [me.error, online, queryClient, setUser]);

  return (
    <>
      <OfflineBanner />
      {me.isPending && !session ? (
        <div className="grid min-h-full place-items-center">
          <Spinner label="Загрузка" />
        </div>
      ) : !session ? (
        <LoginPage />
      ) : evaluateGate.isLoading ? (
        <div className="grid min-h-full place-items-center">
          <Spinner label="Загрузка" />
        </div>
      ) : evaluateGate.shouldShow ? (
        <EvaluateLessonGate gate={evaluateGate} />
      ) : (
        <Routes>
          <Route element={<AppLayout />}>
            <Route index element={<DashboardPage />} />
            <Route path="grades" element={<GradesPage />} />
            <Route path="schedule" element={<SchedulePage />} />
            <Route path="homework" element={<HomeworkPage />} />
            <Route path="reviews" element={<ReviewsPage />} />
            <Route path="market" element={<MarketPage />} />
            <Route path="payment" element={<PaymentPage />} />
            <Route path="more" element={<MorePage />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      )}
    </>
  );
}

export default App;
