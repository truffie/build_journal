'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
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
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { createProjectJournal, type ProjectJournal } from '@/entities/project';

const schema = z.object({
  title: z.string().min(2, 'Минимум 2 символа').max(255),
});

type FormValues = z.infer<typeof schema>;

type CreateJournalSheetProps = {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly projectId: string;
  readonly onCreated: (journal: ProjectJournal) => void;
};

export function CreateJournalSheet({
  open,
  onOpenChange,
  projectId,
  onCreated,
}: CreateJournalSheetProps): React.ReactElement {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { title: '' },
  });
  const handleSubmit = async (values: FormValues): Promise<void> => {
    try {
      const journal = await createProjectJournal(projectId, { title: values.title });
      onCreated(journal);
      onOpenChange(false);
      form.reset();
      toast.success('Журнал создан');
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Не удалось создать журнал');
    }
  };
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="left" className="flex w-full flex-col sm:max-w-md px-4 pb-4" >
        <SheetHeader>
          <SheetTitle>Новый журнал</SheetTitle>
          <SheetDescription>Укажите название журнала работ</SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form className="mt-4 space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название</FormLabel>
                  <FormControl>
                    <Input placeholder="июнь 2026" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter className="px-0">
              <Button type="submit" disabled={form.formState.isSubmitting}>
                {form.formState.isSubmitting ? 'Создание…' : 'Создать'}
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
