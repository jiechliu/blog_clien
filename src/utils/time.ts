import moment from 'moment';

export const getUpdateAtLabel = (updateAt?: string) => {
  let updateAtLabel = '';
  const diffD = moment().diff(moment(updateAt), 'days');
  const diffH = moment().diff(moment(updateAt), 'hours');
  const diffM = moment().diff(moment(updateAt), 'minutes');
  const diffS = moment().diff(moment(updateAt), 'seconds');
  if (diffS < 0) {
    return '置顶中'
  }
  if (diffD > 7) {
    updateAtLabel = `${moment(updateAt).format('YYYY-MM-DD HH:mm:ss')}发布`;
  } else if (diffD > 0) {
    updateAtLabel = `${diffD}天前发布`;
  } else if (diffH > 0) {
    updateAtLabel = `${diffH}小时前发布`;
  } else if (diffM > 0) {
    updateAtLabel = `${diffM}分钟前发布`;
  } else {
    updateAtLabel = diffS ? `${diffS}秒前发布` : '刚刚发布';
  }
  return updateAtLabel;
};