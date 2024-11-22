import { Vertify } from '@alex_xu/react-slider-vertify';
import { useRequest } from 'ahooks';
import { Card, Form, Input, Button, message, Modal } from 'antd';
import React, { FC, useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { RegisterUser, sendEmail } from '@/application/service/user';
import { rule } from '@/types/user';
import styles from './index.module.scss';

const Register: FC = () => {
  const history = useHistory();
  const [email, setEmail] = useState<string>('')
  const [time, setTime] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(false);

  const { loading, run, error } = useRequest(RegisterUser, {
    manual: true,
    onSuccess: (data) => {
      if (data?.code === 0) {
        message.success('注册成功！');
        setTimeout(() => {
          history.push('/login');
        }, 1000);
      } else {
        message.error(error?.message);
      }
    },
    onError: (error) => {
      message.error(error?.message);
    },
  })

  const { run: sendEmailRun } = useRequest(sendEmail, {
    manual: true,
    ready: !!email && time === 0,
    onSuccess() {
      message.info('验证码已发送至您的邮箱！');
      setTime(60);
    }
  })

  const handleFinish = (value: Record<string, string>) => {
    const { username, email, code, password, confirmPassword } = value;
    if (password === confirmPassword) {
      run({
        username,
        password,
        email,
        code,
      })
    } else {
      message.error('密码不一致');
    }
  };

  const handleCodeSuccess = () => {
    sendEmailRun({
      email,
    });
    setVisible(false);
  };

  const sendCodeButton = () => (
    <span
      onClick={() => time === 0 && email && setVisible(true)}
      style={{ cursor: 'pointer', color: time > 0 ? '#909090' : '#000' }}
    >
      {time > 0 ? `${time}秒后重新发送` : '发送验证码'}
    </span>
  );

  useEffect(() => {
    if (time > 0) {
      const intervalId = setInterval(() => {
        setTime(time - 1);
      }, 1000);
      return () => clearInterval(intervalId);
    }
    return;
  }, [time]);

  return (
    <Card title='注册' className={styles.loginCard}>
      <Form labelCol={{ span: 5 }} wrapperCol={{ span: 18 }} onFinish={handleFinish}>
        <Form.Item label='邮件' name='email' rules={rule.email}>
          <Input placeholder='请输入邮件地址' onChange={e => setEmail(e.target.value)} />
        </Form.Item>
        <Form.Item label='用户名' name='username' rules={rule.username}>
          <Input placeholder='请输入用户名' />
        </Form.Item>
        <Form.Item label='密码' name='password' rules={rule.password}>
          <Input.Password placeholder='请输入密码' />
        </Form.Item>
        <Form.Item label='确认密码' name='confirmPassword' rules={rule.password}>
          <Input.Password placeholder='请再次输入密码' />
        </Form.Item>
        <Form.Item label='验证码' name='code' rules={rule.code}>
          <Input placeholder='请输入验证码' maxLength={6} addonAfter={sendCodeButton()} />
        </Form.Item>
        <div className={styles.submitBtn}>
          <Button type='primary' htmlType='submit' loading={loading}>注册</Button>
          <Button type='link' onClick={() => history.push('/login')}>已有账号？前往登录&gt;&gt;</Button>
        </div>
        <Modal open={visible} footer={null} width={368} closable={false}>
          <Vertify
            width={320}
            height={160}
            onSuccess={handleCodeSuccess}
            onFail={() => message.error('验证失败')}
          />
        </Modal>
      </Form>
    </Card>
  );
};

export default Register;
