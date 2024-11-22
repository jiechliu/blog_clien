import { ReleaseOrderBy } from '@/application/enum/release';
import { ReleaseData } from './home';
import client, { CommonAPI } from './request';

export type getSearchRes = {
    total: number;
    list: ReleaseData[];
}

export type SearchDto = {
    page: number;
    pageSize: number;
    orderBy?: ReleaseOrderBy,
    keyword?: string;
}

// 发布帖子
export const searchList = async (data: SearchDto): Promise<CommonAPI<getSearchRes>> => {
  const res = await client.get({
    url: '/search',
    data,
  });
  return res.data;
};
