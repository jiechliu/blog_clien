import { ReadOutlined , LikeFilled, LikeOutlined, MessageOutlined, DeleteOutlined } from '@ant-design/icons';
import { Tooltip, Comment, Typography, Space, message, Tag, Image, Button, Popconfirm } from 'antd';
import { observer } from 'mobx-react';
import moment from 'moment';
import React, { FC, useState, useEffect, useMemo } from 'react';
import { useHistory } from 'react-router-dom';
import { ReleaseData } from '@/application/service/home';
import { focusRelease } from '@/application/service/release';
import UserAvatar from "@/presentation/components/user-avatar";
import useAuth from '@/presentation/store/use-auth';
import { getUpdateAtLabel } from '@/utils/time';
import styles from './index.module.scss';

const { Paragraph } = Typography;

export const Mark = ({ name, keyword }: { name: string; keyword: string }) => {
  if (!keyword) {
    return <>{name}</>;
  }
  const arr = name?.split(keyword);
  return (
    <>
      {arr?.map((str, index) => (
        <span key={index}>
          {str}
          {index === arr.length - 1 ? null : (
            <span style={{ color: "red" }}>{keyword}</span>
          )}
        </span>
      ))}
    </>
  );
};

const HomeList: FC<{ release: ReleaseData, keyword?: string, onDelete?: ({ releaseId }: { releaseId: number }) => void, showDelete?: boolean }> = (props) => {
  const { release, keyword, onDelete, showDelete = false } = props;
  const { user, loginUser } = useAuth();
  const history = useHistory();
  const [likes, setLikes] = useState(release.focus || 0);
  const [action, setAction] = useState<string | null>('open');

  const like = async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation();
    const { code } = await focusRelease({
      releaseId: release.id,
    })
    if (code === 0) {
      message.success(action === 'open' ? '取消点赞成功' : '点赞成功');
      setLikes(action === 'open' ? (likes - 1) : (likes + 1));
      setAction(action === 'open' ? 'off' : 'open');
      loginUser();
    }
  };
    
  const handleDelete = (e?: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e?.stopPropagation();
    onDelete?.({ releaseId: release.id });
  }
    
  useEffect(() => {
    if (user?.focus?.includes(String(release.id))) {
      setAction('open');
    } else {
      setAction('off');
    }
  }, [user]);

  const commentSum = useMemo(() => release?.review?.reduce((pre, cur) => pre + 1 + cur.childReview.length, 0), [release]);

  const actions = [
    <Space onClick={(e) => like(e)} size={2}>
      {action === 'off' ? <LikeOutlined /> : <LikeFilled />}
            点赞
      <span className="comment-action">{likes}</span>
    </Space>,
    <Space size={2}>
      <ReadOutlined />浏览
      <span>{release.browse}</span>
    </Space>,
    <Space size={2}>
      <MessageOutlined />
            评论
      <span className="comment-action">{commentSum}</span>
    </Space>
  ];

  return (
    <Comment
      actions={actions}
      className={styles.homeList}
      author={release.user?.cname || release.user?.username}
      avatar={<UserAvatar
        img={release.user?.avatar || ''}
        size={release.user?.currentBorder ? 40 : 30}
        onClick={(e) => {
          e?.stopPropagation();
          history.push(`/user/${release.user?.id}`)
        }}
        currentBorder={release.user?.currentBorder}
      />}
      content={
        <div>
          <p className={styles.title}><Mark name={release.title} keyword={keyword || ''} /></p>
          <Paragraph ellipsis={{ rows: 3 }} className={styles.content}>
            <Mark name={release.description ?? release.content} keyword={keyword || ''} />
          </Paragraph>
          <div className={styles.homeListImage}>
            <Image.PreviewGroup>
              {release?.img?.map((item, index) => (
                <Image alt='' src={item} key={index} onClick={(e) => e.stopPropagation()} />
              ))}
            </Image.PreviewGroup>
          </div>
          <div className={styles.tags}>
            {release?.tags?.map((item, idx) => <Tag key={idx}>{item}</Tag>)}
          </div>
        </div>
      }
      datetime={
        <Tooltip title={moment(release.updateTime).format('YYYY-MM-DD HH:mm:ss')}>
          <span>{getUpdateAtLabel(release.updateTime)}</span>
        </Tooltip>
      }
    >
      {
        showDelete && (
          <Popconfirm
            title="确认删除此文章吗？"
            onConfirm={handleDelete}
            onCancel={e => e?.stopPropagation()}
          >
            <Button type="text" icon={<DeleteOutlined />} className={styles.deleteBtn} onClick={e => e.stopPropagation()}>删除</Button>
          </Popconfirm>
        )
      }
    </Comment>
  );
};

export default observer(HomeList);
