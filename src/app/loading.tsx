export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6 text-center">
      <div className="flex items-center gap-3 mb-4">
        <span className="text-3xl animate-bounce">🛸</span>
        <h1 className="text-2xl font-bold text-slate-800">Namka Control</h1>
      </div>
      <div className="flex flex-col gap-2 max-w-xs w-full">
        <div className="h-4 bg-slate-200 rounded animate-pulse w-3/4 mx-auto"></div>
        <div className="h-4 bg-slate-200 rounded animate-pulse w-1/2 mx-auto"></div>
      </div>
      <p className="mt-8 text-sm text-slate-400">Fetching Project Master...</p>
    </div>
  );
}
