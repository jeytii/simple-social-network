import Head from 'next/head';
import Logo from 'components/common/Logo';
import type { ReactNode } from 'react';

interface Props {
  title: string;
  formTitle: string;
  children: ReactNode;
}

export default function Public({ title, formTitle, children }: Props) {
  return (
    <section className='px-md'>
      <Head>
        <title>{title}</title>
        <link rel='icon' href='/dark.ico' />
      </Head>

      <main className='max-w-[360px] bg-skin-main border border-skin-main rounded p-lg mx-auto my-xxl'>
        <div className='flex items-center justify-center'>
          <a href='/' className='no-underline'>
            <Logo />
          </a>
        </div>

        <h1 className='text-md text-skin-secondary font-bold text-center mt-xs'>
          {formTitle}
        </h1>

        {children}
      </main>
    </section>
  );
}
