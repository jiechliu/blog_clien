import { QuestionCircleOutlined } from '@ant-design/icons';
import { Button, Popconfirm } from 'antd';
import Table, { ColumnsType } from 'antd/lib/table';
import React, { FC } from 'react';
import { useHistory } from 'react-router-dom';
import { ReleaseStatus } from '@/application/enum/release';
import { ReleaseData } from '@/application/service/home';

export interface RemoveReleaseProps {
    loading: boolean;
    dataSource?: ReleaseData[];
    handleRemove: (id: number) => void; 
}

const RemoveRelease: FC<RemoveReleaseProps> = (props) => {
  const { loading, dataSource, handleRemove } = props;
  const history = useHistory();

  const columns: ColumnsType<ReleaseData> = [
    {
      dataIndex: 'id',
      title: 'id',
    },
    {
      dataIndex: 'title',
      title: '标题',
    },
    {
      title: '操作',
      render: (record: ReleaseData) => record.status === ReleaseStatus.Success && (
        <Popconfirm
          title="确定要下架当前文章（帖子）？"
          onConfirm={(e) => { 
            e?.stopPropagation();
            handleRemove(record.id)
          }}
          icon={<QuestionCircleOutlined style={{ color: 'red' }} />}
        >
          <Button type='primary' danger onClick={e => e.stopPropagation()}>下架</Button>
        </Popconfirm>
      )
    }
  ];

  return (
    <Table
      columns={columns}
      dataSource={dataSource}
      loading={loading}
      onRow={record => ({
        onClick: () => history.push(`/detail/${record.id}`),
      })}
    />
  );
};

export default RemoveRelease;
