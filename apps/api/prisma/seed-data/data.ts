export type WorkTypeSeedItem = {
  readonly name: string;
  readonly defaultUnit: string;
  readonly sortOrder: number;
};

export const WORK_TYPES: readonly WorkTypeSeedItem[] = [
  { name: 'Кладка перегородок', defaultUnit: 'м²', sortOrder: 10 },
  { name: 'Монтаж опалубки', defaultUnit: 'м²', sortOrder: 20 },
  { name: 'Бетонирование', defaultUnit: 'м³', sortOrder: 30 },
  { name: 'Армирование', defaultUnit: 'т', sortOrder: 40 },
  { name: 'Гидроизоляция', defaultUnit: 'м²', sortOrder: 50 },
  { name: 'Штукатурные работы', defaultUnit: 'м²', sortOrder: 60 },
  { name: 'Демонтаж перегородок', defaultUnit: 'м²', sortOrder: 70 },
  { name: 'Выравнивание стен', defaultUnit: 'м²', sortOrder: 80 },
  { name: 'Укладка плитки', defaultUnit: 'м²', sortOrder: 90 },
  { name: 'Покраска', defaultUnit: 'м²', sortOrder: 100 },
  { name: 'Монтаж электрики', defaultUnit: 'м', sortOrder: 110 },
  { name: 'Монтаж сантехники', defaultUnit: 'шт', sortOrder: 120 },
  { name: 'Устройство полов', defaultUnit: 'м²', sortOrder: 130 },
  { name: 'Монтаж окон', defaultUnit: 'шт', sortOrder: 140 },
  { name: 'Кровельные работы', defaultUnit: 'м²', sortOrder: 150 },
] as const;
