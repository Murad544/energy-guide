export const siteCopy = {
  brand: "Enerji bələdçisi",
  nav: [
    { href: "/", label: "Başlanğıc" },
    { href: "/knowledge", label: "Bilik mərkəzi" },
    { href: "/calculators", label: "Hesablayıcılar" },
    { href: "/news", label: "Xəbərlər" },
  ],
  home: {
    eyebrow: "Günəşi rəqəmlərə çevirin",
    title: "Enerji qərarınızı işıqlandıran praktik bələdçi",
    lede: "Fotovoltaik sistemlərin necə işlədiyini öyrənin, eviniz üçün gücü hesablayın və avadanlıq seçiminə daha hazırlıqlı başlayın.",
    primaryAction: "Sistemi hesabla",
    secondaryAction: "Dərslərə başla",
    note: "Azərbaycan şəraiti üçün izahlar, düsturlar və seçim meyarları.",
    stats: [
      { value: "9", label: "ardıcıl dərs" },
      { value: "5", label: "mühəndislik hesabı" },
      { value: "1", label: "interaktiv sistem xəritəsi" },
    ],
    principles: [
      {
        number: "01",
        title: "Əvvəl anlayın",
        text: "Paneldən inverterə qədər hər hissənin rolunu sadə dillə öyrənin.",
      },
      {
        number: "02",
        title: "Sonra ölçün",
        text: "İstehlak, günəş saatı və dam sahəsini real rəqəmlərlə müqayisə edin.",
      },
      {
        number: "03",
        title: "Yenilikləri izləyin",
        text: "Günəş enerjisi, texnologiya və bazar haqqında yeniliklərdən xəbərdar olun.",
      },
    ],
  },
  footer: {
    note: "Açıq və praktik günəş enerjisi bilikləri.",
    admin: "İdarəetmə",
  },
  knowledge: {
    eyebrow: "9 dərslik kurs",
    title: "Bilik mərkəzi",
    lede: "Təməl anlayışlardan sistem seçiminə qədər aydın öyrənmə yolu.",
  },
  calculators: {
    eyebrow: "Praktik alətlər",
    title: "Hesablayıcılar",
    lede: "Başlanğıc ölçüləndirmə üçün əsas rəqəmləri saniyələr içində görün.",
  },
  news: {
    eyebrow: "Enerji gündəliyi",
    title: "Xəbərlər",
    lede: "Günəş enerjisi, texnologiya və bazardakı yeniliklər.",
  },
} as const;

export const courseLessons = [
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

export const calculatorCopy = {
  monthlyUse: "Aylıq istehlak",
  peakSun: "Pik günəş saatı",
  panelPower: "Panel gücü",
  tariff: "Tarif",
  systemPower: "Sistem gücü",
  panelCount: "Panel sayı",
  roofArea: "Dam sahəsi",
  monthlySaving: "Aylıq qənaət",
  systemSizeTitle: "PV sistem ölçüsü",
  systemSizeText:
    "Aylıq istehlaka görə ilkin sistem gücünü və panel sayını hesablayın.",
  annualTitle: "İllik istehsal",
  annualText:
    "Sistem gücü, günəş saatı və deqradasiya əsasında istehsalı görün.",
  batteryTitle: "Batareya tutumu",
  batteryText:
    "Gündəlik yük və ehtiyat günlərinə görə lazım olan tutumu tapın.",
  roiTitle: "Geriödəmə müddəti",
  roiText: "İlkin xərc və aylıq qənaət əsasında sadə geriödəməni hesablayın.",
  roofTitle: "Dam potensialı",
  roofText: "Faydalı sahə və istiqamətə görə yerləşəcək panel sayını görün.",
  systemKw: "Sistem gücü (kVt)",
  degradation: "İllik deqradasiya (%)",
  year: "İl",
  production: "Həmin il istehsal",
  dailyLoad: "Gündəlik yük (kVt·s)",
  autonomy: "Ehtiyat müddəti (gün)",
  dod: "Boşalma dərinliyi",
  capacity: "Tələb olunan tutum",
  estimate: "Təxmini qiymət",
  cost: "Sistem xərci (USD)",
  saving: "Aylıq qənaət (AZN)",
  exchange: "Məzənnə (AZN/USD)",
  payback: "Geriödəmə",
  savings25: "25 illik qənaət",
  area: "Faydalı dam sahəsi (m²)",
  orientation: "İstiqamət əmsalı",
  effectivePower: "Effektiv güc",
  panels: "panel",
  years: "il",
  simulatorTitle: "Sistem axını simulyatoru",
  simulatorText:
    "Enerjinin müxtəlif sistem quruluşlarında hansı avadanlıqlardan keçdiyini izləyin.",
  modes: { onGrid: "Şəbəkəli", offGrid: "Avtonom", hybrid: "Hibrid" },
  modeInfo: {
    onGrid: "Panellər evi qidalandırır, artıq enerji isə şəbəkəyə yönəlir.",
    offGrid:
      "Şəbəkə olmadan enerji batareyada saxlanır və inverter vasitəsilə evə verilir.",
    hybrid:
      "Hibrid sistem panel, batareya və şəbəkəni fasiləsiz enerji üçün birlikdə idarə edir.",
  },
} as const;

export const resourceCopy = {
  categories: [
    {
      id: "az",
      title: "Azərbaycan",
      text: "Yerli enerji siyasəti və bərpa olunan enerji layihələri.",
    },
    {
      id: "world",
      title: "Dünya",
      text: "Qlobal günəş enerjisi statistikası və hesabatları.",
    },
    {
      id: "tech",
      title: "Texnologiya",
      text: "PV texnologiyası, standartlar və mühəndislik mənbələri.",
    },
    {
      id: "market",
      title: "Bazar",
      text: "Qiymətlər, istehsal gücü və sənaye tendensiyaları.",
    },
  ],
  links: [
    {
      category: "az",
      title: "Energetika Nazirliyi",
      source: "minenergy.gov.az",
      url: "https://minenergy.gov.az/",
    },
    {
      category: "world",
      title: "Beynəlxalq Bərpa Olunan Enerji Agentliyi",
      source: "irena.org",
      url: "https://www.irena.org/",
    },
    {
      category: "tech",
      title: "PV sistemləri üzrə NREL araşdırmaları",
      source: "nrel.gov",
      url: "https://www.nrel.gov/solar/",
    },
    {
      category: "market",
      title: "Günəş enerjisi bazar icmalları",
      source: "iea.org",
      url: "https://www.iea.org/energy-system/renewables/solar-pv",
    },
  ],
} as const;
