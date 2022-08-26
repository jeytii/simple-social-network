import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import InputField from 'components/common/InputField';
import Alert from 'components/common/Alert';
import type { FormEvent } from 'react';
import type { AxiosError, AxiosResponse } from 'axios';

interface AlertNotification {
  status: number;
  message: string;
}

interface Variables {
  url: string;
  data: {
    email: string;
  };
}

interface ErrorData {
  message: string;
  errors: {
    email: string[];
  };
}

export default function ForgotPassword() {
  const [alertNotification, setAlertNotification] =
    useState<AlertNotification | null>(null);
  const { register, getValues, setError, clearErrors, reset, formState } =
    useForm({
      defaultValues: { email: '' },
    });

  const { mutate, isLoading } = useMutation<
    AxiosResponse,
    AxiosError<ErrorData>,
    Variables
  >(['create'], {
    onSuccess({ data }) {
      setAlertNotification(data);
      clearErrors();
      reset();
    },
    onError(error) {
      if (error.response) {
        const { status, data } = error.response;

        clearErrors();

        if (status === 422) {
          setAlertNotification(null);
          setError('email', {
            type: 'manual',
            message: data.errors.email[0],
          });
        } else {
          setAlertNotification({
            status,
            message: data.message,
          });
        }
      }
    },
  });

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    mutate({
      url: '/forgot-password',
      data: getValues(),
    });
  };

  return (
    <>
      {alertNotification && (
        <Alert
          type={alertNotification.status === 200 ? 'success' : 'error'}
          message={alertNotification.message}
          className='mt-sm'
        />
      )}

      <form className='mt-sm' onSubmit={submit}>
        <InputField
          id='email'
          type='email'
          label='Email address'
          error={formState.errors.email?.message}
          disabled={isLoading}
          {...register('email')}
        />

        <button
          type='submit'
          className='button button-primary w-full rounded-full py-sm mt-lg'
          disabled={isLoading}
        >
          Send password reset request
        </button>
      </form>
    </>
  );
}

export const getServerSideProps = () => ({
  props: {
    title: 'Forgot password',
    formTitle: 'Forgot password',
  },
});
