import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import InputField from 'components/common/InputField';
import Radio from 'components/common/Radio';
import type { FormEvent } from 'react';
import type { AxiosResponse, AxiosError } from 'axios';
import type { Variables, ErrorData } from 'types/form';

type FieldKey =
  | 'name'
  | 'email'
  | 'username'
  | 'password'
  | 'password_confirmation'
  | 'birth_date'
  | 'gender';

type FieldValue = string | 'Male' | 'Female' | null;

const fields = {
  name: '',
  email: '',
  username: '',
  password: '',
  password_confirmation: '',
  birth_date: '',
  gender: null,
};

export default function Register() {
  const [isSuccessful, setIsSuccessful] = useState<boolean>(false);
  const {
    register,
    watch,
    getValues,
    setError,
    clearErrors,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: fields,
  });

  const { gender } = watch();

  const { mutate, isLoading } = useMutation<
    AxiosResponse,
    AxiosError<ErrorData<FieldKey>>,
    Variables<FieldKey, FieldValue>
  >(['create'], {
    onSuccess() {
      setIsSuccessful(true);
      clearErrors();
      reset();
      window.scrollTo(0, 0);
    },
    onError(error) {
      if (error.response) {
        const err = error.response.data.errors;
        const keys = Object.keys(err);

        clearErrors();

        keys.forEach((key) => {
          const k = key as keyof typeof fields;

          setError(k, {
            type: 'manual',
            message: err[k][0],
          });
        });
      }
    },
  });

  const submit = async (event: FormEvent) => {
    event.preventDefault();

    mutate({
      url: '/register',
      data: getValues(),
    });
  };

  return (
    <>
      {isSuccessful && (
        <p className='bg-success-transparent paragraph-sm text-success-dark p-sm border border-success rounded mt-lg'>
          Registration successful. Please check for the verification code that
          was sent to your email address.
        </p>
      )}

      <form className='mt-sm' onSubmit={submit}>
        <InputField
          type='text'
          label='Name'
          error={errors.name?.message}
          disabled={isLoading}
          {...register('name')}
        />

        <InputField
          containerClassName='mt-lg'
          type='email'
          label='Email address'
          placeholder='sample@domain.com'
          error={errors.email?.message}
          disabled={isLoading}
          {...register('email')}
        />

        <InputField
          containerClassName='mt-lg'
          type='text'
          label='Username'
          error={errors.username?.message}
          disabled={isLoading}
          {...register('username')}
        />

        <InputField
          containerClassName='mt-lg'
          type='password'
          label='Password'
          error={errors.password?.message}
          disabled={isLoading}
          {...register('password')}
        />

        <InputField
          containerClassName='mt-lg'
          type='password'
          label='Confirm password'
          error={errors.password_confirmation?.message}
          disabled={isLoading}
          {...register('password_confirmation')}
        />

        <InputField
          containerClassName='mt-lg'
          className='cursor-pointer'
          type='date'
          label='Birth date'
          error={errors.birth_date?.message}
          disabled={isLoading}
          {...register('birth_date')}
        />

        <section className='mt-lg'>
          <span className='block text-skin-primary text-md font-bold'>
            Gender
          </span>

          <div className='flex items-center mt-xs'>
            <Radio
              className='flex items-center cursor-pointer'
              id='male'
              label='Male'
              value='Male'
              checked={gender === 'Male'}
              disabled={isLoading}
              {...register('gender')}
            />

            <Radio
              className='flex items-center cursor-pointer ml-xl'
              id='female'
              label='Female'
              value='Female'
              checked={gender === 'Female'}
              disabled={isLoading}
              {...register('gender')}
            />
          </div>

          {!!errors.gender && (
            <p className='text-danger text-sm mt-xs mb-0'>
              {errors.gender.message}
            </p>
          )}
        </section>

        <button
          type='submit'
          className='button button-primary w-full rounded-full py-sm mt-lg'
          disabled={isLoading}
        >
          Create account
        </button>
      </form>
    </>
  );
}

export const getServerSideProps = () => ({
  props: {
    title: 'Create an account',
    formTitle: 'Register an account',
  },
});
