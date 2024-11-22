import request, { CommonAPI } from './request';

// 上传
export const UploadFile = async (file: File): Promise<CommonAPI<{ url: string }>> => {
  const data = new FormData();
  data.set('file', file);
  const res = await request.post({
    url: '/upload',
    data,
  });
  return res.data;
};
