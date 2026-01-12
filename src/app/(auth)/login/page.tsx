'use client';

import { Button, Input } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeClosed, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

import { authClient } from '@/libs/auth/auth-client';

const loginSchema = z.object({
  email: z.email('Please enter a valid email address'),
  password: z
    .string('Please enter your password')
    .min(8, 'Be at least 8 characters long'),
});

type LoginInput = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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

      await authClient.signIn.email(payload, {
        onSuccess: () => {
          router.push('/home');
          router.refresh();
        },
        onError: (ctx) => {
          toast.error(ctx.error.message ?? 'Login failed');
          setLoading(false);
        },
      });
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Something went wrong');
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{
        y: 30,
        opacity: 0,
      }}
      whileInView={{
        y: 0,
        opacity: 1,
      }}
      className="p-10">
      <div className="space-y-2">
        <h1 className="text-4xl font-black">Hello,</h1>
        <h1 className="text-4xl font-black">Welcome Back</h1>
      </div>
      <p className="my-3 text-base text-gray-500">
        Sign in to manage your short links
      </p>
      <form className="mt-8" onSubmit={handleSubmit(handleSubmitLogin)}>
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              label="Email address"
              className="mb-4"
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
              className="mb-4"
              isInvalid={!!errors.password}
              errorMessage={errors.password?.message}
              type={showPassword ? 'text' : 'password'}
              {...field}
              endContent={
                <Button
                  variant="light"
                  size="sm"
                  isIconOnly
                  onPress={() => setShowPassword(!showPassword)}>
                  {showPassword ? (
                    <Eye className="size-5 text-gray-400" />
                  ) : (
                    <EyeOff className="size-5 text-gray-400" />
                  )}
                </Button>
              }
            />
          )}
        />
        <Button
          className="mt-5"
          isLoading={loading}
          type="submit"
          radius="sm"
          size="lg"
          color="primary"
          fullWidth>
          Login
        </Button>
      </form>
      <p className="mt-6 text-right text-xs font-medium text-gray-600">
        Don't have an account?{' '}
        <Link
          href="/register"
          type="button"
          className="text-primary hover:text-primary underline">
          Sign up
        </Link>
      </p>
    </motion.div>
  );
}
