import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import InputField from 'components/common/InputField';
import Logo from 'components/common/Logo';
import type { FormEvent } from 'react';
import type { GetServerSideProps } from 'next';
import type { AxiosResponse, AxiosError } from 'axios';
import type { Variables, ErrorData } from 'types/form';

type FieldKey = 'password' | 'password_confirmation';

const fields = {
  password: '',
  password_confirmation: '',
};

export default function ResetPassword({ token }: { token: string }) {
  const { register, getValues, setError, clearErrors, formState } = useForm({
    defaultValues: { ...fields, token },
  });

  const { mutate, isLoading } = useMutation<
    AxiosResponse,
    AxiosError<ErrorData<FieldKey>>,
    Variables<FieldKey>
  >(['update'], {
    onSuccess({ data }) {
      Cookies.set('token', data.token);
      Cookies.set('user', JSON.stringify(data.user));
      window.location.href = '/home';
    },
    onError(error) {
      if (error.response) {
        const { errors } = error.response.data;
        const keys = Object.keys(errors);

        clearErrors();

        keys.forEach((key) => {
          const k = key as keyof typeof fields;

          setError(k, {
            type: 'manual',
            message: errors[k][0],
          });
        });
      }
    },
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();

    mutate({
      url: '/reset-password',
      data: getValues(),
    });
  };

  return (
    <main className='max-w-[360px] bg-skin-main border border-skin-main rounded p-lg mx-auto mt-[40px]'>
      <div className='flex items-center justify-center'>
        <a href='/' className='no-underline'>
          <Logo />
        </a>
      </div>

      <h1 className='text-md text-skin-secondary font-bold text-center mt-xs'>
        Reset password
      </h1>

      <form className='mt-lg' onSubmit={submit}>
        <InputField
          containerClassName='mt-lg'
          id='password'
          type='password'
          label='New password'
          error={formState.errors.password?.message}
          disabled={isLoading}
          {...register('password')}
        />
        <InputField
          containerClassName='mt-lg'
          id='password_confirmation'
          type='password'
          label='Confirm new password'
          disabled={isLoading}
          error={formState.errors.password_confirmation?.message}
          {...register('password_confirmation')}
        />

        <button
          type='submit'
          className='button button-primary w-full rounded-full py-sm mt-lg'
          disabled={isLoading}
        >
          Change my password
        </button>
      </form>
    </main>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    props: {
      title: 'Reset password',
      // token: params?.token,
    },
  };
};
