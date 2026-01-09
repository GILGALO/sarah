import { Link } from "wouter";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-background text-foreground p-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="flex justify-center">
          <AlertTriangle className="h-24 w-24 text-destructive opacity-80" />
        </div>
        
        <h1 className="text-5xl font-display font-bold tracking-tight text-destructive">404</h1>
        <h2 className="text-xl font-mono text-muted-foreground">SIGNAL LOST // PAGE NOT FOUND</h2>
        
        <p className="text-muted-foreground">
          The requested resource could not be located in the current session.
        </p>

        <Link href="/" className="inline-flex items-center justify-center rounded-lg bg-primary px-8 py-3 text-sm font-bold text-primary-foreground shadow-[0_0_20px_rgba(var(--primary),0.3)] hover:bg-primary/90 transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(var(--primary),0.5)]">
          RETURN TO DASHBOARD
        </Link>
      </div>
    </div>
  );
}
