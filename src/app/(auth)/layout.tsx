import { Link2 } from 'lucide-react';
import Image from 'next/image';
import type { ReactNode } from 'react';
export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <div className="h-full min-h-screen w-full items-center justify-center bg-white p-10 lg:w-[50%]">
        <div className="flex items-center space-x-2 p-10">
          <div className="bg-primary inline-flex size-7 items-center justify-center rounded text-white">
            <Link2 className="size-4" />
          </div>
          <h1 className="text-base font-bold">Link Vault</h1>
        </div>
        {children}
      </div>
      <div className="to-light-primary from-light fixed top-0 right-0 bottom-0 hidden h-screen w-[50%] bg-linear-to-b object-fill lg:block">
        <Image
          src="/illustration/patterns.png"
          alt="team"
          loading="lazy"
          fill
          className="object-cover"
        />
      </div>
    </div>
  );
}
