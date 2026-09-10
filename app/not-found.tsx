import Link from "next/link";

export default function NotFound() {
  return (
    <main className="grid min-h-screen place-items-center bg-paper px-5 text-center">
      <div>
        <p className="font-serif text-8xl text-amber">404</p>
        <h1 className="mt-4 font-serif text-4xl">Səhifə tapılmadı</h1>
        <Link className="mt-8 inline-block border-b" href="/">
          Başlanğıca qayıt
        </Link>
      </div>
    </main>
  );
}
