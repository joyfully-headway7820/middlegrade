import { useQuery } from "@tanstack/react-query";
import { FutureExamRow } from "./FutureExamRow";
import { Card, CardHeader } from "@/components/ui/Card";
import { futureExamsQuery } from "@/lib/queries";
import { pluralRu } from "@/utils/pluralRu";

export const FutureExams = () => {
  const exams = useQuery(futureExamsQuery());
  const items = exams.data ?? [];

  if (items.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader
        title="Назначенные экзамены"
        description={`${items.length} ${pluralRu(items.length, ["экзамен", "экзамена", "экзаменов"])}`}
      />
      <ul className="flex flex-col">
        {items.map((exam, index) => (
          <FutureExamRow
            key={`${exam.spec}-${exam.date ?? "date"}-${index}`}
            exam={exam}
          />
        ))}
      </ul>
    </Card>
  );
};
