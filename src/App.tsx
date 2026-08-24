import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router";
import { AppLayout } from "@/components/layout/AppLayout";
import { Spinner } from "@/components/ui/States";
import { meQuery } from "@/lib/queries";
import { DashboardPage } from "@/pages/Dashboard";
import { GradesPage } from "@/pages/Grades";
import { HomeworkPage } from "@/pages/Homework";
import { LoginPage } from "@/pages/Login";
import { MarketPage } from "@/pages/Market";
import { PaymentPage } from "@/pages/Payment";
import { ReviewsPage } from "@/pages/Reviews";
import { SchedulePage } from "@/pages/Schedule";
import { useAuthStore } from "@/store/auth";

function App() {
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);

  const me = useQuery(meQuery());

  useEffect(() => {
    if (me.data) {
      setUser(me.data);
    }
  }, [me.data, setUser]);

  if (me.isPending) {
    return (
      <div className="grid min-h-full place-items-center">
        <Spinner label="Загрузка" />
      </div>
    );
  }

  if (!user) return <LoginPage />;

  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="grades" element={<GradesPage />} />
        <Route path="schedule" element={<SchedulePage />} />
        <Route path="homework" element={<HomeworkPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
        <Route path="market" element={<MarketPage />} />
        <Route path="payment" element={<PaymentPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default App;
