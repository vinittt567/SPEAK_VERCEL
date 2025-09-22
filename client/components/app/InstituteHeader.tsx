import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/app/ThemeToggle";

export function InstituteHeader() {
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <a href="/panel/institute" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-primary/10 grid place-items-center text-primary font-bold">
              🏫
            </div>
            <span className="font-semibold tracking-tight">
              Institution Panel
            </span>
          </a>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            className="rounded-full"
            onClick={() => {
              localStorage.removeItem("app.role");
              window.location.href = "/";
            }}
          >
            Sign out
          </Button>
        </div>
      </div>
    </header>
  );
}
