import useUrlState from '@ahooksjs/use-url-state';
import { useRequest } from 'ahooks';
import { Card, Tabs, Button, Empty, Spin } from 'antd';
import { observer } from 'mobx-react';
import React, { FC, useState, useEffect } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { ReleaseOrderBy } from '@/application/enum/release';
import { getHomeList, ReleaseData, getTagsList } from '@/application/service/home';
import { authorList, goldLeaderboard } from '@/application/service/user';
import BodyScreen from '@/presentation/components/body-screen';
import UserCard from '@/presentation/components/user-card';
import { ReleaseOrderByList } from '@/presentation/config/release';
import useAuth from '@/presentation/store/use-auth';
import GoldLeaderboard from './components/gold-leaderboard';
import HomeList from './components/home-list';
import Leaderboard from './components/leaderboard';
import styles from './index.module.scss';

const { TabPane } = Tabs;
const DEFAULT_PAGINATION = { page: 1, pageSize: 10 };
let tab = ReleaseOrderBy.UpdateTime;

const Home: FC = () => {
  const history = useHistory();
  const location = useLocation();
  const { user, isLogin } = useAuth();
  const searchParams = new URLSearchParams(location.search);
  const urlTab = searchParams.get('tab') as ReleaseOrderBy || ReleaseOrderBy.UpdateTime;
  const [orderBy, setOrderBy] = useState(urlTab);
  const [data, setData] = useState<ReleaseData[]>([]);
  const [pagination, setPagination] = useState(DEFAULT_PAGINATION);
  const [, setState] = useUrlState<{ tab: ReleaseOrderBy }>({ tab: urlTab });
  const { data: listData, loading } = useRequest(() => getHomeList({
    page: pagination.page,
    pageSize: pagination.pageSize,
    orderBy: orderBy,
    username: orderBy === ReleaseOrderBy.UserFocus ? user?.username : undefined,
    isTag: !ReleaseOrderByList.includes(orderBy),
  }), {
    ready: orderBy === ReleaseOrderBy.UserFocus ? !!user?.username : true,
    refreshDeps: [orderBy, pagination],
    onSuccess: (dataList) => {
      if (tab === orderBy) {
        setData([...data, ...dataList?.data?.list || []]);
      } else {
        setData(dataList?.data?.list);
        tab = orderBy;
      }
    },
  });

  const { data: authorListData, loading: authorListLoading } = useRequest(() => authorList());

  const { data: goldLeaderboardData } = useRequest(() => goldLeaderboard());
    
  const { data: tagsListData, loading: getTagsListLoading } = useRequest(() => getTagsList());

  const handleTabsChange = (key: string) => {
    setOrderBy(key as ReleaseOrderBy);
    setPagination(DEFAULT_PAGINATION);
    setState({ tab: key });
  };

  const handleSignIn = async () => {
    history.push('/user-gold')
  }

  useEffect(() => {
    console.log(history.action, 'action');
  }, []);

  return (
    <Spin spinning={getTagsListLoading || authorListLoading}>
      <BodyScreen className={styles.home}>
        <div>
          <Tabs tabPosition='left' onChange={handleTabsChange} className={styles.leftTabs} activeKey={orderBy}>
            <TabPane key='updateTime' tab='最新发布' />
            <TabPane key='browse' tab='浏览量' />
            <TabPane key='focus' tab='点赞量' />
            {isLogin && <TabPane key='userFocus' tab='关注的人' />}
            {
              tagsListData?.data?.map(item => (
                <TabPane key={item.tag} tab={item.tag} />
              ))
            }
          </Tabs>
        </div>
        <div className={styles.list}>
          {
            data?.length ? data?.map(item => (
              <Card key={item.id} className={styles.package} onClick={() => history.push(`/detail/${item.id}`)}>
                <HomeList release={item} />
              </Card>
            )) : <Card><Empty description='当前暂无发布内容' /></Card>
          }
          {
            (listData?.data?.total || 0) > data.length && (
              <Button
                onClick={() => setPagination({ page: pagination.page + 1, pageSize: pagination.pageSize })}
                loading={loading}
                disabled={loading}
                className={styles.loadingBtn}
                type='primary'
              >
                查看更多
              </Button>
            )
          }
        </div>
        <div className={styles.right}>
          {!user?.isSignIn && user && (
            <div className={styles.isSignIn} onClick={handleSignIn}>
              <span>🎁</span>
              <span className={styles.isSignInText}>签到领取金币！！！</span>
            </div>
          )}
          <UserCard user={user} showGlod />
          <GoldLeaderboard list={goldLeaderboardData?.data} />
          <Leaderboard list={authorListData?.data} />
        </div>
      </BodyScreen>
    </Spin>
  );
};

export default observer(Home);
