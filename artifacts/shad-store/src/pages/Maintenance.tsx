import { RefreshCw } from "lucide-react"

export default function MaintenancePage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ background: 'var(--shad-bg-color)', direction: 'rtl' }}>
      <div className="max-w-2xl w-full text-center space-y-8">
        <div className="space-y-4">
          <h1 className="text-5xl font-bold" style={{ color: 'var(--shad-brand)' }}>
            الصفحة تحت الصيانة
          </h1>
          <p className="text-xl text-white/60">
            نعتذر عن الإزعاج، نحن نعمل حالياً على تحسين وتحديث المتجر لنقدم لكم تجربة أفضل.
          </p>
          <p className="text-lg text-white/40">
            يرجى العودة لاحقاً، شكراً لصبركم.
          </p>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-center gap-4">
            <RefreshCw className="h-20 w-20 animate-spin" style={{ color: 'var(--shad-brand)' }} />
          </div>
          <p className="text-white/60">جاري تحديث المتجر...</p>
        </div>
      </div>
    </div>
  )
}