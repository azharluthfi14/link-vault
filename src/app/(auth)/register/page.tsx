'use client';
import { Button, Input } from '@heroui/react';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'sonner';
import z from 'zod';

import { authClient } from '@/libs/auth/auth-client';

const registerSchema = z
  .object({
    name: z.string('Please enter fullname'),
    email: z.email('Please enter a valid email address'),
    password: z
      .string('Please enter password')
      .min(8, 'Be at least 8 characters long'),
    confirmPassword: z.string('Please enter confirm password'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

type RegisterInput = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    control,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const handleSubmitRegister = async () => {
    setLoading(true);

    try {
      const payload = {
        name: getValues('name'),
        email: getValues('email'),
        password: getValues('password'),
      };

      await authClient.signUp.email(payload, {
        onSuccess: () => {
          toast.success('Success register');
          router.push('/home');
          router.refresh();
        },
        onError: (ctx) => {
          toast.error(ctx.error.message ?? 'Login failed');
          setLoading(false);
        },
      });
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
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
      <div className="mb-5 space-y-2">
        <h1 className="text-4xl font-black">Create account</h1>
        <p className="text-base text-gray-500">
          Start creating short links in seconds
        </p>
      </div>
      <form onSubmit={handleSubmit(handleSubmitRegister)}>
        <Controller
          name="name"
          control={control}
          render={({ field }) => (
            <Input
              label="Fullname"
              isInvalid={!!errors.name}
              errorMessage={errors.name?.message}
              className="mb-4"
              type="text"
              {...field}
            />
          )}
        />
        <Controller
          name="email"
          control={control}
          render={({ field }) => (
            <Input
              label="Email address"
              isInvalid={!!errors.email}
              errorMessage={errors.email?.message}
              className="mb-4"
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
              type={showPassword ? 'text' : 'password'}
              className="mb-4"
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
              {...field}
            />
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field }) => (
            <Input
              label="Confirm Password"
              isInvalid={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword?.message}
              type={showConfirmPassword ? 'text' : 'password'}
              className="mb-4"
              endContent={
                <Button
                  variant="light"
                  size="sm"
                  isIconOnly
                  onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  {showConfirmPassword ? (
                    <Eye className="size-5 text-gray-400" />
                  ) : (
                    <EyeOff className="size-5 text-gray-400" />
                  )}
                </Button>
              }
              {...field}
            />
          )}
        />
        <Button
          size="lg"
          className="mt-6"
          radius="sm"
          isLoading={loading}
          type="submit"
          color="primary"
          fullWidth>
          Create Account
        </Button>
      </form>
      <p className="mt-6 text-right text-xs font-medium text-gray-600">
        Already have an account?{' '}
        <Link
          href="/login"
          type="button"
          className="text-primary hover:text-primary underline">
          Sign in
        </Link>
      </p>
    </motion.div>
  );
}
