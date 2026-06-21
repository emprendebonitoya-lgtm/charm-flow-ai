import { PLAN_FEATURES } from "@/lib/plans";
import { Check, X } from "lucide-react";

export function PlanComparison() {
  return (
    <div className="overflow-hidden rounded-3xl border border-white/10">
      <div className="grid grid-cols-[1.4fr_1fr_1fr] gap-0 bg-white/5 text-[10px] uppercase tracking-[0.24em] text-[#D8B4FE]/80">
        <div className="p-4">Función</div>
        <div className="p-4 text-center border-l border-white/10">Gratis</div>
        <div className="p-4 text-center border-l border-white/10 text-fuchsia-200">Premium</div>
      </div>
      {PLAN_FEATURES.map((feature) => (
        <div
          key={feature.id}
          className="grid grid-cols-[1.4fr_1fr_1fr] gap-0 border-t border-white/10 text-sm"
        >
          <div className="p-4 font-medium text-white">{feature.name}</div>
          <div className="p-4 border-l border-white/10 text-[#E0E7FF]/75 leading-relaxed">
            <span className="inline-flex items-start gap-2">
              {feature.freeOk ? (
                <Check className="h-4 w-4 shrink-0 text-emerald-400 mt-0.5" />
              ) : (
                <X className="h-4 w-4 shrink-0 text-rose-400 mt-0.5" />
              )}
              {feature.free}
            </span>
          </div>
          <div className="p-4 border-l border-white/10 text-[#E0E7FF]/90 leading-relaxed bg-fuchsia-500/5">
            <span className="inline-flex items-start gap-2">
              <Check className="h-4 w-4 shrink-0 text-fuchsia-300 mt-0.5" />
              {feature.premium}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
