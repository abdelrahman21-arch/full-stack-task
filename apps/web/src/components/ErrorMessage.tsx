import type { AppError } from "@repo/types";

type ErrorMessageProps = {
  error: AppError;
};

export function ErrorMessage({ error }: ErrorMessageProps) {
  return (
    <div className="rounded-3xl border border-red-200 bg-[var(--danger-soft)] p-4 text-sm text-[var(--danger)]">
      <p className="font-semibold">
        {error.code}: {error.message}
      </p>
      {error.issues && error.issues.length > 0 ? (
        <ul className="mt-3 list-disc space-y-1 pl-5">
          {error.issues.map((issue) => (
            <li key={`${issue.path}-${issue.message}`}>
              {issue.path || "form"}: {issue.message}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

