import { Layout } from 'antd'
import { observer } from 'mobx-react';
import React, { FC, useEffect } from 'react';
import useAuth from '../store/use-auth';
import AppHeader from './header';
import styles from './index.module.scss';

export interface AppLayoutProps {
    component: any;
}

const { Header, Footer, Content } = Layout;

const AppLayout: FC<AppLayoutProps> = (props) => {
  const { component: Component } = props;
  const { loginUser } = useAuth();
    
  useEffect(() => {
    loginUser();
  }, []);

  return (
    <Layout className={styles.layout}>
      <Header><AppHeader /></Header>
      <Content><Component /></Content>
      <Footer className={styles.footer}>
        <span className={styles.footerText}>这是一个页脚</span>
      </Footer>
    </Layout>
  );
};

export default observer(AppLayout);
