import Link from "next/link";

export default function DashboardPage() {
  const areas = [
    {
      href: "/dashboard/lessons",
      title: "Dərslər",
      text: "Dərsləri yaradın, redaktə edin və nəşr vəziyyətini idarə edin.",
    },
    {
      href: "/dashboard/news",
      title: "Xəbərlər",
      text: "Xəbərləri yaradın, redaktə edin və yayımlayın.",
    },
    {
      href: "/dashboard/reference-data",
      title: "İstinad məlumatları",
      text: "Region, panel, batareya və dam əmsallarını idarə edin.",
    },
  ];
  return (
    <>
      <h1 className="font-serif text-5xl">İdarəetmə paneli</h1>
      <div className="mt-10 grid gap-5 md:grid-cols-3">
        {areas.map((area) => (
          <Link
            className="border bg-paper p-6"
            href={area.href}
            key={area.href}
          >
            <h2 className="font-serif text-2xl">{area.title}</h2>
            <p className="mt-3 leading-7 text-ink-soft">{area.text}</p>
          </Link>
        ))}
      </div>
    </>
  );
}
