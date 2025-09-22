import { LoginForm } from "@/components/app/LoginForm";

export default function LoginInstitute(){
  return (
    <div className="container py-6">
      <h1 className="sr-only">Institute Login</h1>
      <LoginForm
        role="Institute"
        expectedId="institute@edu.in"
        expectedPassword="institute123"
        onSuccess={(id) => { localStorage.setItem("app.role","institute"); localStorage.setItem("app.id", id); window.location.href = "/panel/institute"; }}
      />
    </div>
  );
}
