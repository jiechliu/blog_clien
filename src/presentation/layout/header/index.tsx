import { PlusOutlined, FileTextOutlined, PictureOutlined } from '@ant-design/icons';
import { Space, Button, Avatar, Dropdown, Menu, Popover, Input } from 'antd';
import { observer } from 'mobx-react';
import React, { FC } from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import useAuth from '@/presentation/store/use-auth';
import styles from '../index.module.scss';
import Logo from './logo.png';

const Header: FC = () => {
  const history = useHistory();
  const { user, isLogin } = useAuth();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get('keyword') || '';
  const handleRelease = (type: string) => {
    history.push(`/release?type=${type}`);
  };

  const handleOff = () => {
    localStorage.removeItem('token');
    // eslint-disable-next-line no-restricted-globals
    window.location.reload();
  };

  const handleEditData = () => { 
    history.push('/user-setting');
  };

  const handleUser = () => {
    history.push(`/user/${user?.id}`);
  };
    
  const handlecollect = () => {
    history.push('/collect');
  }

  const handleGold = () => {
    history.push('/user-gold')
  }

  return (
    <div className={styles.header}>
      <Space onClick={() => history.push('/')} style={{ cursor: 'pointer'}}>
        <img src={Logo} className={styles.logo} alt='' />
        <span>论坛</span>
      </Space>

      <Space size={20} className={styles.headerSpace}>
        <Input.Search placeholder='请输入要搜索的内容' onSearch={value => history.push(`/search?keyword=${value}`)} defaultValue={keyword} />
        <Popover placement='bottom' content={(
          <Menu>
            <Menu.Item onClick={() => handleRelease('tips')}><Space><PictureOutlined />发帖子</Space></Menu.Item>
            <Menu.Item onClick={() => handleRelease('essay')}><Space><FileTextOutlined />发文章</Space></Menu.Item>
          </Menu>
        )}>
          <Button icon={<PlusOutlined />} className={styles.release} type='primary'>发表</Button>
        </Popover>
        <span onClick={() => history.push('/mall')} className={styles.mall}>金币商城</span>
        {
          isLogin
            ? (
              <Dropdown overlay={(
                <Menu>
                  <Menu.Item onClick={handleUser}>个人中心</Menu.Item>
                  <Menu.Item onClick={handlecollect}>我的收藏</Menu.Item>
                  <Menu.Item onClick={handleEditData}>编辑资料</Menu.Item>
                  <Menu.Item onClick={handleGold}>金币中心</Menu.Item>
                  <Menu.Item onClick={handleOff}>退出登录</Menu.Item>
                </Menu>
              )}>
                <Avatar size={40} className={styles.avatar} src={user?.avatar}>{(user?.cname?.[0] || user?.username?.[0] || 'U').toLocaleUpperCase()}</Avatar>
              </Dropdown>
            )
            : <Button className={styles.login} onClick={() => history.push('/login')}>登录</Button>
        }
      </Space>
    </div>
  );
};

export default observer(Header);
