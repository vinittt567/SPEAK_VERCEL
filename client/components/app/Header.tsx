import { Lock, Bot, LogOut, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import { ThemeToggle } from "@/components/app/ThemeToggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const nav = [
  { to: "/", label: "Home" },
  { to: "/chat", label: "Chatbot" },
  { to: "/booking", label: "Booking" },
  { to: "/resources", label: "Resources" },
  { to: "/forum", label: "Forum" },
];

export function Header() {
  const path = typeof window !== "undefined" ? window.location.pathname : "/";
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    try {
      console.log('Logout button clicked, starting logout process...');
      await logout();
      console.log('Logout completed, redirecting to login...');
      window.location.href = '/login';
    } catch (error) {
      console.error('Logout failed:', error);
      // Still redirect even if logout API fails
      window.location.href = '/login';
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between gap-3">
        <a href="/" className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-xl bg-primary/10 grid place-items-center text-primary font-bold">🌿</div>
          <span className="font-semibold tracking-tight">SPEAK</span>
        </a>
        <nav className="hidden md:flex items-center gap-1 rounded-full bg-muted px-1 py-1">
          {nav.map((i) => (
            <a
              key={i.to}
              href={i.to}
              className={cn(
                "px-3 py-1.5 text-sm rounded-full transition-colors",
                path === i.to ? "bg-background shadow-sm" : "text-muted-foreground hover:text-foreground"
              )}
              aria-current={path === i.to ? "page" : undefined}
            >
              {i.label}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <div className="hidden sm:flex items-center text-xs text-muted-foreground gap-1">
                <Lock className="h-4 w-4" />
                <span>Anonymous ID: {user.anonymousId.slice(0, 12)}...</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="rounded-full">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem disabled>
                    <div className="flex flex-col">
                      <span className="font-medium">Course: {user.profileData.course}</span>
                      <span className="text-xs text-muted-foreground">Year: {user.profileData.year}</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <div className="hidden sm:flex items-center text-xs text-muted-foreground gap-1">
                <Lock className="h-4 w-4" />
                <span>Not authenticated</span>
              </div>
              <Button asChild variant="outline" size="sm" className="rounded-full">
                <a href="/login">Login</a>
              </Button>
            </>
          )}
          {path !== "/chat" && (
            <Button asChild className="rounded-full">
              <a href="/chat" className="flex items-center gap-2">
                <Bot className="h-4 w-4" />
                Talk now
              </a>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
