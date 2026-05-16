const plants = [
  {
    id: 1,
    slug: "scadoxus-multiflorus",
    name: "Кровавая лилия",
    latinName: "Scadoxus multiflorus",
    region: "Африка",
    type: "Луковичное",
    rarity: "Высокая",
    shortDescription: "Эффектное растение с шаровидным ярко-красным соцветием.",
    description: "Кровавая лилия ценится за необычную форму соцветия и декоративность. Предпочитает рассеянный свет, умеренный полив и рыхлую почву с дренажом.",
    care: {
      light: "Яркий рассеянный свет",
      watering: "Умеренный, без застоя воды",
      temperature: "18-25°C",
      humidity: "Средняя"
    },
    images: [
      "https://loremflickr.com/1200/800/red,lily,flower?lock=1101",
      "https://loremflickr.com/1200/800/scadoxus,flower?lock=1102",
      "https://loremflickr.com/1200/800/tropical,lily,red?lock=1103"
    ],
    image: "https://loremflickr.com/1200/800/red,lily,flower?lock=1101"
  },
  {
    id: 2,
    slug: "eucalyptus-deglupta",
    name: "Радужный эвкалипт",
    latinName: "Eucalyptus deglupta",
    region: "Юго-Восточная Азия",
    type: "Дерево",
    rarity: "Средняя",
    shortDescription: "Известен разноцветной корой с естественным градиентом.",
    description: "Радужный эвкалипт в природе встречается во влажных тропических районах. Его отличительная особенность - цветные слои коры.",
    care: {
      light: "Солнечное место",
      watering: "Регулярный полив",
      temperature: "20-30°C",
      humidity: "Высокая"
    },
    images: [
      "https://loremflickr.com/1200/800/eucalyptus,tree,bark?lock=1201",
      "https://loremflickr.com/1200/800/eucalyptus,forest?lock=1202",
      "https://loremflickr.com/1200/800/rainbow,eucalyptus,tree?lock=1203"
    ],
    image: "https://loremflickr.com/1200/800/eucalyptus,tree,bark?lock=1201"
  },
  {
    id: 3,
    slug: "dionaea-muscipula",
    name: "Венерина мухоловка",
    latinName: "Dionaea muscipula",
    region: "США",
    type: "Хищное",
    rarity: "Средняя",
    shortDescription: "Хищное растение, способное захлопывать ловушки при касании.",
    description: "Венерина мухоловка получает часть питательных веществ из насекомых. Требует влажного субстрата и мягкой воды.",
    care: {
      light: "Яркий свет 4-6 часов",
      watering: "Через поддон дистиллированной водой",
      temperature: "18-28°C",
      humidity: "Средняя или повышенная"
    },
    images: [
      "https://loremflickr.com/1200/800/venus,flytrap,plant?lock=1301",
      "https://loremflickr.com/1200/800/carnivorous,plant?lock=1302",
      "https://loremflickr.com/1200/800/flytrap,macro?lock=1303"
    ],
    image: "https://loremflickr.com/1200/800/venus,flytrap,plant?lock=1301"
  },
  {
    id: 4,
    slug: "amorphophallus-titanum",
    name: "Трупный цветок",
    latinName: "Amorphophallus titanum",
    region: "Суматра",
    type: "Тропическое",
    rarity: "Очень высокая",
    shortDescription: "Огромное соцветие с редким и впечатляющим цветением.",
    description: "Этот вид известен самым крупным неразветвленным соцветием и редким периодом цветения. Требует стабильного тропического микроклимата.",
    care: {
      light: "Рассеянный яркий свет",
      watering: "Умеренный, по влажности субстрата",
      temperature: "24-30°C",
      humidity: "Высокая"
    },
    images: [
      "https://loremflickr.com/1200/800/titan,arum,flower?lock=1401",
      "https://loremflickr.com/1200/800/tropical,corpse,flower?lock=1402",
      "https://loremflickr.com/1200/800/amorphophallus,botanical?lock=1403"
    ],
    image: "https://loremflickr.com/1200/800/titan,arum,flower?lock=1401"
  },
  {
    id: 5,
    slug: "protea-cynaroides",
    name: "Протея королевская",
    latinName: "Protea cynaroides",
    region: "ЮАР",
    type: "Кустарник",
    rarity: "Средняя",
    shortDescription: "Крупные цветки и выразительная форма делают вид популярным в декоративной флористике.",
    description: "Протея любит хорошее освещение, умеренный полив и воздухопроницаемую почву. Считается символом разнообразия флоры Южной Африки.",
    care: {
      light: "Полное солнце",
      watering: "Умеренный",
      temperature: "16-28°C",
      humidity: "Низкая или средняя"
    },
    images: [
      "https://loremflickr.com/1200/800/protea,flower,south-africa?lock=1501",
      "https://loremflickr.com/1200/800/protea,bloom?lock=1502",
      "https://loremflickr.com/1200/800/exotic,protea,flower?lock=1503"
    ],
    image: "https://loremflickr.com/1200/800/protea,flower,south-africa?lock=1501"
  }
];

module.exports = plants;
