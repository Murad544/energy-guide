import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
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
    await prisma.lesson.upsert({
      where: { slug },
      update: { number: index + 1, title, intro },
      create: {
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
      },
    });
  }
  await prisma.news.upsert({
    where: { slug: "azerbaycanda-gunes-enerjisi" },
    update: {},
    create: {
      slug: "azerbaycanda-gunes-enerjisi",
      title: "Azərbaycanda günəş enerjisinə giriş",
      excerpt:
        "Günəş enerjisinin yerli imkanları və gündəlik istifadəsi haqqında qısa icmal.",
      published: true,
      publishedAt: new Date(),
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
    },
  });
  const regions = [
    ["Bakı/Abşeron", 4.5],
    ["Naxçıvan", 5.2],
    ["Gəncə", 4.4],
    ["Şəki-Zaqatala", 3.9],
    ["Lənkəran", 3.7],
  ] as const;
  for (const [name, peakSunHours] of regions)
    await prisma.region.upsert({
      where: { name },
      update: { peakSunHours },
      create: { name, peakSunHours },
    });
  for (const watts of [400, 450, 550])
    await prisma.panelSpec.upsert({
      where: { watts },
      update: {},
      create: { watts },
    });
  for (const item of [
    { name: "Lead-acid", dod: 0.5 },
    { name: "LiFePO4", dod: 0.85 },
  ])
    await prisma.batteryType.upsert({
      where: { name: item.name },
      update: { dod: item.dod },
      create: item,
    });
  for (const item of [
    { name: "Cənub", factor: 1 },
    { name: "Şərq", factor: 0.9 },
    { name: "Qərb", factor: 0.9 },
    { name: "Şimal", factor: 0.7 },
  ])
    await prisma.roofOrientation.upsert({
      where: { name: item.name },
      update: { factor: item.factor },
      create: item,
    });
  await prisma.resource.deleteMany();
  await prisma.resource.createMany({
    data: [
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
    ],
  });
}

main().finally(async () => prisma.$disconnect());
