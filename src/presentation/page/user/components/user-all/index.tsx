import { useRequest } from 'ahooks';
import { List, Skeleton, Divider, Avatar, Button } from 'antd';
import clsx from 'classnames';
import { observer } from 'mobx-react';
import React, { FC, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useHistory } from 'react-router-dom';
import { getAllUser, UserData, focusUser } from '@/application/service/user';
import BodyScreen from '@/presentation/components/body-screen';
import useAuth from '@/presentation/store/use-auth';
import styles from '../../index.module.scss';

const defaultPage = 1;
const defaultPageSize = 10;
    
const UserAll: FC = observer(() => {
  const [userList, setUserList] = useState<UserData[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: defaultPage, pageSize: defaultPageSize });
  const [total, setTotal] = useState(0);
  const { user, loginUser } = useAuth();
  const history = useHistory();

  const { run: focusUserRun } = useRequest(focusUser, {
    manual: true,
    onSuccess: () => {
      loginUser();
    },
  })

  const handleGetUser = async (props: { page: number, pageSize: number }) => {
    const { page, pageSize } = props;
    try {
      const data = await getAllUser({
        page,
        pageSize,
      });
      if (pagination.page === 1) {
        setUserList(data.data.list)
      } else {
        setUserList([...userList, ...data.data.list]);
      };
      setLoading(false);
      setTotal(data.data.total);
    } catch (err) {
      console.error(err, 'get-all-user');
      setUserList([]);
    };
  };

  const handleFocusClick = (id: number) => {
    focusUserRun({
      userId: `${user?.id}`,
      userFocus: `${id}`,
    });
  };
    
  useEffect(() => {
    handleGetUser(pagination);
  }, [pagination, user]);

  return (
    <BodyScreen className={styles.userAll}>
      {
        loading ? <Skeleton /> : (
          <InfiniteScroll
            dataLength={userList.length}
            hasMore={userList.length < total}
            next={() => setPagination({ ...pagination, page: pagination.page + 1 })}
            loader={<Skeleton avatar paragraph={{ rows: 1 }} active />}
            endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
            scrollableTarget='userAll'
          >
            <List
              dataSource={userList}
              renderItem={item => (
                <List.Item className={styles.userItem}>
                  <List.Item.Meta
                    avatar={<Avatar src={item.avatar} onClick={() => history.push(`/user/${item.id}`)}>{item.cname}</Avatar>}
                    title={item.cname}
                    description={item.description}
                                        
                  />
                  {
                    item.id !== user?.id && (
                      (user?.userFocus?.includes(`${item.id}`) ?
                        <Button
                          className={clsx(styles.hasFocusBtn, styles.focusBtn)}
                          onClick={() => handleFocusClick(item.id)}
                        >已关注</Button> : <Button
                          type='primary'
                          className={styles.focusBtn}
                          onClick={() => handleFocusClick(item.id)}
                        >关注</Button>))
                  }
                </List.Item>
              )}
            />
          </InfiniteScroll>
        )
      }
    </BodyScreen>
  );
});

export default UserAll;
