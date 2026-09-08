export type Scenario = {
  id: string; label: string; query: string; traits: string[]; category: string;
  products: { name: string; detail: string; reasons: string[]; color: string }[]
}
export const scenarios: Scenario[] = [
  { id: 'backpack', label: 'Рюкзак для города', query: 'Лёгкий рюкзак для ноутбука, чтобы не промокал под дождём', traits: ['Рюкзак', 'Лёгкий', 'Для ноутбука', 'Защита от дождя'], category: 'Для города и всего, что с вами', products: [
    { name: 'Городской рюкзак', detail: 'Нейлон · 18 л · 540 г', reasons: ['Отделение для ноутбука 15,6″', 'Водоотталкивающая ткань'], color: 'lavender' },
    { name: 'Компактный роллтоп', detail: 'Полиэстер · 20 л · 620 г', reasons: ['Мягкий карман для ноутбука', 'Покрытие от брызг и дождя'], color: 'mint' },
    { name: 'Рюкзак на каждый день', detail: 'Нейлон · 16 л · 480 г', reasons: ['Ноутбук до 14″', 'Лёгкий материал с пропиткой'], color: 'peach' },
  ] },
  { id: 'headphones', label: 'Наушники для работы', query: 'Беспроводные наушники, чтобы работать в шумном кафе', traits: ['Наушники', 'Без проводов', 'Для работы', 'Шумоподавление'], category: 'Больше музыки. Меньше шума.', products: [
    { name: 'Полноразмерные наушники', detail: 'Bluetooth · до 30 часов', reasons: ['Активное шумоподавление', 'Мягкие амбушюры для долгой работы'], color: 'mint' },
    { name: 'Компактные наушники', detail: 'Bluetooth · зарядный кейс', reasons: ['Режим подавления шума', 'Микрофоны для разговоров'], color: 'peach' },
    { name: 'Наушники для фокуса', detail: 'Bluetooth · до 40 часов', reasons: ['Изоляция фоновых звуков', 'Подключение к ноутбуку'], color: 'lavender' },
  ] },
  { id: 'lamp', label: 'Лампа для чтения', query: 'Лампа для чтения перед сном с мягким тёплым светом', traits: ['Лампа', 'Для чтения', 'Тёплый свет', 'Мягкое освещение'], category: 'Для ещё одной хорошей главы', products: [
    { name: 'Прикроватная лампа', detail: 'LED · тёплый свет 2700 K', reasons: ['Рассеиватель для мягкого света', 'Регулировка яркости'], color: 'peach' },
    { name: 'Настольный светильник', detail: 'LED · тёплый свет 3000 K', reasons: ['Направленный свет для книги', 'Поворотный плафон'], color: 'lavender' },
    { name: 'Лампа с диммером', detail: 'LED · тёплый свет 2700 K', reasons: ['Плавное уменьшение яркости', 'Матовое покрытие плафона'], color: 'mint' },
  ] },
]
// Exact curated examples only: no simulated AI responses to arbitrary text.
export function findScenario(query: string) {
  const normalize = (value: string) => value.toLocaleLowerCase('ru').replace(/ё/g, 'е').replace(/[.,!?]/g, '').replace(/\s+/g, ' ').trim()
  return scenarios.find(item => normalize(item.query) === normalize(query))
}
