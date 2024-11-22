import { Card, Space } from 'antd';
import { observer } from 'mobx-react';
import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { UserData } from '@/application/service/user';
import UserAvatar from "@/presentation/components/user-avatar";
import useAuth from '@/presentation/store/use-auth';
import styles from './index.module.scss';

interface Props {
  user?: UserData | null;
  showGlod?: boolean;
  [key: string]: any;
}
const UserCard: FC<Props> = (props) => {
  const { user, children, showGlod } = props;
  const history = useHistory();
  const { isLogin } = useAuth();
  const handleClick = () => {
    if (isLogin) {
      history.push('/user-gold');
    }
  };

  return (
    user ? (
      <div className={styles.userCard}>
        <Card className={styles.userCardContent} actions={[
          <Space direction='vertical' size={0}>
          评论
            <span className={styles.num}>{(user?.reply?.length || 0) + (user?.review?.length || 0)}</span>
          </Space>,
          <Space direction='vertical' size={0}>
          话题
            <span className={styles.num}>{user?.release?.length || 0}</span></Space>,
          <Space direction='vertical' size={0}>
          粉丝
            <span className={styles.num}>{user?.userFanc?.length || 0}</span></Space>,
          <Space direction='vertical' size={0}>
          关注
            <span className={styles.num}>{user?.userFocus?.length || 0}</span></Space>,
        ]}>
          <Space direction='vertical' style={{ textAlign: 'center', width: '100%' }}>
            <UserAvatar
              img={user?.avatar}
              size={user?.currentBorder ? 120 : 96}
              onClick={() => history.push(`/user/${user?.id}`)}
              currentBorder={user?.currentBorder}
            />
            <span>{user?.cname}</span>
            <span>{user?.description}</span>
            {children}
          </Space>
        </Card>
        {
          showGlod && <div className={styles.gold} onClick={handleClick}>
            金币余额：<div className={styles.goldBalance}>
              🪙 {user.goldBalance}
            </div>
          </div>
        }
      </div>
    ) : null
  );
};

export default observer(UserCard);
