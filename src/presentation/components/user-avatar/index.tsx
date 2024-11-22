import React, { FC } from 'react';
import styles from './index.module.scss';

interface IProps {
  img?: string;
  size: number;
  onClick?: (e: any) => void;
  currentBorder?: string;
}
const UserAvatar: FC<IProps> = (props) => {
  const { img = '', size, currentBorder, onClick } = props;
  const containerHeight = size * 0.8;
  const avatarSize = size * 0.5;
  const vipSize = size;

  return (
    <div
      className={styles.container}
      style={{ height: `${currentBorder ? containerHeight : size}px` }}
      onClick={onClick}
    >
      <img src={img} alt="" className={styles.avatar} style={{ width: `${currentBorder ? avatarSize : size}px`}} />
      {currentBorder ? <img src={currentBorder} alt="" className={styles.vip} style={{ width: `${vipSize}px`}} /> : null}
    </div>
  );
};

export default UserAvatar;
