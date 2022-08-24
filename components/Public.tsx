import type { ReactNode } from 'react';
import Head from 'next/head';

interface Props {
  title: string;
  children: ReactNode;
}

export default function Public({ title, children }: Props) {
  return (
    <section className='px-md'>
      <Head>
        <title>{title}</title>
        <link rel='icon' href='/dark.ico' />
      </Head>

      {children}
    </section>
  );
}
