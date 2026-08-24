import { memo } from "react";
import { Select } from "@/components/ui/Controls";
import { useTheme } from "@/hooks/useTheme";
import { THEME_OPTIONS } from "@/lib/theme";
import { cn } from "@/lib/cn";

type ThemePickerProps = {
  label?: string;
  className?: string;
};

export const ThemePicker = memo(({ label, className }: ThemePickerProps) => {
  const { preference, setPreference } = useTheme();

  const control = (
    <Select
      options={THEME_OPTIONS}
      value={preference}
      onChange={setPreference}
      ariaLabel="Тема оформления"
      className={cn(!label && className)}
    />
  );

  if (!label) {
    return control;
  }

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <p className="text-sm font-medium text-ink-300">{label}</p>
      {control}
    </div>
  );
});

ThemePicker.displayName = "ThemePicker";
