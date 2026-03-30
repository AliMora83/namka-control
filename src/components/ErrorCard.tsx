interface ErrorCardProps {
  title: string
  message: string
  detail?: string
}

export function ErrorCard({ title, message, detail }: ErrorCardProps) {
  return (
    <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm">
      <p className="font-semibold text-red-700">{title}</p>
      <p className="mt-1 text-red-600">{message}</p>
      {detail && (
        <p className="mt-2 font-mono text-xs text-red-400">{detail}</p>
      )}
    </div>
  )
}
