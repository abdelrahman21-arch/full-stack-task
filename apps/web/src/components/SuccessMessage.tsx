type SuccessMessageProps = {
  referralId: string;
};

export function SuccessMessage({ referralId }: SuccessMessageProps) {
  return (
    <div className="rounded-3xl border border-green-200 bg-[var(--success-soft)] p-4 text-sm text-[var(--success)]">
      <p className="font-semibold">Referral submitted successfully.</p>
      <p className="mt-1 break-all">Reference ID: {referralId}</p>
    </div>
  );
}

