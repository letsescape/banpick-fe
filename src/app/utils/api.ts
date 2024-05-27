'use server';

import { cookies } from 'next/headers';

import { TOKEN_KEY } from '@/app/constants/auth';

const fetchApi = async <Response>(
  url: string,
  options: RequestInit = {}
): Promise<Response> => {
  const cookieStore = cookies();
  const requestUrl = getRequestUrl({
    url,
    method: options?.method,
    query: options?.body as string,
  });
  const hasAccessToken = cookieStore.has(TOKEN_KEY);

  try {
    const res = await fetch(requestUrl, {
      ...options,
      headers: {
        ...options.headers,
        'Content-Type': 'application/json',
        Authorization: hasAccessToken
          ? `Bearer ${cookieStore.get(TOKEN_KEY)?.value}`
          : '',
      },
    });

    if (!res.ok) {
      throw new Error(res.statusText);
    }

    return res.json();
  } catch (err: unknown) {
    throw new Error((err as Error).message);
  }
};

const updateObjectToQueryString = (obj: string) => {
  try {
    const params = new URLSearchParams();

    Object.entries(JSON.parse(obj)).forEach(([key, value]) => {
      params.set(key, String(value));
    });

    return params.toString();
  } catch {
    return '';
  }
};

const getRequestUrl = ({
  url,
  query,
  method,
}: {
  url: string;
  query?: string;
  method?: string;
}) => {
  let requestUrl = '';

  if (method?.toLowerCase() === 'get' && query) {
    requestUrl = `${url}?${updateObjectToQueryString(query)}`;
  }

  if (!url.startsWith('http')) {
    requestUrl = `${process.env.APP_API_URL}${url}`;
  }

  return requestUrl;
};

export { fetchApi };
