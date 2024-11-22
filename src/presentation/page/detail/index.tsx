import { LikeOutlined, LikeFilled, ReadOutlined, HeartOutlined, HeartFilled, FileImageOutlined } from '@ant-design/icons';
import { useRequest } from 'ahooks';
import { Comment, Card, Typography, Space, Spin, message, Input, Button, Empty, Tag, Image, Upload, UploadFile } from 'antd';
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { FC, useState, useEffect, useMemo } from 'react';
import ReactMarkDown from 'react-markdown';
import { useParams } from 'react-router-dom';
import {Prism as SyntaxHighlighter} from 'react-syntax-highlighter'
import { dracula } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { CommentType, ReleaseType } from '@/application/enum/release';
import { ReleaseStatus } from '@/application/enum/release';
import { releaseDetail, focusRelease, browseRelease, commentRelease, CommentReleaseReq, collectRelease } from '@/application/service/release';
import { getUserInfo, focusUser, UserData } from '@/application/service/user';
import BodyScreen from '@/presentation/components/body-screen';
import UserAvatar from "@/presentation/components/user-avatar";
import UserCard from '@/presentation/components/user-card';
import useAuth from '@/presentation/store/use-auth';
import { uploadCosFile } from '@/utils/file-cos';
import ChildrenComment from './components/children-comment';
import styles from './index.module.scss'
import type { UploadProps } from 'antd/es/upload';
import type { RcFile, UploadRequestOption as RcCustomRequestOptions } from 'rc-upload/lib/interface';

const { Paragraph } = Typography;

const Detail: FC = () => {
  const { user, loginUser } = useAuth();
  const { id } = useParams<{ id: string }>();
  const [likes, setLikes] = useState<number>(0);
  const [action, setAction] = useState<string>('open');
  const [inputValue, setInputValue] = useState<string>('');
  const [reviewImages, setReviewImages] = useState<UploadFile[]>();

  const { data, loading, run } = useRequest(() => releaseDetail(id), {
    ready: !!id,
    refreshDeps: [id],
    onSuccess: (data) => {
      setLikes(data?.data?.focus || 0);
      data?.data?.review.sort((b, a) => (new Date(b.createTime).getTime() - new Date(a.createTime).getTime()));
      localStorage.setItem(`releaseCreator${id}`, data?.data?.user?.cname || '')
    },
  });

  const { data: userData, loading: userLoading, run: getUserRun } = useRequest(() => getUserInfo(`${data?.data?.user?.id}` || ''), {
    ready: !!data?.data?.creator,
  })

  const { run: focusUserRun, loading: focusLoading } = useRequest(focusUser, {
    manual: true,
    onSuccess: () => {
      loginUser();
      getUserRun();
    },
  })
    
  const { run: collectRun } = useRequest(collectRelease, {
    manual: true,
    onSuccess: (data) => {
      if (data.code === 0) {
        message.success(user?.collection?.includes(id) ? '取消收藏成功' : '收藏成功');
        loginUser();
        run();
      }
    }
  })

  useRequest(() => browseRelease(id), { ready: !!id });

  const like = async () => {
    const { code } = await focusRelease({
      releaseId: Number(id),
    })
    if (code === 0) {
      message.success(action === 'open' ? '取消点赞成功' : '点赞成功');
      setLikes(action === 'open' ? (likes - 1) : (likes + 1));
      setAction(action === 'open' ? 'off' : 'open');
      loginUser();
    }
  };

  const handleComment = async (props: CommentReleaseReq) => {
    const { code } = await commentRelease({
      ...props,
      releaseId: data?.data?.id || 0,
    });
    if (code === 0) {
      message.success('评论成功');
      setInputValue('');
      run();
      setReviewImages([]);
    }
  };

  const handleFocusUserClick = () => {
    focusUserRun({
      userId: `${user?.id}`,
      userFocus: `${userData?.data?.id}`,
    });
  };
    
  const handleCollect = async () => {
    collectRun({
      releaseId: +id,
    })
  };

  const handleCustomReques = async (options: RcCustomRequestOptions) => {
    const { file, onSuccess, onError } = options;
    try {
      const url = await uploadCosFile(file as RcFile);
      onSuccess?.(url);
    } catch (err) {
      onError?.(err as Error);
      console.error(err);
    }
  }

  const handleUploadChange: UploadProps['onChange'] = (info) => {
    setReviewImages(info?.fileList);
  }

  const handleCopy = (e: any) => {
    // 获取选区对象
    let selection: any = window.getSelection();
    const originText = (e.target.outerText as string).substring(selection.baseOffset, selection.focusOffset);
    console.log(originText)
    if (typeof originText == 'undefined') return false;
    const creator = localStorage.getItem(`releaseCreator${id}`);
    let clipboardData = e.clipboardData || window.Clipboard;
    let copyText = originText;
    if (originText?.length > 10) {
      copyText =
`${originText}

作者：${creator}
链接：${window.location.href}
来源：论坛
著作权归作者所有。商业转载请联系作者获得授权，非商业转载请注明出处。
    `
    }
    clipboardData.setData('text/plain', copyText)
    e.preventDefault();
    return true;
  };

  const commentSum = useMemo(() => data?.data?.review?.reduce((pre, cur) => pre + 1 + cur.childReview.length, 0), [data]);

  const actions = [
    <Space onClick={like}>
      {action === 'off' ? <LikeOutlined /> : <LikeFilled />}
      <span className="comment-action">{`点赞(${likes})`}</span>
    </Space>,
    <Space>
      <ReadOutlined />
      <span>{`浏览（${data?.data?.browse || 0}）`}</span>
    </Space>,
    <Space onClick={handleCollect}>
      { user?.collection?.includes(id) ? <HeartFilled /> : <HeartOutlined />}
      <span>收藏（{data?.data?.collect || 0}）</span>
    </Space>
  ];

  const focusReact = useMemo(() => {
    if (user?.userFocus?.includes(`${data?.data?.user?.id}`)) {
      return <Button
        className={styles.hasFocusBtn}
        onClick={handleFocusUserClick}
        loading={focusLoading}
      >已关注</Button>
    } else if (data?.data?.creator === user?.username) {
      return null;
    } else {
      return <Button
        type='primary'
        className={styles.focusBtn}
        onClick={handleFocusUserClick}
        loading={focusLoading}
      >关注</Button>;
    }
  }, [user?.userFocus, userData]);

  useEffect(() => {
    if (user?.focus?.includes(String(id))) {
      setAction('open');
    } else {
      setAction('off');
    };
  }, [user]);

  useEffect(() => {
    // 添加全局复制事件监听器
    document.addEventListener('copy', handleCopy);

    // 清除事件监听器以防止内存泄漏
    return () => {
      document.removeEventListener('copy', handleCopy);
    };
  }, []);

  data?.data?.review?.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
  data?.data?.review?.forEach((item) => {
    item.childReview.sort((a, b) => new Date(b.createTime).getTime() - new Date(a.createTime).getTime());
  });

  if (loading || userLoading) {
    return <Spin spinning={loading || userLoading} wrapperClassName={styles.body} />
  };
  
  return (
    <BodyScreen className={styles.detail}>
      {
        data?.data?.status === ReleaseStatus.Success
          ? (
            <>
              <div>
                <Card actions={actions} title={data?.data?.title} className={styles.detailCard}>
                  <Comment
                    author={data?.data?.user?.cname || data?.data?.user?.username}
                    avatar={<UserAvatar size={data?.data?.user?.currentBorder ? 50 : 40} img={data?.data?.user?.avatar || ''} currentBorder={data?.data?.user?.currentBorder} />}
                    content={
                      <p>
                        发布于{moment(data?.data?.createTime).format('YYYY-MM-DD HH:mm:ss')}
                      </p>
                    }
                  />
                  <Paragraph style={{ 'whiteSpace': 'pre-line' }} className={styles.content}>
                    {data?.data?.type === ReleaseType.Article ? <ReactMarkDown
                      children={data?.data?.content || ''} components={{
                        code({node, inline, className, children, ...props}) {
                          const match = /language-(\w+)/.exec(className || '')
                          return !inline && match ? (
                            <SyntaxHighlighter
                              children={String(children).replace(/\n$/, '')}
                              style={dracula}
                              language={match[1]}
                              PreTag="div"
                              {...props}
                            />
                          ) : (
                            <code className={className} {...props}>
                              {children}
                            </code>
                          )
                        }
                      }}
                    /> : <p>{data?.data?.content}</p>}
                  </Paragraph>
                  <div className={styles.image}>
                    <Image.PreviewGroup>
                      {data?.data?.img?.map((item, idx) => (
                        <Image src={item} key={idx} />
                      ))}
                    </Image.PreviewGroup>
                  </div>
                  <div className={styles.tags}>
                    {data?.data?.tags?.map((item, idx) => <Tag key={idx}>{item}</Tag>)}
                  </div>      
                </Card>
                <Card className={styles.comments}>
                  <p className={styles.commentsSum}>{`${commentSum}条评论`}</p>
                  <Input.TextArea
                    onChange={(e) => setInputValue(e.target.value)}
                    value={inputValue}
                    autoSize={{ minRows: 5, maxRows: 5 }}
                    placeholder='发布你的评论'
                  />
                  <Space align='center' style={{ justifyContent: 'space-between', width: '100%' }}>
                    <Upload
                      accept='.png, .webp, .jpg, .gif, .jpeg'
                      customRequest={handleCustomReques}
                      onChange={handleUploadChange}
                      fileList={reviewImages}
                      listType="picture-card"
                    >
                      <FileImageOutlined className={styles.uploadBtn} />
                    </Upload>
                    <Button
                      type='primary'
                      className={styles.commentsSubmit}
                      onClick={() => handleComment({
                        type: CommentType.Comment,
                        text: inputValue,
                        id: +id,
                        images: reviewImages?.map((item) => item.response || ''),
                      })}>
                    评论
                    </Button>
                  </Space>
                  {
                    data?.data?.review?.map((item) => (
                      <ChildrenComment
                        {...item}
                        key={item.id}
                        type={CommentType.ChildrenComment}
                        handleComment={handleComment}
                      >
                        {
                          item.childReview.map((childItem, idx) => (
                            <ChildrenComment
                              {...childItem}
                              id={item.id}
                              key={idx}
                              type={CommentType.ChildrenComment}
                              handleComment={handleComment}
                            />
                          ))
                        }
                      </ChildrenComment>
                    ))
                  }
                </Card>
              </div>
              <UserCard user={userData?.data as UserData}>
                {focusReact}
              </UserCard>   
            </>
          )
          : <Empty description='当前暂无该文章' style={{ width: '100%' }} />
      }
    </BodyScreen>
  );
};

export default observer(Detail);
