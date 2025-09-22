import { LoginForm } from "@/components/app/LoginForm";

export default function LoginStudent(){
  return (
    <div className="container py-6">
      <h1 className="sr-only">Student Login</h1>
      <LoginForm
        role="Student"
        expectedId="student@edu.in"
        expectedPassword="student123"
        onSuccess={(id) => { localStorage.setItem("app.role","student"); localStorage.setItem("app.id", id); window.location.href = "/panel/student"; }}
      />
    </div>
  );
}
