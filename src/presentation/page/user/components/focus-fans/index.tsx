import { UserOutlined } from '@ant-design/icons'
import { Card, Avatar, Divider, List, Button, Modal } from 'antd';
import clsx from 'classnames';
import { observer } from 'mobx-react';
import React, { FC, useState } from 'react';
import { useHistory } from 'react-router-dom';
import { UserFancFocus, UserFancFocusLabel } from '@/application/enum/user'
import { UserData } from '@/application/service/user';
import styles from '../../index.module.scss';

interface UserCardProps {
    type: UserFancFocus,
    list?: UserData[],
    user: UserData | null,
    handleFocusClick: (id: number) => void,
    focusBtnLoading: boolean,
}
const UserCard: FC<UserCardProps> = (props) => {
  const { type, list, user, handleFocusClick, focusBtnLoading } = props;
  const history = useHistory();
  const [userType, setUserType] = useState(UserFancFocus.Fanc);
  const [visible, setVisible] = useState(false);

  return (
    <Card className={styles.userInfo}>
      <h3>{`${UserFancFocusLabel[type]}(${list?.length ?? 0})`}</h3>
      <Divider orientationMargin={12} />
      {
        list?.length ? (
          <React.Fragment>
            <List
              itemLayout='horizontal'
              dataSource={list?.slice(0, 10)}
              renderItem={(item) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={<Avatar
                      icon={<UserOutlined />}
                      src={item.avatar}
                      shape='circle'
                      size={40}
                      onClick={() => history.push(`/user/${item.id}`)}
                    />}
                    title={<span>{item.cname || item.username}</span>}
                    description={item.description}
                  />
                  {
                    item.id !== user?.id && (user?.userFocus?.includes(`${item.id}`) ?
                      <Button
                        className={clsx(styles.hasFocusBtn, styles.focusBtn)}
                        onClick={() => handleFocusClick(item.id)}
                        loading={focusBtnLoading}
                      >已关注</Button> : <Button
                        type='primary'
                        className={styles.focusBtn}
                        onClick={() => handleFocusClick(item.id)}
                        loading={focusBtnLoading}
                      >关注</Button>)
                  }
                </List.Item>
              )}
            />
            {list?.length > 10 && (
              <Button
                type='primary'
                className={styles.moreBtn}
                onClick={() => {
                  setUserType(type);
                  setVisible(true);
                }}
              >
                                查看更多
              </Button>
            )}
          </React.Fragment>
        ) : <p className={styles.empty}>没有更多内容了～</p>
      }
      <Modal
        title={UserFancFocusLabel[userType]}
        visible={visible}
        onCancel={() => setVisible(false)}
        footer={null}
      >
        <List
          itemLayout='horizontal'
          dataSource={list}
          renderItem={(item) => (
            <List.Item>
              <List.Item.Meta
                avatar={<Avatar icon={<UserOutlined />} src={item.avatar} shape='circle' size={40} />}
                title={<span>{item.cname || item.username}</span>}
                description={item.description}
              />
            </List.Item>
          )}
        />
      </Modal>
    </Card>
  );
};

export default observer(UserCard);