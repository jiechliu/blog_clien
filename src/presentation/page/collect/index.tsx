import { useRequest } from 'ahooks';
import { Skeleton, List, Divider, Space, Card } from 'antd';
import { observer } from 'mobx-react';
import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { getIdRelease, collectRelease } from '@/application/service/release';
import BodyScreen from '@/presentation/components/body-screen';
import useAuth from '@/presentation/store/use-auth';
import HomeList from '../home/components/home-list';
import styles from './index.module.scss';

const Collect: FC = () => {
  const { user, isLogin, loginUser } = useAuth();
  const { push } = useHistory();
  const { data, loading, run: getIdReleaseRun } = useRequest(() => getIdRelease(user?.collection ?? []), {
    ready: !!isLogin,
  });
    
  const { run } = useRequest(collectRelease, {
    manual: true,
    onSuccess: async () => {
      await loginUser();
      getIdReleaseRun();
    }
  });
    
  const list = data?.data?.list || [];

  return (
    <BodyScreen>
      <Card className={styles.collect}>
        {
          loading
            ? <Skeleton />
            : (
              <List
                dataSource={list}
                renderItem={(item) => (
                  <Space direction='vertical' style={{ width: '100%' }} onClick={() => push(`/detail/${item.id}`)}>
                    <HomeList release={item} showDelete onDelete={run} />
                    <Divider />
                  </Space>
                )}
              />
            )
        }
      </Card>
    </BodyScreen>
  );
};

export default observer(Collect);
