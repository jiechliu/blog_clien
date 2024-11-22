import Icon from '@ant-design/icons';
import { Modal } from 'antd';
import clsx from 'classnames';
import React, { FC } from 'react';
import { ReactComponent as ModalInfoSvg } from '@/application/assets/icons/modal-info.svg';
import styles from './index.scss';
import type { ModalFuncProps, ModalProps } from 'antd/lib/modal';

export const RfixModalConfirm = (props: ModalFuncProps) => {
  const { className, type, ...reset } = props;
  switch (type) {
  case 'confirm': Modal.confirm({
    icon: <Icon component={ModalInfoSvg} />,
    ...reset,
    wrapClassName: clsx(className, styles.rfixModalConfirm),
  }); break;
  case 'error': Modal.error({
    ...reset,
    wrapClassName: clsx(className, styles.rfixModalConfirm),
  }); break;
  case 'info': Modal.info({
    ...reset,
    wrapClassName: clsx(className, styles.rfixModalConfirm),
  }); break;
  case 'success': Modal.success({
    ...reset,
    wrapClassName: clsx(className, styles.rfixModalConfirm),
  }); break;
  case 'warn': Modal.warn({
    ...reset,
    wrapClassName: clsx(className, styles.rfixModalConfirm),
  }); break;
  case 'warning': Modal.warning({
    ...reset,
    wrapClassName: clsx(className, styles.rfixModalConfirm),
  }); break;
  default: Modal.confirm({
    icon: <Icon component={ModalInfoSvg} />,
    ...reset,
    wrapClassName: clsx(className, styles.rfixModalConfirm),
  });
  }
};

export const RfixModal: FC<ModalProps> = (props) => {
  const { className, children, ...reset } = props;

  return <Modal {...reset} className={clsx(className, styles.rfixModal)}>
    {children}
  </Modal>;
};
