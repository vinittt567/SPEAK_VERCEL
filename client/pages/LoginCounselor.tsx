import { LoginForm } from "@/components/app/LoginForm";

export default function LoginCounselor(){
  return (
    <div className="container py-6">
      <h1 className="sr-only">Counselor Login</h1>
      <LoginForm
        role="Counselor"
        expectedId="counselor@edu.in"
        expectedPassword="counselor123"
        onSuccess={(id) => { localStorage.setItem("app.role","counselor"); localStorage.setItem("app.id", id); window.location.href = "/panel/counselor"; }}
      />
    </div>
  );
}
