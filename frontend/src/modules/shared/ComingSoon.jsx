export default function ComingSoon({
  title,
  icon,
  tagline,
  buildWeek,
  inputs = [],
  output,
  slackChannel,
  endpoint,
}) {
  return (
    <div className="mx-auto max-w-2xl">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">
          {icon} {title}
        </h1>
        <p className="mt-2 text-slate-600">{tagline}</p>
      </header>

      <section className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200">
        <div className="inline-flex items-center gap-2 rounded-full bg-amber-50 border border-amber-200 px-3 py-1 text-xs font-medium text-amber-800">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-500" />
          Scheduled for {buildWeek}
        </div>

        <dl className="mt-6 space-y-4 text-sm">
          {inputs.length > 0 && (
            <div>
              <dt className="font-medium text-slate-900">Inputs</dt>
              <dd className="mt-1 text-slate-600">
                {inputs.map((i) => (
                  <code
                    key={i}
                    className="mr-1.5 inline-block rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-800"
                  >
                    {i}
                  </code>
                ))}
              </dd>
            </div>
          )}

          {output && (
            <div>
              <dt className="font-medium text-slate-900">Output</dt>
              <dd className="mt-1 text-slate-600">{output}</dd>
            </div>
          )}

          {slackChannel && (
            <div>
              <dt className="font-medium text-slate-900">Slack channel</dt>
              <dd className="mt-1 text-slate-600">
                <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-800">
                  {slackChannel}
                </code>
              </dd>
            </div>
          )}

          {endpoint && (
            <div>
              <dt className="font-medium text-slate-900">API endpoint</dt>
              <dd className="mt-1 text-slate-600">
                <code className="rounded bg-slate-100 px-1.5 py-0.5 text-xs text-slate-800">
                  {endpoint}
                </code>
              </dd>
            </div>
          )}
        </dl>

        <p className="mt-6 text-xs text-slate-500">
          The backend route is wired and currently returns <code>501 Not Implemented</code>.
          Replace the stub in <code>backend/routers/</code> and the form here when you build
          this module.
        </p>
      </section>
    </div>
  )
}
