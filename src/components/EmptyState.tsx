import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="neon-card rounded-2xl p-8 text-center">
      <div className="h-16 w-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
        <Icon className="h-8 w-8 text-fuchsia-400" />
      </div>
      <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
      <p className="text-sm text-white/60 mb-6 max-w-sm mx-auto">{description}</p>
      {action && (
        <button onClick={action.onClick} className="btn-cyber px-6 py-2.5">
          {action.label}
        </button>
      )}
    </div>
  );
}
