import { Vertify } from '@alex_xu/react-slider-vertify';
import { useRequest } from 'ahooks';
import { Card, Form, Input, Button, message, Modal } from 'antd';
import { observer } from 'mobx-react';
import React, { FC, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { LoginUser, sendEmail, retrievePassword } from '@/application/service/user';
import useAuth from '@/presentation/store/use-auth';
import { rule } from '@/types/user';
import styles from './index.module.scss';

enum LoginType {
  Username,
  Email,
}

const Login: FC = () => {
  const history = useHistory();
  const [loginType, setLoginType] = useState<LoginType>(LoginType.Username);
  const [open, setOpen] = useState(false);
  const [email, setEmail] = useState<string>('')
  const [time, setTime] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);
  const { loginUser: loginStoreUser, isLogin } = useAuth();

  const { loading, run, error } = useRequest(
    LoginUser,
    {
      manual: true,
      onSuccess: async (data) => {
        if (data?.code === 0) {
          message.success('登录成功!');
          localStorage.setItem('token', data.data.token);
          loginStoreUser();
          setTimeout(() => {
            history.push('/');
          }, 1000);
        } else {
          message.error(error?.message);
        }
      },
    }
  );

  const { run: sendEmailRun } = useRequest(sendEmail, {
    manual: true,
    ready: !!email && time === 0,
    onSuccess() {
      message.info('密码重置邮件已发送至您的邮箱！');
      setTime(60);
    }
  });

  const { run: retrievePasswordRun } = useRequest(retrievePassword, {
    manual: true,
    ready: !!email && time === 0,
    onSuccess() {
      message.success('密码重置成功！');
      setOpen(false);
    },
  });

  const handleFinish = async (value: Record<string, string>) => { 
    const { username, password, email } = value;
    run({
      username,
      password,
      email,
    });
  };

  const handleRetrieveFinish = (value: Record<string, string>) => {
    const { email, code, password } = value;
    retrievePasswordRun({
      password,
      email,
      code,
    })
  };

  const cardTitle = () => (
    <div style={{ cursor: 'pointer', display: 'flex', justifyContent: 'space-between' }}>
      <div>
        <span onClick={() => setLoginType(LoginType.Username)} style={{ color: loginType === LoginType.Username ? '#1890ff' : '#000'}}>用户名</span>
        <span>&nbsp;&nbsp;/&nbsp;&nbsp;</span>
        <span onClick={() => setLoginType(LoginType.Email)} style={{ color: loginType === LoginType.Email ? '#1890ff' : '#000' }}>邮箱</span>
      </div>
      <Button type='link' onClick={() => history.push('/register')} style={{ paddingLeft: 0 }}>没有账号？点击这里去注册&gt;&gt;</Button>
    </div>
  )

  const sendCodeButton = () => (
    <span
      onClick={() => time === 0 && email && setVisible(true)}
      style={{ cursor: 'pointer', color: time > 0 ? '#909090' : '#000' }}
    >
      {time > 0 ? `${time}秒后重新发送` : '发送验证码'}
    </span>
  );

  const handleCodeSuccess = () => {
    sendEmailRun({
      email,
      type: 'retrieve',
    });
    setVisible(false);
  };

  useEffect(() => {
    if (time > 0) {
      const intervalId = setInterval(() => {
        setTime(time - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
    return;
  }, [time]);

  useEffect(() => {
    if (isLogin) {
      history.push('/');
    };
  }, [isLogin]);

  return (
    <Card title={cardTitle()} className={styles.loginCard}>
      <Form labelCol={{ span: 4 }} wrapperCol={{ span: 18 }} onFinish={handleFinish}>
        {
          loginType === LoginType.Username ? (
            <Form.Item label='用户名' name='username' rules={rule.username}>
              <Input placeholder='请输入用户名' />
            </Form.Item>
          ) : (
            <Form.Item label='邮箱' name='email' rules={rule.email}>
              <Input placeholder='请输入邮箱' />
            </Form.Item>
          )
        }
        <Form.Item label='密码' name='password' rules={rule.password}>
          <Input.Password placeholder='请输入密码' />
        </Form.Item>
        <div className={styles.submitBtn}>
          <Button type='primary' htmlType='submit' loading={loading}>登录</Button>
          <Button type='link' onClick={() => setOpen(true)}>忘记密码？</Button>
        </div>
      </Form>
      <Modal open={open} title='找回密码' footer={null} onCancel={() => setOpen(false)}>
        <Form labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} onFinish={handleRetrieveFinish}>
          <Form.Item label='邮件' name='email' rules={rule.email}>
            <Input placeholder='请输入邮件地址' onChange={e => setEmail(e.target.value)} />
          </Form.Item>
          <Form.Item label='新密码' name='password' rules={rule.password}>
            <Input.Password placeholder='请输入新密码' />
          </Form.Item>
          <Form.Item label='验证码' name='code' rules={rule.code}>
            <Input placeholder='请输入验证码' maxLength={6} addonAfter={sendCodeButton()} />
          </Form.Item>
          <Button type='primary' htmlType='submit' loading={loading}>确认</Button>
          <Modal open={visible} footer={null} width={368} closable={false}>
            <Vertify
              width={320}
              height={160}
              onSuccess={handleCodeSuccess}
              onFail={() => message.error('验证失败')}
            />
          </Modal>
        </Form>
      </Modal>
    </Card>
  )
};

export default observer(Login);
