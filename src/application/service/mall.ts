import client, { CommonAPI } from './request';

// 帖子列表
export interface Border {
  id: number;
  name: string;
  url: string;
  price: number;
}

// 获取全部边框
export const getBorderAll = async (): Promise<CommonAPI<Border[]>> => {
  const res = await client.get({
    url: '/border/get-all',
  });
  return res.data;
};

// 购买边框
export const purchase = async (id: number): Promise<CommonAPI> => {
  const res = await client.post({
    url: '/border/purchase',
    data: {
      id,
    }
  });
  return res.data;
};

// 携带边框
export const putBorder = async (id: number): Promise<CommonAPI> => {
  const res = await client.post({
    url: '/border/putBorder',
    data: {
      id,
    }
  });
  return res.data;
};

// 根据id获取边框
export const getAllByIds = async (ids: string[]): Promise<CommonAPI<Border[]>> => {
  const res = await client.post({
    url: '/border/get-ids',
    data: {
      ids,
    }
  });
  return res.data;
};
