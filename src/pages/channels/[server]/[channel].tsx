import DirectMessages from '@/components/DirectMessages';
import Layout from '@/components/layout';
import { NextPageWithLayout } from '@/pages/_app';
import { trpc } from '@/utils/trpc';
import { useRouter } from 'next/router';
import React, { ReactElement, useState } from 'react';

const Channel: NextPageWithLayout = () => {
  const router = useRouter();
  const { server, channel } = router.query;

  return (
    <div>
      Channel:{channel}Server:{server}
    </div>
  );
};

const getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

Channel.getLayout = getLayout;
export default Channel;
