import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import InputField from 'components/common/InputField';
import axios from 'lib/axios';
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
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    await axios.get(`/reset-password/${params?.token}`);

    return {
      props: {
        title: 'Reset password',
        formTitle: 'Reset password',
        token: params?.token,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};
