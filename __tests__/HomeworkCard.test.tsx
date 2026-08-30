import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { HomeworkCard } from "@/components/homework/HomeworkCard";
import type { HomeworkItem } from "@/types";

type StudentSubmission = NonNullable<HomeworkItem["homework_stud"]>;

const homework = (
  submission: Partial<StudentSubmission> | null = null,
): HomeworkItem => ({
  id: 1,
  id_spec: 10,
  id_teach: 20,
  id_group: 30,
  fio_teach: "Андреев Андрей Андреевич",
  theme: "JS JQuery",
  completion_time: "2026-05-02 23:59:59",
  creation_time: "2026-01-10 12:00:00",
  overdue_time: "2026-05-09 23:59:59",
  filename: "task.pdf",
  file_path: "https://cdn.example/task.pdf",
  comment: "Сделайте слайдер на jQuery",
  name_spec: "Язык сценариев JavaScript",
  status: 1,
  common_status: 1,
  cover_image: null,
  homework_stud: submission
    ? {
        id: 100,
        filename: null,
        file_path: "",
        tmp_file: null,
        mark: 5,
        creation_time: "2026-04-20 12:00:00",
        stud_answer: null,
        auto_mark: false,
        ...submission,
      }
    : null,
  homework_comment: null,
});

describe("HomeworkCard", () => {
  it("opens a dialog with the comment when the work was submitted as text", async () => {
    const user = userEvent.setup();
    const answer = "Готово: https://codesandbox.io/p/sandbox/slider";

    render(
      <HomeworkCard item={homework({ file_path: "", stud_answer: answer })} />,
    );

    await user.click(screen.getByRole("button", { name: "Моя работа" }));

    expect(screen.getByRole("dialog", { name: "Моя работа" })).toHaveTextContent(
      answer,
    );
  });

  it("keeps a file submission as an external link", () => {
    const fileUrl = "https://cdn.example/my-work.zip";

    render(
      <HomeworkCard
        item={homework({ filename: "my-work.zip", file_path: fileUrl })}
      />,
    );

    expect(screen.getByRole("link", { name: "Моя работа" })).toHaveAttribute(
      "href",
      fileUrl,
    );
    expect(screen.queryByRole("button", { name: "Моя работа" })).toBeNull();
  });

  it("hides my work when nothing was submitted", () => {
    render(<HomeworkCard item={homework(null)} />);

    expect(screen.queryByRole("link", { name: "Моя работа" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Моя работа" })).toBeNull();
  });
});
