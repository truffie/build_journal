'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useMemo, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { useCreateEntry, useUpdateEntry, type JournalEntry } from '@/entities/journal-entry';
import { useWorkTypes } from '@/entities/work-type';
import { toApiDate } from '@/shared/lib';

const KNOWN_UNITS = ['м²', 'м³', 'м', 'т', 'шт', 'п.м.', 'кг', 'л'] as const;

const schema = z.object({
  workTypeName: z.string().min(1, 'Укажите вид работ'),
  workDate: z.string().min(1, 'Укажите дату'),
  volume: z
    .string()
    .min(1, 'Укажите объём')
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) > 0, 'Объём > 0'),
  workerName: z.string().min(2, 'Укажите исполнителя'),
  unit: z.string().min(1, 'Укажите ед. изм.'),
  locationSection: z.string().optional(),
  locationFloor: z.string().optional(),
  locationAxes: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

type EntryFormSheetProps = {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly journalId: string;
  readonly entry?: JournalEntry | null;
  readonly onSuccess: () => void;
};

export function EntryFormSheet({
  open,
  onOpenChange,
  journalId,
  entry,
  onSuccess,
}: EntryFormSheetProps): React.ReactElement {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        {open ? (
          <EntryFormContent
            key={entry?.id ?? 'new'}
            journalId={journalId}
            entry={entry}
            onSuccess={onSuccess}
            onClose={() => onOpenChange(false)}
          />
        ) : null}
      </SheetContent>
    </Sheet>
  );
}

type EntryFormContentProps = {
  readonly journalId: string;
  readonly entry?: JournalEntry | null;
  readonly onSuccess: () => void;
  readonly onClose: () => void;
};

function EntryFormContent({ journalId, entry, onSuccess, onClose }: EntryFormContentProps): React.ReactElement {
  const isEdit = Boolean(entry);
  const { workTypes } = useWorkTypes();
  const createMutation = useCreateEntry({
    journalId,
    onSuccess: () => { onSuccess(); onClose(); },
  });
  const updateMutation = useUpdateEntry({
    journalId,
    onSuccess: () => { onSuccess(); onClose(); },
  });
  const isSaving = createMutation.isPending || updateMutation.isPending;
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: buildDefaults(entry),
  });
  const workTypeName = useWatch({ control: form.control, name: 'workTypeName' });
  const unitValue = useWatch({ control: form.control, name: 'unit' });
  const workerName = useWatch({ control: form.control, name: 'workerName' });
  const filteredWorkTypes = useMemo(() => {
    if (!workTypeName) return workTypes;
    const lower = workTypeName.toLowerCase();
    return workTypes.filter((item) => item.name.toLowerCase().includes(lower));
  }, [workTypeName, workTypes]);
  const filteredUnits = useMemo(() => {
    if (!unitValue) return [...KNOWN_UNITS];
    const lower = unitValue.toLowerCase();
    return KNOWN_UNITS.filter((u) => u.toLowerCase().includes(lower));
  }, [unitValue]);
  const [showWorkTypeSuggestions, setShowWorkTypeSuggestions] = useState(false);
  const [showUnitSuggestions, setShowUnitSuggestions] = useState(false);
  const [showWorkerSuggestions, setShowWorkerSuggestions] = useState(false);
  const knownWorkers = useMemo(
    () => ['Прораб Иванов', 'Петров С.В.', 'Сидоров А.П.', 'Кузнецов Д.И.', 'Николаев В.Г.'],
    [],
  );
  const filteredWorkers = useMemo(() => {
    if (!workerName) return knownWorkers;
    const lower = workerName.toLowerCase();
    return knownWorkers.filter((w) => w.toLowerCase().includes(lower));
  }, [workerName, knownWorkers]);
  const selectWorkType = (item: { name: string; defaultUnit: string }): void => {
    form.setValue('workTypeName', item.name);
    form.setValue('unit', item.defaultUnit);
    setShowWorkTypeSuggestions(false);
  };
  const handleSubmit = (values: FormValues): void => {
    if (!journalId) {
      toast.error('Журнал не выбран');
      return;
    }
    const matchedType = workTypes.find(
      (item) => item.name.toLowerCase() === values.workTypeName.toLowerCase(),
    );
    if (isEdit && entry) {
      updateMutation.mutate({
        entryId: entry.id,
        payload: {
          workDate: values.workDate,
          workTypeSnapshot: values.workTypeName,
          unitSnapshot: values.unit,
          volume: Number(values.volume),
          workerNameSnapshot: values.workerName,
          notes: values.notes || undefined,
          locationSection: values.locationSection || undefined,
          locationFloor: values.locationFloor || undefined,
          locationAxes: values.locationAxes || undefined,
        },
      });
    } else {
      createMutation.mutate({
        workTypeId: matchedType?.id ?? 0,
        workDate: values.workDate,
        volume: Number(values.volume),
        workerName: values.workerName,
        unitOverride: matchedType ? undefined : values.unit,
        locationSection: values.locationSection || undefined,
        locationFloor: values.locationFloor || undefined,
        locationAxes: values.locationAxes || undefined,
        notes: values.notes || undefined,
      });
    }
  };
  return (
    <>
      <SheetHeader>
        <SheetTitle>{isEdit ? 'Редактировать запись' : 'Новая запись'}</SheetTitle>
        <SheetDescription>
          {isEdit ? 'Измените данные записи журнала' : 'Заполните данные для новой записи'}
        </SheetDescription>
      </SheetHeader>
      <Form {...form}>
        <form className="mt-4 space-y-5 px-4" onSubmit={form.handleSubmit(handleSubmit)}>
          <div className="space-y-4">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Обязательные поля
            </p>
            <FormField
              control={form.control}
              name="workDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Дата</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="workTypeName"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Вид работ</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Введите или выберите"
                      autoComplete="off"
                      {...field}
                      onFocus={() => setShowWorkTypeSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowWorkTypeSuggestions(false), 200)}
                    />
                  </FormControl>
                  {showWorkTypeSuggestions && filteredWorkTypes.length > 0 && !isEdit ? (
                    <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-40 overflow-y-auto rounded-md border bg-popover shadow-md">
                      {filteredWorkTypes.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className="w-full px-3 py-1.5 text-left text-sm hover:bg-accent"
                          onMouseDown={() => selectWorkType(item)}
                        >
                          {item.name}{' '}
                          <span className="text-muted-foreground">({item.defaultUnit})</span>
                        </button>
                      ))}
                    </div>
                  ) : null}
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name="volume"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Объём</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" min="0" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="unit"
                render={({ field }) => (
                  <FormItem className="relative">
                    <FormLabel>Ед. изм.</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="м², шт"
                        autoComplete="off"
                        {...field}
                        onFocus={() => setShowUnitSuggestions(true)}
                        onBlur={() => setTimeout(() => setShowUnitSuggestions(false), 200)}
                      />
                    </FormControl>
                    {showUnitSuggestions && filteredUnits.length > 0 && !isEdit ? (
                      <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-32 overflow-y-auto rounded-md border bg-popover shadow-md">
                        {filteredUnits.map((u) => (
                          <button
                            key={u}
                            type="button"
                            className="w-full px-3 py-1.5 text-left text-sm hover:bg-accent"
                            onMouseDown={() => {
                              form.setValue('unit', u);
                              setShowUnitSuggestions(false);
                            }}
                          >
                            {u}
                          </button>
                        ))}
                      </div>
                    ) : null}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="workerName"
              render={({ field }) => (
                <FormItem className="relative">
                  <FormLabel>Исполнитель</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="ФИО исполнителя"
                      autoComplete="off"
                      {...field}
                      onFocus={() => setShowWorkerSuggestions(true)}
                      onBlur={() => setTimeout(() => setShowWorkerSuggestions(false), 200)}
                    />
                  </FormControl>
                  {showWorkerSuggestions && filteredWorkers.length > 0 && !isEdit ? (
                    <div className="absolute top-full right-0 left-0 z-50 mt-1 max-h-32 overflow-y-auto rounded-md border bg-popover shadow-md">
                      {filteredWorkers.map((worker) => (
                        <button
                          key={worker}
                          type="button"
                          className="w-full px-3 py-1.5 text-left text-sm hover:bg-accent"
                          onMouseDown={() => {
                            form.setValue('workerName', worker);
                            setShowWorkerSuggestions(false);
                          }}
                        >
                          {worker}
                        </button>
                      ))}
                    </div>
                  ) : null}
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Separator />
          <div className="space-y-4">
            <p className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
              Дополнительно
            </p>
            <div className="grid grid-cols-3 gap-3">
              <FormField
                control={form.control}
                name="locationSection"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Секция</FormLabel>
                    <FormControl>
                      <Input placeholder="А" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="locationFloor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Этаж</FormLabel>
                    <FormControl>
                      <Input placeholder="3" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="locationAxes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Оси</FormLabel>
                    <FormControl>
                      <Input placeholder="1-3/А-В" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Примечание</FormLabel>
                  <FormControl>
                    <Input placeholder="По желанию" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
          <SheetFooter className="px-0 pt-2">
            <Button type="button" variant="outline" onClick={onClose}>
              Отмена
            </Button>
            <Button type="submit" disabled={isSaving}>
              Сохранить
            </Button>
          </SheetFooter>
        </form>
      </Form>
    </>
  );
}

function buildDefaults(entry: JournalEntry | null | undefined): FormValues {
  if (!entry) {
    return {
      workTypeName: '',
      workDate: toApiDate(new Date()),
      volume: '',
      workerName: '',
      unit: '',
      locationSection: '',
      locationFloor: '',
      locationAxes: '',
      notes: '',
    };
  }
  return {
    workTypeName: entry.workTypeSnapshot,
    workDate: entry.workDate.slice(0, 10),
    volume: String(entry.volume),
    workerName: entry.workerNameSnapshot,
    unit: entry.unitSnapshot,
    locationSection: entry.locationSection ?? '',
    locationFloor: entry.locationFloor ?? '',
    locationAxes: entry.locationAxes ?? '',
    notes: entry.notes ?? '',
  };
}
