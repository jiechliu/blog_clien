import { Avatar, Button, Card, Space } from 'antd';
import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { UserData } from '@/application/service/user';
import styles from './index.module.scss'

const Leaderboard: FC<{ list?: UserData[] }> = (props) => {
  const { list } = props;
  const history = useHistory();
  list?.sort((a, b) => (b.release?.length || 0) - (a.release?.length || 0));

  return (
    <div className={styles.leaderboard}>
      <Card title='🎖️作者榜' actions={[
        <Button type='link' onClick={() => history.push('/user-all')}>完整榜单&gt;&gt;</Button>
      ]}>
        {
          list?.map((item) => (
            <Space className={styles.leaderboardSpace} key={item.id}>
              <Avatar src={item.avatar} size={45} onClick={() => history.push(`/user/${item.id}`)}>{item.cname[0].toLocaleUpperCase()}</Avatar>
              <div>
                <p className={styles.title}>{item.cname || item.username}</p>
                <p style={{ color: '#777d81', fontSize: '12px' }}>{item.description}</p>
              </div>
            </Space>
          ))
        }
      </Card>  
    </div>
  );
};

export default Leaderboard;
