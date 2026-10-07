import { NativeSelect } from "@/components/forms/native-select";
import { PERIODS } from "@/config/periods";

export const periodLabel = (value: string) =>
  PERIODS.find((item) => item.value === value)?.label ?? value;

/** A selector when the backend offers several periods, otherwise a plain label. */
export function PeriodControl({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  if (PERIODS.length > 1) {
    return (
      <div className="mb-6 max-w-xs">
        <NativeSelect
          label="Period"
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {PERIODS.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </NativeSelect>
      </div>
    );
  }
  return (
    <p className="mb-6 text-sm text-muted-foreground">
      Showing: {periodLabel(value)}
    </p>
  );
}
