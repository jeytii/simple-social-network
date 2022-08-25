import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import InputField from 'components/common/InputField';
import Alert from 'components/common/Alert';
import Logo from 'components/common/Logo';
import type { FormEvent } from 'react';
import type { AxiosResponse, AxiosError } from 'axios';
import type { Variables, ErrorData } from 'types/form';

type LoginVariables = 'username' | 'password';
type UnauthorizedError = { username: string } | null;

interface LoginErrorData extends ErrorData<LoginVariables> {
  data: UnauthorizedError;
}

const fields = {
  username: '',
  password: '',
};

export default function Index() {
  const [alertError, setAlertError] = useState<string | null>(null);
  const [codeResent, setCodeResent] = useState<boolean>(false);
  const [unauthorizedError, setUnauthorizedError] =
    useState<UnauthorizedError>(null);

  const { register, getValues, setError, clearErrors, formState } = useForm({
    defaultValues: fields,
  });

  const { mutate: login, isLoading: loadingLogin } = useMutation<
    AxiosResponse,
    AxiosError<LoginErrorData>,
    Variables<LoginVariables>
  >(['create'], {
    onSuccess({ data }) {
      Cookies.set('token', data.token);
      Cookies.set('user', JSON.stringify(data.user));
      window.location.href = '/home';
    },
    onError(error) {
      if (error.response) {
        const { status, data } = error.response;

        clearErrors();

        if (status === 422) {
          const keys = Object.keys(data.errors);

          if (alertError) {
            setAlertError(null);
          }

          keys.forEach((key) => {
            const k = key as keyof typeof fields;

            setError(k, {
              type: 'manual',
              message: data.errors[k][0],
            });
          });
        } else if (status === 401) {
          setCodeResent(false);
          setAlertError(null);
          setUnauthorizedError(data.data);
        } else {
          setUnauthorizedError(null);
          setAlertError(data.message);
        }
      }
    },
  });

  const { mutate: resend, isLoading: loadingResend } = useMutation<
    unknown,
    unknown,
    Variables<'username'>
  >(['create'], {
    onSuccess() {
      setUnauthorizedError(null);
      setCodeResent(true);
    },
  });

  const submit = (event: FormEvent) => {
    event.preventDefault();

    login({
      url: '/login',
      data: getValues(),
    });
  };

  const resendVerificationCode = async () => {
    resend({
      url: '/verify/resend',
      data: {
        username: unauthorizedError?.username as string,
      },
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
        Sign in to your account
      </h1>

      {!!codeResent && (
        <Alert
          className='paragraph-sm mt-lg'
          type='success'
          message='A verification code has been successfully sent to your email address.'
        />
      )}

      {!!alertError && (
        <Alert className='text-sm mt-lg' type='error' message={alertError} />
      )}

      {!!unauthorizedError && (
        <Alert className='paragraph-sm mt-lg' type='error'>
          Please verify your account first before logging in. If you did not
          receive a verification code,
          <button
            className='underline cursor-pointer  disabled:cursor-not-allowed disabled:text-danger-light'
            type='button'
            disabled={loadingResend}
            onClick={resendVerificationCode}
          >
            click here
          </button>
          .
        </Alert>
      )}

      <form className='py-lg' onSubmit={submit}>
        <InputField
          type='text'
          label='Username or email address'
          error={formState.errors.username?.message}
          disabled={loadingLogin}
          {...register('username')}
        />

        <InputField
          containerClassName='mt-lg'
          type='password'
          label='Password'
          error={formState.errors.password?.message}
          disabled={loadingLogin}
          {...register('password')}
        />

        <button
          type='submit'
          className='button button-primary w-full rounded-full py-sm mt-lg'
          disabled={loadingLogin}
        >
          Sign in
        </button>
      </form>

      <div className='text-center'>
        <a
          className='inline-block text-primary-dark text-md no-underline cursor-pointer hover:underline'
          href='/register'
        >
          Create an account
        </a>
      </div>

      <div className='text-center mt-xs'>
        <a
          className='inline-block text-skin-secondary text-md no-underline cursor-pointer hover:underline'
          href='/forgot-password'
        >
          Forgot password
        </a>
      </div>
    </main>
  );
}

export const getServerSideProps = () => ({
  props: {
    title: "JT's Social Network",
  },
});
