import { useState } from 'react'
import { Table, Button, Modal, Form, Input, Select, Space, Typography, Card, Popconfirm } from 'antd'
import { PlusOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { App } from 'antd'
import { mockUnits } from '@shared/mocks/data'

const { Title } = Typography

type Unit = { id: string; name: string; abbreviation: string; type: string }

export default function UnitsPage() {
  const { message } = App.useApp()
  const qc = useQueryClient()
  const [modalOpen, setModalOpen] = useState(false)
  const [editing, setEditing] = useState<Unit | null>(null)
  const [form] = Form.useForm()

  const { data: units = [], isLoading } = useQuery({
    queryKey: ['units'],
    queryFn: async () => { await new Promise(r => setTimeout(r, 300)); return [...mockUnits] },
  })

  const openCreate = () => { setEditing(null); form.resetFields(); setModalOpen(true) }
  const openEdit = (u: Unit) => { setEditing(u); form.setFieldsValue(u); setModalOpen(true) }

  const onSave = async () => {
    await form.validateFields()
    await new Promise(r => setTimeout(r, 400))
    void message.success(editing ? 'Unit updated' : 'Unit created')
    void qc.invalidateQueries({ queryKey: ['units'] })
    setModalOpen(false)
  }

  const onDelete = async (_id: string) => {
    await new Promise(r => setTimeout(r, 300))
    void message.success('Unit deleted')
    void qc.invalidateQueries({ queryKey: ['units'] })
  }

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name', render: (v: string) => <strong>{v}</strong> },
    { title: 'Abbreviation', dataIndex: 'abbreviation', key: 'abbreviation', render: (v: string) => <code>{v}</code> },
    { title: 'Type', dataIndex: 'type', key: 'type' },
    {
      title: '', key: 'actions', width: 80,
      render: (_: unknown, r: Unit) => (
        <Space>
          <Button type="text" icon={<EditOutlined />} onClick={() => openEdit(r)} />
          <Popconfirm title="Delete this unit?" onConfirm={() => onDelete(r.id)} okText="Delete" okButtonProps={{ danger: true }}>
            <Button type="text" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ]

  return (
    <div className="page-container" style={{ maxWidth: 700 }}>
      <div className="flex-between" style={{ marginBottom: 20 }}>
        <Title level={4} style={{ margin: 0 }}>Units of Measure</Title>
        <Button type="primary" icon={<PlusOutlined />} onClick={openCreate}>Add Unit</Button>
      </div>
      <Card style={{ borderRadius: 12 }}>
        <Table dataSource={units} columns={columns} rowKey="id" loading={isLoading} size="middle" pagination={false} />
      </Card>

      <Modal title={editing ? 'Edit Unit' : 'New Unit'} open={modalOpen} onOk={onSave} onCancel={() => setModalOpen(false)} okText="Save" destroyOnClose>
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item name="name" label="Name" rules={[{ required: true }]}><Input placeholder="Kilogram" /></Form.Item>
          <Form.Item name="abbreviation" label="Abbreviation" rules={[{ required: true }]}><Input placeholder="kg" /></Form.Item>
          <Form.Item name="type" label="Type" rules={[{ required: true }]}>
            <Select options={[{ value: 'quantity', label: 'Quantity' }, { value: 'weight', label: 'Weight' }, { value: 'time', label: 'Time' }, { value: 'other', label: 'Other' }]} />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  )
}
