import Link from "next/link";
import { requireSession } from "@/lib/auth/require-session";
import { logoutAction } from "@/server/actions/auth";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireSession();
  return (
    <div className="min-h-screen bg-paper-dim">
      <header className="border-b bg-ink text-paper">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-5 py-4">
          <Link className="font-serif text-xl" href="/dashboard">
            Enerji bələdçisi · Admin
          </Link>
          <nav className="flex items-center gap-5 text-sm text-paper/70">
            <Link href="/dashboard/lessons">Dərslər</Link>
            <Link href="/dashboard/news">Xəbərlər</Link>
            <Link href="/dashboard/reference-data">İstinadlar</Link>
            <form action={logoutAction}>
              <button>{session.username} · Çıxış</button>
            </form>
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-7xl px-5 py-10">{children}</main>
    </div>
  );
}
