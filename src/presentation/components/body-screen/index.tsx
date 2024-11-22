import classnames from 'classnames';
import React, { FC } from 'react';
import styles from './index.module.scss';

export interface BodyScreenProps {
    className?: string;
    style?: React.CSSProperties;
    [key: string]: any;
}

const BodyScreen: FC<BodyScreenProps> = (props) => {
  const { className, children, ...rest } = props;

  return (
    <div className={classnames(className, styles.body)} {...rest}>
      {children}
    </div>
  );
};

export default BodyScreen;
