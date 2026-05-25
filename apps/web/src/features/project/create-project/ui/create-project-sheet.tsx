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
import { createProject, type ProjectDashboardItem } from '@/entities/project';
import { ProjectDashboardItemDtoStatus } from '@/shared/api/generated/schema';

const schema = z.object({
  name: z.string().min(2, 'Минимум 2 символа').max(255),
  journalTitle: z.string().min(2, 'Минимум 2 символа').max(255),
});

type FormValues = z.infer<typeof schema>;

type CreateProjectSheetProps = {
  readonly open: boolean;
  readonly onOpenChange: (open: boolean) => void;
  readonly onCreated: (project: ProjectDashboardItem) => void;
  readonly mandatory?: boolean;
};

export function CreateProjectSheet({
  open,
  onOpenChange,
  onCreated,
  mandatory = false,
}: CreateProjectSheetProps): React.ReactElement {
  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: '',
      journalTitle: 'Журнал работ',
    },
  });
  const handleSubmit = async (values: FormValues): Promise<void> => {
    const result = await createProject(values);
    const dashboardItem: ProjectDashboardItem = {
      id: result.project.id,
      name: result.project.name,
      status: ProjectDashboardItemDtoStatus.ACTIVE,
      createdAt: new Date().toISOString(),
      journal: result.journal,
    };
    toast.success('Объект создан');
    onCreated(dashboardItem);
    form.reset();
    onOpenChange(false);
  };
  return (
    <Sheet open={open} onOpenChange={mandatory ? undefined : onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md px-4 pb-4">
        <SheetHeader>
          <SheetTitle>Новый объект</SheetTitle>
          <SheetDescription>
            Объект появится во вкладке. Журнал создаётся автоматически.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form className="mt-6 space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название объекта</FormLabel>
                  <FormControl>
                    <Input placeholder="ЖК «Северный», к. 1" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="journalTitle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Название журнала</FormLabel>
                  <FormControl>
                    <Input placeholder="введите название" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <SheetFooter className="px-0">
              {!mandatory ? (
                <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
                  Отмена
                </Button>
              ) : null}
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Создать
              </Button>
            </SheetFooter>
          </form>
        </Form>
      </SheetContent>
    </Sheet>
  );
}
