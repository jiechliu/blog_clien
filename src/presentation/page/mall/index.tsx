import { useRequest } from 'ahooks';
import { Spin, Row, Col, Card, Space, Empty, message } from 'antd';
import classNames from 'classnames';
import {observer } from 'mobx-react';
import React, { FC } from 'react';
import { getBorderAll, Border, purchase, putBorder } from '@/application/service/mall';
import BodyScreen from '@/presentation/components/body-screen';
import { RfixModalConfirm } from '@/presentation/components/modal';
import useAuth from '@/presentation/store/use-auth';
import styles from './index.module.scss';

const Mall: FC = () => {
  const { loading, data } = useRequest(() => getBorderAll());
  const { user } = useAuth();
  const isBuy = (item: Border) => {
    return user?.userBodrers?.includes(`${item.id}`);
  }

  const { run: putchaseRun } = useRequest(putBorder, {
    manual: true,
    onSuccess: () => {
      message.success('购买头像框成功！');
    },
  });

  const handlePurchase = (item: Border) => {
    if (item.price <= 0) return;
    RfixModalConfirm({
      title: '购买头像框',
      content: `确认购买${item.name}吗？`,
      onOk: async () => {
        await purchase(item.id);
        message.success('购买头像框成功！');
        RfixModalConfirm({
          title: '佩戴头像框',
          content: '是否佩戴此头像框',
          onOk: () => {
            putchaseRun(item.id);
          },
        });
      },
    });
  };

  const listLength = data?.data?.length || 0;

  const list: Border[] = listLength < 5 ? [...(data?.data || []), ...Array(5 - listLength).fill(1).map((_, index) => ({
    id: index + 5,
    name: '敬请期待！',
    url: '',
    price: 0,
  }))] : data?.data || [];

  return (
    <BodyScreen className={styles.mall}>
      <Spin spinning={loading}>
        <Row gutter={[20, 20]}>
          {
            list.map(item => (
              <Col key={item.id} span={6}>
                <Card className={classNames(styles.outBox, (item.price <= 0 || isBuy(item))? styles.disabled : '')} actions={[
                  item.price <= 0 ? '无该商品' : <span onClick={() => !isBuy(item) && handlePurchase(item)}>{isBuy(item) ? '已购买' : `${item.price}金币`}</span>
                ]}>
                  <div className={styles.itemBig}>
                    <Space direction={'vertical'} size={10} align={'center'}>
                      {
                        item.url
                          ? <img src={item.url} width='100%' alt={''} />
                          : <Empty description={false} style={{ minHeight: '220px', display: 'flex', alignItems: 'center' }} />
                      }
                      <span>{item.name}</span>
                    </Space>
                  </div>
                </Card>
              </Col>
            ))
          }
        </Row>
      </Spin>
    </BodyScreen>
  );
};

export default observer(Mall);
