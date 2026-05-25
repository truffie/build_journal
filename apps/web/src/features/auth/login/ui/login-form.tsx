'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useSignIn } from '../model/use-sign-in';
import { useWorkspaceStore } from '@/entities/workspace';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';

const loginSchema = z.object({
  email: z.email('Введите корректный email'),
  password: z.string().min(6, 'Минимум 6 символов'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm(): React.ReactElement {
  const resetWorkspace = useWorkspaceStore((state) => state.resetWorkspace);
  const { signIn, isPending, error } = useSignIn({ onSuccess: resetWorkspace });
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: 'foreman@test.local',
      password: 'password123',
    },
  });
  const handleSubmit = async (values: LoginFormValues): Promise<void> => {
    await signIn(values);
  };
  return (
    <Card className="w-full max-w-md border-border/60 bg-card/80 backdrop-blur">
      <CardHeader>
        <CardTitle className="text-xl">Вход</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(handleSubmit)}>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" autoComplete="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Пароль</FormLabel>
                  <FormControl>
                    <Input type="password" autoComplete="current-password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {error ? <p className="text-destructive text-sm">{error}</p> : null}
            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Вход…' : 'Войти'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
