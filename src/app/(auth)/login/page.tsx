'use client';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Input,
} from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link2 } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

import { authClient } from '@/libs/auth/auth-client';

const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z.string().min(8, 'Be at least 8 characters long'),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const [loading, setLoading] = useState(false);
  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    mode: 'onChange',
  });

  const handleSubmitLogin = async () => {
    setLoading(true);

    try {
      const payload = {
        email: getValues('email'),
        password: getValues('password'),
      };

      const response = await authClient.signIn.email(payload);

      if (response.error) {
        toast.error(response.error.message || 'Login failed');
        return;
      }

      toast.success('Login successful!');
      // router.push('/dashboard');
      // router.refresh();

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-md">
        {/* <div className="mb-8 flex flex-row items-center justify-center space-x-3">
          <div className="bg-primary inline-flex h-16 w-16 items-center justify-center rounded-2xl text-white">
            <Link2 className="h-8 w-8" />
          </div>
          <div>
            <h1 className="mb-2 text-3xl">LinkVault</h1>
            <p className="text-gray-600">
              Short links, fully under your control
            </p>
          </div>
        </div> */}
        <Card shadow="none" className="border border-gray-100 p-4">
          <CardHeader className="flex-col">
            <h1 className="text-xl font-bold">Welcome back</h1>
            <p>Sign in to manage your short links</p>
          </CardHeader>
          <form onSubmit={handleSubmit(handleSubmitLogin)}>
            <CardBody className="space-y-4">
              <Controller
                name="email"
                control={control}
                render={({ field }) => (
                  <Input
                    label="Email address"
                    isInvalid={!!errors.email}
                    errorMessage={errors.email?.message}
                    type="email"
                    {...field}
                  />
                )}
              />
              <Controller
                control={control}
                name="password"
                render={({ field }) => (
                  <Input
                    label="Password"
                    isInvalid={!!errors.password}
                    errorMessage={errors.password?.message}
                    type="password"
                    {...field}
                  />
                )}
              />
            </CardBody>
            <CardFooter>
              <Button
                isLoading={loading}
                type="submit"
                color="primary"
                fullWidth>
                Login
              </Button>
            </CardFooter>
          </form>
          <p className="text-sm text-gray-600">
            Don't have an account?{' '}
            <Link
              href="/register"
              type="button"
              className="text-primary hover:text-primary underline">
              Sign up
            </Link>
          </p>
        </Card>
      </div>
    </div>
  );
}
