import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { useUser } from "@/lib/user";
import { useState } from "react";
import { Loader2, LogIn, Mail } from "lucide-react";
import { toast } from "sonner";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Entrar · MAGNETO" },
      { name: "description", content: "Creá tu cuenta MAGNETO o entrá con Google para guardar tu progreso." },
    ],
  }),
  component: LoginPage,
});

function LoginPage() {
  const {
    authUser,
    authLoading,
    authConfigured,
    signInWithEmail,
    signUpWithEmail,
    signInWithGoogle,
    signOut,
  } = useUser();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || password.length < 6) {
      toast.error("Email válido y contraseña de al menos 6 caracteres.");
      return;
    }
    setLoading(true);
    try {
      if (mode === "login") {
        await signInWithEmail(email.trim(), password);
        toast.success("Sesión iniciada.");
      } else {
        await signUpWithEmail(email.trim(), password);
        toast.success("Cuenta creada. Revisá tu email si pide confirmación.");
      }
      navigate({ to: "/" });
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "No se pudo completar");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setLoading(true);
    try {
      await signInWithGoogle();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Google no disponible");
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <AppShell title="Entrar" subtitle="Cargando sesión…">
        <div className="flex justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-fuchsia-400" />
        </div>
      </AppShell>
    );
  }

  if (authUser) {
    return (
      <AppShell title="Tu cuenta" subtitle="Sesión activa en MAGNETO.">
        <div className="neon-card rounded-3xl p-6 max-w-md mx-auto space-y-4">
          <p className="text-sm text-[#E0E7FF]/80">
            Conectado como <span className="text-white font-medium">{authUser.email}</span>
          </p>
          <p className="text-xs text-muted-foreground">
            Tu progreso se guarda en este dispositivo. Con cuenta podés recuperar datos cuando activemos sync en la nube.
          </p>
          <div className="flex flex-wrap gap-3">
            <Link to="/" className="btn-cyber">Ir al inicio</Link>
            <button
              onClick={async () => {
                await signOut();
                toast.info("Sesión cerrada.");
              }}
              className="btn-ghost"
            >
              Cerrar sesión
            </button>
          </div>
        </div>
      </AppShell>
    );
  }

  return (
    <AppShell
      title="Entrar a MAGNETO"
      subtitle="Opcional: creá cuenta para guardar progreso. La app funciona gratis sin registrarte."
    >
      <div className="max-w-md mx-auto space-y-6">
        {!authConfigured && (
          <div className="rounded-2xl border border-amber-400/30 bg-amber-400/10 p-4 text-sm text-amber-100/90">
            Cuentas aún no configuradas en el servidor. Podés usar MAGNETO en modo invitado.
            Agregá <code className="text-xs">VITE_SUPABASE_URL</code> y{" "}
            <code className="text-xs">VITE_SUPABASE_ANON_KEY</code> en tu archivo <code className="text-xs">.env</code>.
          </div>
        )}

        <div className="neon-card rounded-3xl p-6 space-y-5">
          <div className="flex gap-2 rounded-full bg-white/5 p-1">
            <button
              type="button"
              onClick={() => setMode("login")}
              className={`flex-1 rounded-full py-2 text-sm ${mode === "login" ? "bg-white/10 text-white" : "text-muted-foreground"}`}
            >
              Entrar
            </button>
            <button
              type="button"
              onClick={() => setMode("signup")}
              className={`flex-1 rounded-full py-2 text-sm ${mode === "signup" ? "bg-white/10 text-white" : "text-muted-foreground"}`}
            >
              Crear cuenta
            </button>
          </div>

          <form onSubmit={handleEmail} className="space-y-4">
            <label className="block space-y-2">
              <span className="text-xs uppercase tracking-[0.24em] text-[#D8B4FE]/70">Email</span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-fuchsia-400/50"
                placeholder="tu@email.com"
                disabled={!authConfigured || loading}
              />
            </label>
            <label className="block space-y-2">
              <span className="text-xs uppercase tracking-[0.24em] text-[#D8B4FE]/70">Contraseña</span>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm outline-none focus:border-fuchsia-400/50"
                placeholder="Mínimo 6 caracteres"
                disabled={!authConfigured || loading}
              />
            </label>
            <button
              type="submit"
              disabled={!authConfigured || loading}
              className="btn-cyber w-full inline-flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mail className="h-4 w-4" />}
              {mode === "login" ? "Entrar con email" : "Crear cuenta"}
            </button>
          </form>

          <div className="relative text-center text-xs text-muted-foreground">
            <span className="bg-[rgba(10,16,42,0.9)] px-3 relative z-10">o</span>
            <div className="absolute inset-x-0 top-1/2 border-t border-white/10" />
          </div>

          <button
            type="button"
            onClick={handleGoogle}
            disabled={!authConfigured || loading}
            className="btn-ghost w-full inline-flex items-center justify-center gap-2 border border-white/10"
          >
            <LogIn className="h-4 w-4" />
            Continuar con Google
          </button>
        </div>

        <div className="text-center">
          <Link to="/" className="text-sm text-muted-foreground hover:text-white transition">
            Seguir sin cuenta →
          </Link>
        </div>
      </div>
    </AppShell>
  );
}
