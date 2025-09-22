import { LoginForm } from "@/components/app/LoginForm";

export default function LoginAdmin(){
  return (
    <div className="container py-6">
      <h1 className="sr-only">Admin Login</h1>
      <LoginForm
        role="Admin"
        expectedId="admin@edu.in"
        expectedPassword="admin123"
        onSuccess={(id) => { localStorage.setItem("app.role","admin"); localStorage.setItem("app.id", id); window.location.href = "/admin"; }}
      />
    </div>
  );
}
