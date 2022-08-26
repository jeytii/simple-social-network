import { GetServerSidePropsContext } from 'next';
import axios from './axios';

export default async function authenticate(
  { req }: GetServerSidePropsContext,
  meta: Record<string, string>
) {
  const { token, user } = req.cookies;
  const { data } = await axios.get('/api/notifications/count', {
    params: {
      authToken: token,
    },
  });

  return {
    props: {
      isPrivate: true,
      notificationsCount: data.data,
      user,
      ...meta,
    },
  };
}
