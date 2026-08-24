import { DashboardStats } from "@/components/dashboard/DashboardStats";
import { FutureExams } from "@/components/dashboard/FutureExams";
import { Leaderboard } from "@/components/dashboard/Leaderboard";
import { ProgressChart } from "@/components/dashboard/ProgressChart";
import { RecentActivity } from "@/components/dashboard/RecentActivity";
import { WorkTypeBars } from "@/components/dashboard/WorkTypeBars";
import { useAuthStore } from "@/store/auth";

export const DashboardPage = () => {
  const user = useAuthStore((state) => state.user);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-heading">
          {user
            ? `Привет, ${user.full_name.split(" ")[1] ?? user.full_name}`
            : "Главная"}
        </h1>
        <p className="mt-1 text-sm text-ink-400">
          {user ? `${user.group_name} · ${user.stream_name}` : null}
        </p>
      </div>

      <DashboardStats />

      <FutureExams />

      <div className="grid gap-6 lg:grid-cols-2">
        <ProgressChart kind="average-progress" />
        <ProgressChart kind="attendance" />
      </div>

      <div className="grid gap-6 lg:grid-cols-2 lg:items-stretch">
        <div className="flex flex-col gap-6">
          <WorkTypeBars />
          <Leaderboard />
        </div>
        <RecentActivity />
      </div>
    </div>
  );
};
