import { Prisma, type PrismaClient } from '../../generated/prisma/client';
import { WORK_TYPES } from './data';

export const DEMO_PROJECT_NAME = 'ЖК «Северный»';
export const DEMO_JOURNAL_TITLE = 'Основной журнал';

const TOTAL_ENTRIES = 1000;

const DEMO_WORKERS = [
  'Иванов И.И.',
  'Петров С.В.',
  'Сидоров А.П.',
  'Кузнецов Д.И.',
  'Николаев В.Г.',
  'Орлов П.Н.',
  'Смирнов К.А.',
  'Козлов Р.М.',
  'Лебедев Е.Ю.',
  'Волков Н.С.',
] as const;

const DEMO_SECTIONS = ['А', 'Б', 'В', 'Г', '1', '2', '3'] as const;
const DEMO_FLOORS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10'] as const;
const DEMO_AXES = ['1-3/А-В', '4-6/Г-Д', '7-9/Е-Ж', '2-4/Б-Г', '5-7/В-Д', '1-5/А-Г'] as const;

const DEMO_NOTES = [
  'Работы выполнены в штатном режиме, замечаний нет.',
  'Погодные условия — дождь, работы приостановлены на 2 часа.',
  'Выполнено с опережением графика.',
  'Требуется дополнительная приёмка.',
  'Замечания устранены, работа принята.',
  'Материал доставлен с задержкой, начало работ сдвинуто.',
  'Контроль качества — без замечаний.',
  null,
] as const;

function pickItem<T>(items: readonly T[], index: number): T {
  return items[index % items.length]!;
}

function seededRandom(seed: number): number {
  const x = Math.sin(seed * 9301 + 49297) * 49297;
  return x - Math.floor(x);
}

function generateWorkDates(count: number): Date[] {
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - 5, 1);
  const endDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const totalDays = Math.floor((endDate.getTime() - startDate.getTime()) / 86_400_000);
  const dates: Date[] = [];
  for (let i = 0; i < count; i += 1) {
    const dayOffset = Math.floor(seededRandom(i + 42) * totalDays);
    dates.push(new Date(startDate.getTime() + dayOffset * 86_400_000));
  }
  return dates.sort((a, b) => a.getTime() - b.getTime());
}

export async function seedDemoProjectEntries(
  prisma: PrismaClient,
  createdById: string,
): Promise<void> {
  const existingProject = await prisma.project.findFirst({
    where: { name: DEMO_PROJECT_NAME },
  });
  const project =
    existingProject ??
    (await prisma.project.create({
      data: {
        name: DEMO_PROJECT_NAME,
        address: 'г. Москва, ул. Северная, 12',
        createdById,
      },
    }));
  let journal = await prisma.workJournal.findFirst({
    where: {
      projectId: project.id,
      deletedAt: null,
    },
  });
  if (!journal) {
    journal = await prisma.workJournal.create({
      data: {
        projectId: project.id,
        title: DEMO_JOURNAL_TITLE,
        createdById,
      },
    });
  } else if (!journal.title) {
    journal = await prisma.workJournal.update({
      where: { id: journal.id },
      data: { title: DEMO_JOURNAL_TITLE },
    });
  }
  const existingCount = await prisma.journalEntry.count({
    where: { journalId: journal.id, deletedAt: null },
  });
  if (existingCount > 0) {
    console.log(`Demo journal already has ${existingCount} entries, skipping entry seed.`);
    return;
  }
  const workDates = generateWorkDates(TOTAL_ENTRIES);
  const entries: Prisma.JournalEntryCreateManyInput[] = [];
  for (let i = 0; i < TOTAL_ENTRIES; i += 1) {
    const workType = pickItem(WORK_TYPES, i);
    const volumeBase = workType.defaultUnit === 'м³' ? 12 : workType.defaultUnit === 'т' ? 2.5 : 45;
    const volumeVariation = volumeBase * (0.5 + seededRandom(i * 7 + 3));
    const volume = Math.round(volumeVariation * 100) / 100;
    entries.push({
      journalId: journal.id,
      workDate: workDates[i]!,
      workTypeSnapshot: workType.name,
      unitSnapshot: workType.defaultUnit,
      volume: new Prisma.Decimal(volume),
      workerNameSnapshot: pickItem(DEMO_WORKERS, i),
      orderIndex: i + 1,
      locationSection: pickItem(DEMO_SECTIONS, i),
      locationFloor: pickItem(DEMO_FLOORS, i + Math.floor(seededRandom(i) * 5)),
      locationAxes: pickItem(DEMO_AXES, i),
      notes: i % 4 === 0 ? pickItem(DEMO_NOTES, i) : null,
      createdById,
    });
  }
  const BATCH_SIZE = 200;
  for (let offset = 0; offset < entries.length; offset += BATCH_SIZE) {
    await prisma.journalEntry.createMany({
      data: entries.slice(offset, offset + BATCH_SIZE),
    });
  }
  console.log(`Seeded ${entries.length} demo entries for "${DEMO_PROJECT_NAME}".`);
}
