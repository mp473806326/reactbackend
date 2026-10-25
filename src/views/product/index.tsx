import React, { useState, useEffect } from 'react';
import { Flex, Space, Table, Tag, Button, Drawer, Modal } from 'antd';
import type { TableProps, FormProps } from 'antd';
import { Checkbox, Form, Input } from 'antd';
import request from "@/utils/request";
import { AdMessage } from "@/utils/AntdGlobal";
import './index.scss';

import { PlusOutlined, UploadOutlined } from '@ant-design/icons';
import { Image, Upload } from 'antd';
import type { GetProp, UploadFile, UploadProps } from 'antd';

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];
export default function Home() {
  const [data, setData] = useState<DataType[]>([]);

  interface DataType {
    id: string;
    name: string;
    age: string;

  }

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'id',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <a>{text}</a>,
    },
    {
      title: '性名',
      dataIndex: 'name',
      key: 'name',

    },
    {
      title: '年龄',
      dataIndex: 'age',
      key: 'age',
    },

    {
      title: 'Action',
      key: 'action',
      width: 300,
      render: (_, record) => (
        <Flex gap="small" wrap>

          <Button type="primary" size='middle' onClick={() => {
            handleEdit(record)
          }}>
            编辑
          </Button>
          <Button type="primary" danger size='middle' onClick={() => {
            setOpen2(true);
            setId(record.id)
          }}>
            删除
          </Button>
        </Flex>
      ),
    },
  ];


  useEffect(() => {
    getList()
  }, []);
  const getList = () => {
    request.get("/api/data").then((res: any) => {
      console.log('res', res);
      setData(res.data)
    });
  }


  type FieldType = {
    name?: string;
    age?: string;
    id?: string;
    url?: string;
  };
  const addClick = () => {
    request.post("/api/add", editForm).then((res: any) => {
      AdMessage.success('新增成功');
      getList();
      setOpen(false);
    });
  }
  const onFinish: FormProps<FieldType>['onFinish'] = (values) => {
    console.log('edit:', editForm);
    if (title == '新增') {
      addClick()
    } else {
      editClick()
    }
  };
  const editClick = () => {
    request.post("/api/edit", editForm).then((res: any) => {
      AdMessage.success('编辑成功');
      getList();
      setOpen(false);
    });
  }
  const onFinishFailed: FormProps<FieldType>['onFinishFailed'] = (errorInfo) => {
    console.log('Failed:', errorInfo);
  };

  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('新增')
  const showDrawer = () => {
    setEditForm({ id: '', name: '', age: '', url: '' });
    setOpen(true);
    setTitle('新增');
    setFileList([])
    console.log('11', editForm)
  };

  const onClose = () => {
    setOpen(false);
  };
  const [editForm, setEditForm] = useState<FieldType>({ id: '', name: '', age: '', url: '' })
  const handleEdit = (record: FieldType) => {
    setOpen(true);
    setTitle('编辑');
    setEditForm(record);
    const obj = record.url ? [{ uid: "", name: '', url: record.url }] : []
    setFileList(obj)
  };
  const deleteClick = (id: string) => {
    request.post("/api/delete", { id }).then((res: any) => {
      AdMessage.success('删除成功');
      getList();
    });
  }
  const [open2, setOpen2] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  const [id, setId] = useState('');
  const handleOk = () => {

    setConfirmLoading(true);
    request.post("/api/delete", { id }).then((res: any) => {
      AdMessage.success('删除成功');
      getList();
      setOpen2(false);
      setConfirmLoading(false);
    }).catch((err: any) => {
      AdMessage.error('删除失败');
      setConfirmLoading(false);
    })


  };

  const handleCancel = () => {
    console.log('Clicked cancel button');
    setOpen2(false);
  };

  // -----------------------------------------------------------------------------------
  type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

  const getBase64 = (file: FileType): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });

  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState('');
  const [fileList, setFileList] = useState<UploadFile[]>([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
    },

  ]);

  const handlePreview = async (file: UploadFile) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj as FileType);
    }

    setPreviewImage(file.url || (file.preview as string));
    setPreviewOpen(true);
  };

  const handleChange: UploadProps['onChange'] = ({ file, fileList: newFileList }) => {
    setFileList(newFileList);
    if (file.status = 'done') {
      if (file.response) {
        console.log('file', file)
        const url = file.response.fileInfo.path;
        console.log('url', url);

        setEditForm({ ...editForm, url })
      }



    }
    console.log('newFileList', newFileList)
  }


  const uploadButton = (
    <button style={{ border: 0, background: 'none' }} type="button">
      <PlusOutlined />
      <div style={{ marginTop: 8 }}> 上传</div>
    </button>


  );
  return (
    <div>
      <Button className='mb' type="primary" size='middle' onClick={() => { showDrawer() }}>
        新增
      </Button>
      <Table<DataType> columns={columns} dataSource={data} />
      <Drawer
        title={title}
        closable={{ 'aria-label': 'Close Button' }}
        onClose={onClose}
        open={open}
        size='large'
      >
        <Form
          name="basic"
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 16 }}
          style={{ maxWidth: 600 }}
          initialValues={{ remember: true }}
          onFinish={onFinish}
          onFinishFailed={onFinishFailed}

          autoComplete="off"
        >
          <Form.Item<FieldType>
            label="姓名"

            rules={[{ required: true, message: 'Please input your name!' }]}

          >
            <Input value={editForm.name} onChange={(e) => { setEditForm({ ...editForm, name: e.target.value }) }} />
          </Form.Item>

          <Form.Item<FieldType>
            label="年龄"

            rules={[{ required: true, message: 'Please input your age!' }]}
          >
            <Input value={editForm.age} onChange={(e) => { setEditForm({ ...editForm, age: e.target.value }) }} />
          </Form.Item>
          <Form.Item<FieldType>
            label="图片">
            <Upload
              action="http://localhost:3000/api/upload"
              listType="picture-circle"
              fileList={fileList}
              onPreview={handlePreview}
              onChange={handleChange}

            >
              {fileList.length >= 1 ? null : uploadButton}


            </Upload>
            {previewImage && (
              <Image
                styles={{ root: { display: 'none' } }}
                preview={{
                  open: true,
                  onOpenChange: (visible: any) => setPreviewOpen(visible),
                  afterOpenChange: (visible) => !visible && setPreviewImage(''),
                }}
                src={previewImage}
              />
            )}
          </Form.Item>
          <Form.Item label={null}>
            <Button type="primary" htmlType="submit">
              确定
            </Button>
          </Form.Item>
        </Form>
      </Drawer>

      <Modal
        title="Title"
        open={open2}
        onOk={handleOk}
        confirmLoading={confirmLoading}
        onCancel={handleCancel}
      >
        <p>确定要删除吗？</p>
      </Modal>
    </div>

  );
}
