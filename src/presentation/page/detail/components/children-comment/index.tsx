import { CommentOutlined } from '@ant-design/icons';
import { Comment, Space, Input, Button, Image } from 'antd';
import clsx from 'classnames';
import { observer } from 'mobx-react';
import React, { FC, useState } from 'react';
import { CommentType } from '@/application/enum/release';
import { ReplyData } from '@/application/service/home';
import { CommentReleaseReq } from '@/application/service/release';
import UserAvatar from "@/presentation/components/user-avatar";
import styles from '@/presentation/page/detail/index.module.scss';
import { getUpdateAtLabel } from '@/utils/time';

export interface CommentProps extends ReplyData {
    children?: React.ReactNode;
    type: CommentType;
    handleComment?: (props: CommentReleaseReq) => void
}

const ChildrenComment: FC<CommentProps> = (props) => {
  const { children, user: reviewUser, text, createTime, type, id, handleComment, replier, images } = props;
  const [isShowComment, setIsShowComment] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const reviewUsername = reviewUser?.cname || reviewUser?.username;

  const handleClick = () => {
    handleComment?.({
      type,
      text: inputValue,
      id: +id,
      replier: reviewUsername,
    });
    setIsShowComment(false);
  };

  const replyContent = () => (
    <Space className={styles.reply}>
      <span>{reviewUsername}</span>回复<span>{replier}</span>
    </Space>
  )

  return (
    <Comment
      className={styles.comment}
      actions={[
        <Space onClick={() => setIsShowComment(!isShowComment)} className={styles.commentLink}>
          <CommentOutlined /><span className={clsx(styles.commentLink, isShowComment && styles.link)}>{ isShowComment ? '取消评论' : '评论' }</span>
        </Space>,
        isShowComment && (
          <div className={styles.childrenComment}>
            <Input.TextArea autoSize={{ minRows: 2, maxRows: 2 }} onChange={(e) => setInputValue(e.target.value)} />
            <Button type='primary' onClick={() => handleClick()}>评论</Button>
          </div>
        ),
      ]}
      author={replier ? replyContent() : reviewUsername}
      avatar={<UserAvatar size={reviewUser?.currentBorder ? 50 : 40} img={reviewUser?.avatar} currentBorder={reviewUser?.currentBorder} /> }
      content={
        <p>
          <Image.PreviewGroup>
            {images?.map((item, idx) => (
              <Image src={item} key={idx} style={{ width: '70px' }}/>
            ))}
          </Image.PreviewGroup>
          {text}
        </p>
      }
      datetime={getUpdateAtLabel(createTime)}
    >
      {children}
    </Comment>
  )
};

export default observer(ChildrenComment);
