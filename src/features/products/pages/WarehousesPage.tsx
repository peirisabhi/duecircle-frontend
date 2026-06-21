import { useState } from 'react'
import { Table, Button, Modal, Form, Input, Switch, Space, Typography, Card, Popconfirm, Tag } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { App } from 'antd'
import { mockWarehouses } from '@shared/mocks/data'

const { Title } = Typography
type Warehouse = { id: string; name: string; location: string; isDefault: boolean; itemCount: number }

export default function WarehousesPage() {
  const { message } = App.useApp()
  const qc = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Warehouse | null>(null)
  const [form] = Form.useForm()

  const { data: warehouses = [], isLoading } = useQuery({
    queryKey: ['warehouses'],
    queryFn: async () => { await new Promise(r => setTimeout(r, 300)); return [...mockWarehouses] },
  })

  const openCreate = () => { setEditing(null); form.resetFields(); setModalOpen(true) }
  const openEdit = (w: Warehouse) => { setEditing(w); form.setFieldsValue(w); setModalOpen(true) }
  const onSave = async () => {
    await form.validateFields()
    await new Promise(r => setTimeout(r, 400))
    void message.success(editing ? 'Warehouse updated' : 'Warehouse created')
    void qc.invalidateQueries({ queryKey: ['warehouses'] })
    setModalOpen(false)
  }

  const columns = [
    { title: 'Warehouse', dataIndex: 'name', key: 'name', render: (v: string, r: Warehouse) => (
      <div><strong>{v}</strong>{r.isDefault && <Tag color="blue" style={{ marginLeft: 8 }}>Default</Tag>}</div>
    )},
    { title: 'Location', dataIndex: 'location', key: 'location', render: (v: string) => <span style={{ fontSize: 13 }}>{v}</span> },
    { title: 'Items', dataIndex: 'itemCount', key: 'itemCount', align: 'right' as const },
    {
      title: '', key: 'actions', width: 80,
      render: (_: unknown, r: Warehouse) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(r)} />
          <Popconfirm title="Delete this warehouse?" onConfirm={() => void message.success('Deleted')} okText="Delete" okButtonProps={{ danger: true }} disabled={r.isDefault}>
            <Button type="text" danger icon={<DeleteOutlined />} disabled={r.isDefault} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="page-container" style={{ maxWidth: 760 }}>
      <div className="flex-between" style={{ marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0 }}>Warehouses</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Add Warehouse</Button>
      </div>
      <Card style={{ borderRadius: 12 }}>
        <Table dataSource={warehouses} columns={columns} rowKey="id" loading={isLoading} size="middle" pagination={false} />
      </Card>
      <Modal title={editing ? 'Edit Warehouse' : 'New Warehouse'} open={modalOpen} onOk={onSave} onCancel={() => setModalOpen(false)} okText="Save" destroyOnClose>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="Warehouse Name" rules={[{ required: true }]}><Input placeholder="Main Warehouse" /></Form.Item>
          <Form.Item name="location" label="Address / Location"><Input.TextArea rows={2} /></Form.Item>
          <Form.Item name="isDefault" label="Set as default" valuePropName="checked"><Switch /></Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
