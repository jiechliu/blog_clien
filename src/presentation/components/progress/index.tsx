import React, { FC } from 'react';
import ReactDOM from 'react-dom';
import styles from './index.module.scss';

let requestNum = 0;

const Progress: FC<{ show: boolean }> = ({ show }) => (
  <div className={styles.myprogress} style={{ display: show ? 'block' : 'none' }}>
    <div className={styles.bar}>
      <div className={styles.peg}></div>
    </div>
    <div className={styles.spinner}>
      <div className={styles['spinner-icon']}></div>
    </div>
  </div>
);

const progressWrapper = (show: boolean) => {
  // 创建元素追加到body
  const progress = document.querySelector('.progress');
  if (!progress) {
    let div = document.createElement('div');
    div.className = 'progress';
    document.body.appendChild(div);
  };
  if (progress) {
    ReactDOM.render(
      React.createElement(Progress, { show }),
      progress,
    );
  };
}

const start = () => {
  progressWrapper(true);
  requestNum = requestNum + 1;
};
const stop = () => {
  requestNum = requestNum - 1;
  requestNum === 0 && progressWrapper(false);
};

export default {
  start,
  stop,
};