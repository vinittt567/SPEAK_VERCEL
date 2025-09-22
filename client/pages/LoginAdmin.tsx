import { LoginForm } from "@/components/app/LoginForm";

export default function LoginAdmin(){
  return (
    <div className="container py-6">
      <h1 className="sr-only">Admin Login</h1>
      <LoginForm
        role="Admin"
        expectedId="admin@edu.in"
        expectedPassword="admin123"
        onSuccess={() => { window.location.href = "/panel/admin"; }}
      />
    </div>
  );
}
