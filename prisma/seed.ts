import "dotenv/config";
import postgres from "@prisma/orm-postgres/runtime";
import type { Contract, FieldOutputTypes } from "@/prisma/contract.d";
import contractJson from "@/prisma/contract.json" with { type: "json" };

const db = postgres<Contract>({
  contractJson,
  url: process.env.DATABASE_URL,
});

const orm = db.orm.public;
const publishedAt = new Date().toISOString() as NonNullable<
  FieldOutputTypes["public"]["News"]["publishedAt"]
>;

const lessons = [
  [
    "pv",
    "Fotovoltaik enerji nədir?",
    "Günəş işığının elektrikə çevrilməsinin əsasları.",
  ],
  [
    "system",
    "PV sistemi necə işləyir?",
    "Enerjinin paneldən evə qədər keçdiyi yol.",
  ],
  [
    "panel",
    "Günəş paneli seçimi",
    "Güc, səmərəlilik, zəmanət və temperatur əmsalı.",
  ],
  [
    "inverter",
    "İnverter və nəzarət",
    "Sistemin elektrik keyfiyyətini idarə edən qurğular.",
  ],
  [
    "battery",
    "Batareya sistemləri",
    "Ehtiyat enerji, boşalma dərinliyi və dövr sayı.",
  ],
  ["roof", "Dam və yerləşdirmə", "İstiqamət, kölgə, bucaq və faydalı sahə."],
  [
    "sizing",
    "Sistemin ölçüləndirilməsi",
    "İstehlakdan tələb olunan gücə gedən hesablama.",
  ],
  [
    "economics",
    "İqtisadi səmərəlilik",
    "Xərc, qənaət və geriödəmə müddətinin təhlili.",
  ],
  [
    "safety",
    "Təhlükəsizlik və qulluq",
    "Qoruma, monitorinq və uzunmüddətli istismar.",
  ],
] as const;

async function main() {
  for (const [index, [slug, title, intro]] of lessons.entries()) {
    const existing = await orm.Lesson.where({ slug }).first();
    if (existing) {
      await orm.Lesson.where({ id: existing.id }).update({
        number: index + 1,
        title,
        intro,
      });
    } else {
      await orm.Lesson.create({
        slug,
        number: index + 1,
        category: "lesson",
        title,
        intro,
        published: true,
        contentJson: {
          type: "doc",
          content: [
            { type: "paragraph", content: [{ type: "text", text: intro }] },
          ],
        },
      });
    }
  }

  const newsSlug = "azerbaycanda-gunes-enerjisi";
  const existingNews = await orm.News.where({ slug: newsSlug }).first();
  if (!existingNews) {
    await orm.News.create({
      slug: newsSlug,
      title: "Azərbaycanda günəş enerjisinə giriş",
      excerpt:
        "Günəş enerjisinin yerli imkanları və gündəlik istifadəsi haqqında qısa icmal.",
      published: true,
      publishedAt,
      contentJson: {
        type: "doc",
        content: [
          {
            type: "paragraph",
            content: [
              {
                type: "text",
                text: "Günəş enerjisi ev və bizneslər üçün elektrik istehsalını daha əlçatan edir. Bu bölmədə yeni layihələr, texnologiyalar və praktik məlumatlar paylaşılacaq.",
              },
            ],
          },
        ],
      },
    });
  }

  const regions = [
    ["Bakı/Abşeron", 4.5],
    ["Naxçıvan", 5.2],
    ["Gəncə", 4.4],
    ["Şəki-Zaqatala", 3.9],
    ["Lənkəran", 3.7],
  ] as const;
  for (const [name, peakSunHours] of regions) {
    const existing = await orm.Region.where({ name }).first();
    if (existing)
      await orm.Region.where({ id: existing.id }).update({ peakSunHours });
    else await orm.Region.create({ name, peakSunHours });
  }

  for (const watts of [400, 450, 550]) {
    const existing = await orm.PanelSpec.where({ watts }).first();
    if (!existing) await orm.PanelSpec.create({ watts });
  }

  for (const item of [
    { name: "Lead-acid", dod: 0.5 },
    { name: "LiFePO4", dod: 0.85 },
  ]) {
    const existing = await orm.BatteryType.where({ name: item.name }).first();
    if (existing)
      await orm.BatteryType.where({ id: existing.id }).update({
        dod: item.dod,
      });
    else await orm.BatteryType.create(item);
  }

  for (const item of [
    { name: "Cənub", factor: 1 },
    { name: "Şərq", factor: 0.9 },
    { name: "Qərb", factor: 0.9 },
    { name: "Şimal", factor: 0.7 },
  ]) {
    const existing = await orm.RoofOrientation.where({
      name: item.name,
    }).first();
    if (existing)
      await orm.RoofOrientation.where({ id: existing.id }).update({
        factor: item.factor,
      });
    else await orm.RoofOrientation.create(item);
  }

  await orm.Resource.where((resource) => resource.id.isNotNull()).deleteAll();
  await orm.Resource.createAll([
    {
      category: "az",
      title: "Energetika Nazirliyi",
      source: "minenergy.gov.az",
      url: "https://minenergy.gov.az/",
      position: 1,
    },
    {
      category: "world",
      title: "Beynəlxalq Bərpa Olunan Enerji Agentliyi",
      source: "irena.org",
      url: "https://www.irena.org/",
      position: 1,
    },
    {
      category: "tech",
      title: "PV sistemləri üzrə NREL araşdırmaları",
      source: "nrel.gov",
      url: "https://www.nrel.gov/solar/",
      position: 1,
    },
    {
      category: "market",
      title: "Günəş enerjisi bazar icmalları",
      source: "iea.org",
      url: "https://www.iea.org/energy-system/renewables/solar-pv",
      position: 1,
    },
  ]);
}

async function run() {
  await db.connect();
  try {
    await main();
  } finally {
    await db.close();
  }
}

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
