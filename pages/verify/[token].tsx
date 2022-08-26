import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import InputField from 'components/common/InputField';
import Alert from 'components/common/Alert';
import axios from 'lib/axios';
import type { GetServerSideProps } from 'next';
import type { FormEvent } from 'react';
import type { AxiosError, AxiosResponse } from 'axios';
import type { Variables, ErrorData } from 'types/form';

export default function Verification({ token }: { token: string }) {
  const [alertError, setAlertError] = useState<string | null>(null);
  const { register, getValues, setError, clearErrors, formState } = useForm({
    defaultValues: { code: '', token },
  });

  const { mutate, isLoading } = useMutation<
    AxiosResponse,
    AxiosError<ErrorData<'code'>>,
    Variables<'code'>
  >(['update'], {
    onSuccess({ data }) {
      Cookies.set('token', data.token);
      window.location.href = '/home';
    },
    onError(error) {
      if (error.response) {
        const { status, data } = error.response;

        if (status === 422) {
          setAlertError(null);
          setError('code', {
            type: 'manual',
            message: data.errors.code[0],
          });
        } else {
          clearErrors('code');
          setAlertError(data.message);
        }
      }
    },
  });

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    mutate({
      url: '/verify',
      data: getValues(),
    });
  };

  return (
    <>
      {alertError && (
        <Alert type='error' message={alertError} className='mt-sm' />
      )}

      <form className='mt-sm' onSubmit={submit}>
        <InputField
          id='code'
          type='number'
          label='6-digit verification code'
          error={formState.errors.code?.message}
          disabled={isLoading}
          {...register('code')}
        />
        <button
          type='submit'
          className='button button-primary w-full rounded-full py-sm mt-lg'
          disabled={isLoading}
        >
          Verify my account
        </button>
      </form>
    </>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    await axios.get(`/verify/${params?.token}`);

    return {
      props: {
        title: 'Verify account',
        formTitle: 'Verify your account',
        token: params?.token,
      },
    };
  } catch (err) {
    return {
      notFound: true,
    };
  }
};
