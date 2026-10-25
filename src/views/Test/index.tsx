import React, { useState } from 'react';
import { Flex, Space, Table, Tag, Button } from 'antd';
import type { TableProps } from 'antd';
import request from "@/utils/request";
import { useNavigate } from 'react-router-dom';
import BigColumn from "./components/BigColumn.tsx"
import { useUserInfoStore } from "@/store/userInfo"
import { Form, Input, Select } from 'antd';
import {useCounter} from "./hook.ts"
import {MyComponent} from "./slot.tsx"
export default function Home() {
  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: 16 },
  };

  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };
  const [form] = Form.useForm();

  const onGenderChange = (value: string) => {
    switch (value) {
      case 'male':
        form.setFieldsValue({ note: 'Hi, man!' });
        break;
      case 'female':
        form.setFieldsValue({ note: 'Hi, lady!' });
        break;
      case 'other':
        form.setFieldsValue({ note: 'Hi there!' });
        break;
      default:
    }
  };

  const onFinish = (values: any) => {
    console.log(values);
  };

  const onReset = () => {
    form.resetFields();
  };

  const onFill = () => {
    form.setFieldsValue({ note: 'Hello world!', gender: 'male' });
  };
  const { updatePublicData } = useUserInfoStore()
  const navigate = useNavigate();
  // 列表数据
  interface DataType {
    key: string;
    name: string;
    age: number;
    address: string;
    tags: string[];
  }

  const columns: TableProps<DataType>['columns'] = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <a>{text}</a>,
    },
    {
      title: 'Age',
      dataIndex: 'age',
      key: 'age',
    },
    {
      title: 'Address',
      dataIndex: 'address',
      key: 'address',
    },
    {
      title: 'Tags',
      key: 'tags',
      dataIndex: 'tags',
      render: (_, { tags }) => (
        <Flex gap="small" align="center" wrap>
          {tags.map((tag) => {
            let color = tag.length > 5 ? 'geekblue' : 'green';
            if (tag === 'loser') {
              color = 'volcano';
            }
            return (
              <Tag color={color} key={tag}>
                {tag.toUpperCase()}
              </Tag>
            );
          })}
        </Flex>
      ),
    },
    {
      title: 'Action',
      key: 'action',
      render: (_, record) => (
        <Space size="middle">
          <a>Invite {record.name}</a>
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  const data: DataType[] = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
      tags: ['nice', 'developer'],
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
      tags: ['loser'],
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sydney No. 1 Lake Park',
      tags: ['cool', 'teacher'],
    },
  ];
  const [obj, setObj] = useState({
    name: "张三",
    age: 18
  })
  const setAge = () => {
    setObj({
      ...obj,
      age: ++obj.age
    })
  }
  const reqTest = () => {
    request.get('/data').then((res: any) => {
      console.log('dd0', res)
      setObj({
        name: res.name,
        age: res.age
      })
    })
  }
  const pageTo = () => {
    navigate('/403', { replace: true })
  }
  const setPublicData = () => {
    updatePublicData('更改后的公共数据')
  }
  const noteChange = (e) => {
    console.log('dd0', e.currentTarget.defaultValue);
    setTimeout(() => {
      console.log('dd0', e.currentTarget.defaultValue);
    })
  }
  const [count, setCount] = useState<number>(0);
  const countChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCount(Number(event.target.value));
  };
    const { count:count2, increment, decrement } = useCounter();
  return (
    <div>
      <Table<DataType> columns={columns} dataSource={data} />
      <div>性名：{obj.name} 年龄:{obj.age}</div>
      <Button type="primary" size='large' onClick={setAge}>
        Primary
      </Button>
      <Button type="primary" size='large' onClick={reqTest}>
        发送请求
      </Button>
      <Button type="primary" size='large' onClick={pageTo}>
        跳转
      </Button>
      <Button type="primary" size='large' onClick={setPublicData}>
        更改公共数据
      </Button>



      <Form
        {...layout}
        form={form}
        name="control-hooks"
        onFinish={onFinish}
        style={{ maxWidth: 600 }}
      >
        <Form.Item name="note" label="Note" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item name="gender" label="Gender" rules={[{ required: true }]}>
          <Select
            allowClear
            placeholder="Select a option and change input text above"
            onChange={onGenderChange}
            options={[
              { label: 'male', value: 'male' },
              { label: 'female', value: 'female' },
              { label: 'other', value: 'other' },
            ]}
          />
        </Form.Item>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) => prevValues.gender !== currentValues.gender}
        >
          {({ getFieldValue }) =>
            getFieldValue('gender') === 'other' ? (
              <Form.Item name="customizeGender" label="Customize Gender" rules={[{ required: true }]}>
                <Input />
              </Form.Item>
            ) : null
          }
        </Form.Item>
        <Form.Item {...tailLayout}>
          <Space>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
            <Button htmlType="button" onClick={onReset}>
              Reset
            </Button>
            <Button type="link" htmlType="button" onClick={onFill}>
              Fill form
            </Button>
          </Space>
        </Form.Item>
      </Form>
      计数 <Input value={count} onChange={countChange} /> {count}
      <div>
      <p>Count: {count2}</p>
      <Button onClick={increment}>Increment</Button>
      <Button onClick={decrement}>Decrement</Button>
      </div>
      <MyComponent listApi="api/list" header={<div>header组件</div>} main={<div>Main组件</div>} footer={<div>Footer组件</div>} />
    </div>
  );
}
