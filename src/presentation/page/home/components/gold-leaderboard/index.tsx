import { Avatar, Card, Space } from 'antd';
import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { UserData } from '@/application/service/user';
import styles from './index.module.scss'

const GoldLeaderboard: FC<{ list?: UserData[] }> = (props) => {
  const { list } = props;
  const history = useHistory();

  return (
    <div className={styles.goldLeaderboard}>
      <Card title='🪙 财富榜'
        // actions={[
        //   <Button type='link' onClick={() => history.push('/user-all')}>完整榜单&gt;&gt;</Button>
        // ]}
      >
        {
          list?.map((item) => (
            <Space className={styles.goldLeaderboardSpace} key={item.id}>
              <Avatar src={item.avatar} size={45} onClick={() => history.push(`/user/${item.id}`)}>{item.cname[0].toLocaleUpperCase()}</Avatar>
              <div>
                <p className={styles.title}>{item.cname || item.username}</p>
                <div className={styles.gold} onClick={() => history.push('/user-gold')}>
                  金币余额：<div className={styles.goldBalance}>
                    🪙 {item.goldBalance}
                  </div>
                </div>
              </div>
            </Space>
          ))
        }
      </Card>
    </div>
  );
};

export default GoldLeaderboard;
