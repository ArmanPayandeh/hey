import { memo, type ReactNode } from "react";
import cn from "@/helpers/cn";
import { H6 } from "./Typography";

interface WarningMessageProps {
  className?: string;
  message?: ReactNode;
  title?: string;
}

const WarningMessage = ({
  className = "",
  message,
  title
}: WarningMessageProps) => {
  if (!message) {
    return null;
  }

  return (
    <div
      className={cn(
        "space-y-1 rounded-xl border-2 border-yellow-500/50 bg-yellow-50 p-4 text-yellow-800 dark:bg-yellow-900/10 dark:text-yellow-200",
        className
      )}
    >
      {title ? <H6>{title}</H6> : null}
      <div className="text-sm">{message}</div>
    </div>
  );
};

export default memo(WarningMessage);
