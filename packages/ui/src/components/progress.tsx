import "./progress.css";

interface ProgressProps {
  /** From 0 to 1. */
  value: number;
  label: string;
}

export const Progress = ({ value, label }: ProgressProps) => (
  <progress
    aria-label={label}
    className="tp-progress"
    max={1}
    value={Math.min(Math.max(value, 0), 1)}
  />
);
