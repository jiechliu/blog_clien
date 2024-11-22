import { HomeOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Breadcrumb, Button, message, Table } from 'antd';
import { ColumnsType } from 'antd/lib/table';
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { GoldType, GoldTypeLabel } from '@/application/enum/user';
import { signIn, goldAll, Gold } from '@/application/service/user';
import BodyScreen from '@/presentation/components/body-screen';
import UserCard from '@/presentation/components/user-card';
import useAuth from '@/presentation/store/use-auth';
import styles from './index.module.scss';

const Glod: FC = () => {
  const { user, loginUser } = useAuth();
  const { push } = useHistory();

  const { data, loading } = useRequest(() => goldAll(), {
    ready: !!user,
    refreshDeps: [user]
  })

  const handleSignIn = async () => {
    if (user?.isSignIn) return;

    try {
      await signIn();
      await loginUser();
      message.success('签到成功！')
    } catch {}
  }

  const columns: ColumnsType<Gold> = [
    {
      title: '时间',
      dataIndex: 'createTime',
      width: 230,
      render: (time) => <span className={styles.time}>{moment(time).format('YYYY-MM-DD HH:mm:ss')}</span>,
    },
    {
      title: '类型',
      dataIndex: 'type',
      width: 116,
      render: (type: GoldType) => <span className={styles.type}>{GoldTypeLabel[type]}</span>
    },
    {
      title: '数额',
      dataIndex: 'amount',
      width: 70,
      render: (amount: number) => (
        <div style={{ color: amount > 0 ? '#0aa31c' : '#ff3c00', fontWeight: 500 }}>{amount.toFixed(1)}</div>
      )
    },
    {
      title: '余额',
      dataIndex: 'balance',
      width: 80,
      render: (balance: number) => <span className={styles.balance}>{balance.toFixed(1)}</span>
    },
    {
      title: '描述',
      render: (_, record) => {
        if (record.type === GoldType.Init) {
          return <span className={styles.description}>
            获得初始资本 1000 金币
          </span>
        }
        if (record.type === GoldType.Login) {
          return <span className={styles.description}>
            {moment(record.createTime).format('YYYYMMDD')} 的每日登录奖励 {record.amount} 金币
          </span>
        }
        if (record.type === GoldType.CreateTheme) {
          return <div className={styles.description}>
            <span>创建了长度为 {record.title.length} 长度的主题</span>
            <span style={{ color: '#999', padding: '0 10px' }}>&gt;</span>
            <span onClick={() => push(`/detail/${record.releaseId}`)} className={styles.underline}>
              {record.title}
            </span>
          </div>
        }
        if (record.type === GoldType.CreateReply) {
          return <div className={styles.description}>
            <span>创建了长度为 {record?.description?.length} 的回复</span>
            <span style={{ color: '#999', padding: '0 10px' }}>&gt;</span>
            <span onClick={() => push(`/detail/${record.releaseId}`)} className={styles.underline}>
              {record.title}
            </span>
          </div>
        }
        if (record.type === GoldType.ThemeReply) {
          return <div className={styles.description}>
            <span>收到 <span className={styles.underline} onClick={() => push(`/user/${record?.replyUser?.id}`)}>
              {record?.replyUser?.cname || record?.replyUser?.username}
            </span> 的回复</span>
            <span style={{ color: '#999', padding: '0 10px' }}>&gt;</span>
            <span onClick={() => push(`/detail/${record.releaseId}`)} className={styles.underline}>
              {record.title}
            </span>
          </div>
        }
        if (record.type === GoldType.SystemGift) {
          return <span className={styles.description}>
            系统赠送 {record.amount} 金币
          </span>
        }
        if (record.type === GoldType.PurchaseBorder) {
          return <span className={styles.description}>
            {`${moment(record.createTime).format('YYYYMMDD')}${record.title}`}
          </span>
        }
        return null;
      }
    },
  ]

  return (
    <BodyScreen className={styles.userGold}>
      <div className={styles.userGoldContent}>
        <Breadcrumb className={styles.breadcrumb}>
          <Breadcrumb.Item href='/'><HomeOutlined /></Breadcrumb.Item>
          <Breadcrumb.Item>账户余额</Breadcrumb.Item>
        </Breadcrumb>
        <div className={styles.userGoldBox}>
          <div className={styles.gold}>
            <div style={{ marginBottom: '10px'}}>当前账户余额</div>
            <div className={styles.goldBalance}>🪙 {user?.goldBalance}</div>
          </div>
          <Button className={styles.userGoldBtn} onClick={handleSignIn}>
            {user?.isSignIn ? '已签到' : '签到获取金币'}
          </Button>
          <Table
            loading={loading}
            dataSource={data?.data?.list || []}
            columns={columns}
            pagination={{ hideOnSinglePage: true, pageSize: 20 }}
            className={styles.goldTable}
          />
        </div>
      </div>
      <UserCard user={user} showGlod />
    </BodyScreen>
  );
};

export default observer(Glod);
