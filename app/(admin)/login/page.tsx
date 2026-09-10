import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  return (
    <main className="grid min-h-screen place-items-center px-5">
      <section className="w-full max-w-md border bg-paper-dim p-8">
        <p className="text-sm uppercase tracking-[0.2em] text-copper">
          İdarəetmə
        </p>
        <h1 className="mt-4 font-serif text-4xl">Admin girişi</h1>
        <p className="mb-8 mt-3 leading-7 text-ink-soft">
          Məzmun və istinad məlumatlarını idarə etmək üçün daxil olun.
        </p>
        <LoginForm />
      </section>
    </main>
  );
}
