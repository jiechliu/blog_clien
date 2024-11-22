import { Vertify } from '@alex_xu/react-slider-vertify';
import { UserOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Avatar, Button, Card, Form, Input, message, Modal, Tabs, Upload, Typography } from 'antd';
import { observer } from 'mobx-react';
import React, { FC, useEffect, useState } from 'react';
import { getAllByIds } from '@/application/service/mall';
import { UpdateUser, getUserInfo, sendEmail } from '@/application/service/user';
import BodyScreen from '@/presentation/components/body-screen';
import useAuth from '@/presentation/store/use-auth';
import { rule } from '@/types/user';
import { uploadCosFile } from '@/utils/file-cos';
import styles from './index.module.scss';
import type { RcFile, UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';

const { TabPane } = Tabs;

const UserSetting: FC = () => {
  const { user, loginUser } = useAuth();
  const [form] = Form.useForm();
  const [userForm] = Form.useForm();
  const [emailForm] = Form.useForm();
  const [fileUrl, setFileUrl] = useState<string>('');
  const [visible, setVisible] = useState<boolean>();
  const [codeVisible, setCodeVisible] = useState<boolean>();
  const [email, setEmail] = useState<string>('')
  const [time, setTime] = useState<number>(0);
  const [currentBorder, setCurrentBorder] = useState('');

  const { run: updateUserRun, loading } = useRequest(UpdateUser, {
    manual: true,
    onSuccess: () => {
      message.success('修改成功');
      setVisible(false);
      loginUser();
    },
  });

  const { run: sendEmailRun } = useRequest(sendEmail, {
    manual: true,
    ready: !!email && time === 0,
    onSuccess() {
      message.info('验证码已发送至您的邮箱！');
      setTime(60);
    }
  })

  const { data } = useRequest(() => getUserInfo(`${user?.id}` || ''), {
    ready: !!user?.id,
  });

  const { data: bordersData } = useRequest(() => getAllByIds(user?.userBodrers || []), {
    ready: !!user,
    refreshDeps: [user],
  });

  const handleFinish = (value: Record<string, string>) => {
    const { cname, description, gitAddress } = value;
    updateUserRun({
      username: user?.username,
      cname,
      description,
      avatar: fileUrl,
      gitAddress,
      currentBorder,
    });
  };

  const handleUserFinish = (value: Record<string, string>) => {
    const { username, password } = value;
    updateUserRun({
      password,
      username,
    });
  };
    
  const handleCustomReques = async (options: RcCustomRequestOptions) => {
    const { file, onSuccess, onError } = options;
    try {
      const url = await uploadCosFile(file as RcFile);
      onSuccess?.(url);
      setFileUrl(url);
    } catch (err) {
      onError?.(err as Error);
      console.error(err);
    }
  };

  const handleCodeSuccess = () => {
    sendEmailRun({
      email,
    });
    setCodeVisible(false);
  };

  const handleEmailOk = () => {
    const { email, code } = emailForm.getFieldsValue();
    updateUserRun({
      email,
      code,
      username: user?.username,
    });
  };

  const sendCodeButton = () => (
    <span
      onClick={() => time === 0 && email && setCodeVisible(true)}
      style={{ cursor: 'pointer', color: time > 0 ? '#909090' : '#000' }}
    >
      {time > 0 ? `${time}秒后重新发送` : '发送验证码'}
    </span>
  );

  const handleBorderClick = (url: string) => {
    if (url === currentBorder) {
      setCurrentBorder('');
    } else {
      setCurrentBorder(url);
    }
  }


  useEffect(() => {
    if (data) {
      form.setFieldsValue({
        ...data?.data,
      })
      setFileUrl(data?.data?.avatar);
      setCurrentBorder(data?.data?.currentBorder || '')
      userForm.setFieldsValue({
        username: data?.data?.username,
      });
    };
  }, [data]);

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
    <BodyScreen className={styles.user}>
      <Tabs tabPosition='left'>
        <TabPane tab='个人资料' key='info'>
          <Card title='个人资料'>
            <Form
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 18 }}
              form={form}
              onFinish={handleFinish}
            >
              <Form.Item label='头像'>
                <Upload
                  accept='.png, .webp, .jpg, .gif, .jpeg'
                  customRequest={handleCustomReques}
                >
                  <Avatar size={180} src={fileUrl} icon={<UserOutlined />} className={styles.userUpload} />
                </Upload>
              </Form.Item>

              <Form.Item label='头像框'>
                {bordersData?.data?.map(item => (
                  <img
                    src={item.url}
                    alt=""
                    width={40}
                    key={item.id}
                    onClick={() => handleBorderClick(item.url)}
                    className={currentBorder === item.url ? styles.activeBorder : styles.border}
                  />
                ))}
              </Form.Item>
              <Form.Item label='昵称' name='cname' rules={rule.cname}>
                <Input placeholder='请输入昵称' />
              </Form.Item>
              <Form.Item label='个人签名' name='description' required>
                <Input.TextArea placeholder='请输入个人签名' />
              </Form.Item>
              <Form.Item label='邮箱' name='gitAddress'>
                {user?.email ? user.email : (
                  <Typography.Link onClick={() => {setVisible(true)}}>绑定邮箱</Typography.Link>
                )}
              </Form.Item>
              <Form.Item label='个人主页' name='gitAddress'>
                <Input placeholder='请输入个人主页' />
              </Form.Item>
              <Button type='primary' htmlType='submit' className={styles.submitBtn} loading={loading}>保存</Button>
            </Form>
          </Card>
        </TabPane>
        <TabPane tab='账号信息' key='user'>
          <Card title='账号信息'>
            <Form
              labelCol={{ span: 3 }}
              wrapperCol={{ span: 18 }}
              form={userForm}
              onFinish={handleUserFinish}
            >
              <Form.Item name='username' label='用户名'>
                <Input placeholder='请输入用户名' disabled />
              </Form.Item>
              <Form.Item name='password' label='密码' rules={rule.password}>
                <Input.Password placeholder='请输入密码' />
              </Form.Item>
              <Button type='primary' htmlType='submit' className={styles.submitBtn} loading={loading}>保存</Button>
            </Form>
          </Card>
        </TabPane>
      </Tabs>
      <Modal open={visible} title='绑定邮箱' onCancel={() => setVisible(false)} onOk={handleEmailOk}>
        <Form form={emailForm} labelCol={{ span: 5 }}>
          <Form.Item label='邮件' name='email' rules={rule.email}>
            <Input placeholder='请输入邮件地址' onChange={e => setEmail(e.target.value)} />
          </Form.Item>
          <Form.Item label='验证码' name='code' rules={rule.code}>
            <Input placeholder='请输入验证码' maxLength={6} addonAfter={sendCodeButton()} />
          </Form.Item>
        </Form>
        <Modal open={codeVisible} footer={null} width={368} closable={false}>
          <Vertify
            width={320}
            height={160}
            onSuccess={handleCodeSuccess}
            onFail={() => message.error('验证失败')}
          />
        </Modal>
      </Modal>
      
    </BodyScreen>
  );
};

export default observer(UserSetting);
