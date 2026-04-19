import { ReferralForm } from "../components/ReferralForm";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl items-center px-6 py-16">
      <section className="grid w-full gap-10 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-6">
          <p className="inline-flex rounded-full border border-teal-800/15 bg-white/70 px-4 py-2 text-sm font-medium text-teal-900 shadow-sm backdrop-blur">
            End-to-end typed referral intake
          </p>
          <div className="space-y-4">
            <h1 className="max-w-2xl text-5xl font-semibold tracking-tight text-slate-950">
              Capture referral details once and validate them everywhere.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-700">
              This starter uses shared Zod schemas, a typed tRPC client, and Drizzle-backed
              persistence so the browser, API, and database stay aligned.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/70 bg-white/70 p-5 shadow-lg shadow-slate-200/60 backdrop-blur">
              <p className="text-sm font-medium text-slate-500">Validation</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">Shared Zod</p>
            </div>
            <div className="rounded-3xl border border-white/70 bg-white/70 p-5 shadow-lg shadow-slate-200/60 backdrop-blur">
              <p className="text-sm font-medium text-slate-500">API layer</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">tRPC</p>
            </div>
            <div className="rounded-3xl border border-white/70 bg-white/70 p-5 shadow-lg shadow-slate-200/60 backdrop-blur">
              <p className="text-sm font-medium text-slate-500">Persistence</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">Drizzle + Postgres</p>
            </div>
          </div>
        </div>

        <div className="rounded-[2rem] border border-white/80 bg-[var(--panel)] p-6 shadow-2xl shadow-slate-300/50 backdrop-blur lg:p-8">
          <ReferralForm />
        </div>
      </section>
    </main>
  );
}

