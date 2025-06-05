import { ChevronDown, ChevronUp } from "lucide-react";

interface IntervalSelectProps {
  value: number;
  onChange: (value: number) => void;
}

export function IntervalSelect({
  value,
  onChange,
}: IntervalSelectProps): React.JSX.Element {
  const handleIntervalChange = (direction: "up" | "down"): void => {
    if (direction === "up") {
      onChange(value + 1);
    } else if (direction === "down" && value > 10) {
      onChange(value - 1);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <div className="relative">
        <div className="bg-background-input rounded-md px-2 py-2 space-x-3 flex justify-between items-center w-fit cursor-pointer">
          <span className="text-primary text-base w-5 text-center">
            {value}
          </span>
          <div className="flex flex-col text-primary">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleIntervalChange("up");
              }}
              className="h-3 flex items-center hover:text-primary/80 transition-colors"
            >
              <ChevronUp size={16} />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                handleIntervalChange("down");
              }}
              className="h-3 flex items-center hover:text-primary/80 transition-colors"
            >
              <ChevronDown size={16} />
            </button>
          </div>
        </div>
      </div>
      <span className="text-tertiary text-sm">Minutos</span>
    </div>
  );
}
