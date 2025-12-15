import { useState, useEffect } from 'react';
import {
    Layout, Card, Row, Col, Typography, Button, Segmented, Select,
    Space, Form, Input, Upload, Modal, ConfigProvider, message, Popconfirm, Tag
} from 'antd';
import {
    StarOutlined, CheckSquareOutlined, ClockCircleOutlined, FolderOutlined,
    PlusOutlined, EditOutlined, DeleteOutlined, EyeOutlined, FilterOutlined,
    ArrowLeftOutlined, UploadOutlined, CloseCircleOutlined, CheckSquareFilled
} from '@ant-design/icons';
import type { UploadFile } from 'antd/es/upload/interface'; // 📌 เพิ่ม Type นี้

// Import Services และ Helper
import {
    CreatePost,
    GetPost,
    UpdatePost,
    DeletePost,
    convertFileToBase64
} from '../../../services/postService';

import type {
    Postmanage,
    CreatePostRequest,
    UpdatePostRequest
} from "../../../interfaces/post";

const { Title, Text } = Typography;
const { TextArea } = Input;

const ActivityManager: React.FC = () => {
    const [form] = Form.useForm();

    // --- State ---
    const [posts, setPosts] = useState<Postmanage[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

    // --- UI State ---
    const [currentView, setCurrentView] = useState<'dashboard' | 'create'>('dashboard');
    const [currentTab, setCurrentTab] = useState<string>('กิจกรรมทั้งหมด');

    // --- Edit State ---
    const [editingPost, setEditingPost] = useState<Postmanage | null>(null);
    
    // 📌 เพิ่ม State สำหรับจัดการรูปภาพโดยเฉพาะ
    const [fileList, setFileList] = useState<UploadFile[]>([]);

    // --- Reject Modal State ---
    const [isRejectModalOpen, setIsRejectModalOpen] = useState<boolean>(false);
    const [rejectId, setRejectId] = useState<number | null>(null);
    const [rejectReason, setRejectReason] = useState<string>('');

    // ==========================================
    // API FUNCTIONS
    // ==========================================

    const fetchPosts = async () => {
        setLoading(true);
        try {
            const res = await GetPost();
            console.log("📦 API Response:", res);

            if (res && res.status === 200) {
                if (Array.isArray(res.data)) {
                    setPosts(res.data);
                } 
                else if (res.data && Array.isArray(res.data.data)) {
                    setPosts(res.data.data);
                } 
                else {
                    setPosts([]);
                }
            } else {
                setPosts([]);
            }
        } catch (error) {
            console.error("Error fetching posts:", error);
            message.error("ไม่สามารถโหลดข้อมูลได้");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    // 📌 ฟังก์ชันจัดการเมื่อไฟล์เปลี่ยน (เพิ่ม/ลบ)
    const onFileChange = ({ fileList: newFileList }: { fileList: UploadFile[] }) => {
        setFileList(newFileList);
    };

    // 2. Submit Form (Create & Update)
    const handleFormSubmit = async (values: any) => {
        setLoading(true);
        try {
            // --- Date Handling ---
            const now = new Date();
            const startDate = values.startDate ? new Date(values.startDate).toISOString() : now.toISOString();
            const endDate = values.endDate ? new Date(values.endDate).toISOString() : now.toISOString();

            // --- Picture Handling (Logic ใหม่) ---
            let pictureStr = "";

            if (fileList.length > 0) {
                const file = fileList[0];
                if (file.originFileObj) {
                    // กรณี 1: อัปโหลดรูปใหม่ -> แปลงเป็น Base64
                    pictureStr = await convertFileToBase64(file.originFileObj);
                } else if (file.url) {
                    // กรณี 2: ใช้รูปเดิม -> ส่งค่าเดิมกลับไป (ต้องตัด header data:image... ออกถ้า Backend ไม่ต้องการ)
                    // สมมติว่า Backend รับเฉพาะ raw base64:
                    if (file.url.includes(",")) {
                        pictureStr = file.url.split(",")[1]; 
                    } else {
                        pictureStr = file.url;
                    }
                }
            } else {
                // กรณี 3: ลบรูปออก
                pictureStr = ""; 
            }

            // --- Payload Construction ---
            const payload: any = {
                title: values.activityName,
                detail: values.description,
                start_date: startDate,
                stop_date: endDate,
                organizer: values.organizer,
                type: values.type,
                status: editingPost ? editingPost.status : "pending",
                picture: pictureStr, // ใช้ค่าที่คำนวณใหม่
                user_id: 1, 
                proposal_activity_id: 1, 
            };

            if (editingPost) {
                payload.ID = editingPost.ID;
            }

            console.log("Submitting Payload:", payload);

            let res;
            if (editingPost) {
                res = await UpdatePost(editingPost.ID, payload as UpdatePostRequest);
            } else {
                res = await CreatePost(payload as CreatePostRequest);
            }

            if (res && (res.status === 200 || res.status === 201)) {
                message.success(editingPost ? 'แก้ไขข้อมูลสำเร็จ' : 'สร้างกิจกรรมสำเร็จ');
                handleCloseCreate(); // Reset ทุกอย่าง
                await fetchPosts();
            } else {
                const errorMsg = res?.data?.error || 'ข้อมูลไม่ถูกต้อง';
                message.error(`บันทึกไม่สำเร็จ: ${errorMsg}`);
            }

        } catch (error) {
            console.error(error);
            message.error('เกิดข้อผิดพลาดที่ไม่คาดคิด');
        } finally {
            setLoading(false);
        }
    };

    // 3. Delete
    const handleDelete = async (id: number) => {
        try {
            const res = await DeletePost(id);
            if (res && res.status === 200) {
                message.success('ลบข้อมูลสำเร็จ');
                setPosts((prev) => prev.filter((p) => p.ID !== id));
            } else {
                message.error('ลบข้อมูลไม่สำเร็จ');
            }
        } catch (error) {
            message.error('เกิดข้อผิดพลาดในการเชื่อมต่อ');
        }
    };

    // 4. Update Status
    const handleUpdateStatus = async (post: Postmanage, status: string, reason?: string) => {
        const payload: any = {
            ID: post.ID,
            title: post.title,
            detail: post.detail,
            status: status,
            start_date: post.start_date,
            stop_date: post.stop_date,
            organizer: post.organizer,
            type: post.type,
            picture: post.picture,
            user_id: post.user_id || 1,
            proposal_activity_id: post.proposal_activity_id || 1
        };

        try {
            const res = await UpdatePost(post.ID, payload);
            if (res && res.status === 200) {
                message.success(`อัปเดตสถานะเรียบร้อย`);
                await fetchPosts();
            } else {
                message.error('เกิดข้อผิดพลาด');
            }
        } catch (error) {
            message.error('เชื่อมต่อไม่ได้');
        }
    };

    // ==========================================
    // UI HANDLERS
    // ==========================================

    const handleOpenCreate = () => {
        setEditingPost(null);
        form.resetFields();
        setFileList([]); // เคลียร์รูป
        setCurrentView('create');
    };

    const handleCloseCreate = () => {
        setEditingPost(null);
        form.resetFields();
        setFileList([]); // เคลียร์รูป
        setCurrentView('dashboard');
    }

    const handleOpenEdit = (post: Postmanage) => {
        setEditingPost(post);

        const formatDate = (date: any) => {
            if (!date) return '';
            const d = new Date(date);
            if (isNaN(d.getTime())) return '';
            return d.toISOString().split('T')[0];
        };

        // Set ค่าเข้า Form
        form.setFieldsValue({
            activityName: post.title,
            description: post.detail,
            startDate: formatDate(post.start_date),
            endDate: formatDate(post.stop_date),
            organizer: post.organizer,
            type: post.type,
        });

        // 📌 Set รูปภาพเดิมเข้า fileList เพื่อให้โชว์ Preview
        if (post.picture) {
            // เช็คว่ารูปมี header data:image ไหม ถ้าไม่มีให้เติม (เพื่อการแสดงผล)
            const imageUrl = post.picture.startsWith('data:') 
                ? post.picture 
                : `data:image/jpeg;base64,${post.picture}`;

            setFileList([
                {
                    uid: '-1', // uid ติดลบเพื่อบอกว่าเป็นไฟล์เก่า
                    name: 'current_image.png',
                    status: 'done',
                    url: imageUrl,
                }
            ]);
        } else {
            setFileList([]);
        }

        setCurrentView('create');
    };

    const showRejectModal = (id: number) => {
        setRejectId(id);
        setRejectReason('');
        setIsRejectModalOpen(true);
    };

    const handleRejectSubmit = async () => {
        if (rejectId) {
            const targetPost = posts.find(p => p.ID === rejectId);
            if (targetPost) {
                await handleUpdateStatus(targetPost, 'rejected', rejectReason);
            }
            setIsRejectModalOpen(false);
        }
    };

    // Filter Logic & Stats
    const safePosts = Array.isArray(posts) ? posts : [];
    const filteredPosts = safePosts.filter(post => {
        if (currentTab === 'กิจกรรมทั้งหมด') return true;
        if (currentTab === 'โพสต์รออนุมัติ') return post.status === 'pending';
        if (currentTab === 'ผลงานรออนุมัติ') return post.status === 'pending_work';
        return true;
    });

    const stats = [
        { title: 'กิจกรรมทั้งหมด', count: safePosts.length, icon: <StarOutlined />, id: 1 },
        { title: 'อนุมัติแล้ว', count: safePosts.filter(p => p.status === 'approved').length, icon: <CheckSquareOutlined />, id: 2 },
        { title: 'โพสต์รออนุมัติ', count: safePosts.filter(p => p.status === 'pending').length, icon: <ClockCircleOutlined />, id: 3 },
        { title: 'ผลงานรออนุมัติ', count: safePosts.filter(p => p.status === 'pending_work').length, icon: <FolderOutlined />, id: 4 },
    ];

    const renderStatusTag = (status: string) => {
        switch (status) {
            case 'approved': return <Tag color="success">อนุมัติแล้ว</Tag>;
            case 'pending': return <Tag color="warning">รออนุมัติ</Tag>;
            case 'rejected': return <Tag color="error">ไม่อนุมัติ</Tag>;
            case 'pending_work': return <Tag color="blue">ผลงานรออนุมัติ</Tag>;
            default: return <Tag color="default">{status}</Tag>;
        }
    };

    // ==========================================
    // RENDER UI
    // ==========================================

    if (currentView === 'dashboard') {
        return (
            <Layout style={{ minHeight: '100vh', background: '#fff', padding: '24px' }}>
                <Row gutter={[16, 16]} style={{ marginBottom: '32px' }}>
                    {stats.map((stat) => (
                        <Col xs={24} sm={12} md={6} key={stat.id}>
                            <Card hoverable style={{ borderRadius: '12px', border: '1px solid #f0f0f0' }} bodyStyle={{ padding: '20px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                    <div>
                                        <Text type="secondary">{stat.title}</Text>
                                        <Title level={2} style={{ margin: '8px 0 0' }}>{stat.count}</Title>
                                    </div>
                                    <div style={{ fontSize: '24px', color: '#595959' }}>{stat.icon}</div>
                                </div>
                            </Card>
                        </Col>
                    ))}
                </Row>

                <div style={{ marginBottom: '32px' }}>
                    <ConfigProvider theme={{ components: { Segmented: { borderRadius: 24, borderRadiusLG: 24, itemSelectedBg: '#fff', trackBg: '#f0f0f0' } } }}>
                        <Segmented block options={['กิจกรรมทั้งหมด', 'โพสต์รออนุมัติ', 'ผลงานรออนุมัติ']} value={currentTab} onChange={(val) => setCurrentTab(val as string)} size="large" style={{ padding: '4px', borderRadius: '24px' }} />
                    </ConfigProvider>
                </div>

                <Card style={{ borderRadius: '16px', border: '1px solid #d9d9d9', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }} bodyStyle={{ padding: '32px' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <Title level={3} style={{ marginBottom: '16px' }}>{currentTab}</Title>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                            <Space>
                                <FilterOutlined style={{ color: '#bfbfbf' }} />
                                <Text type="secondary">Filter par:</Text>
                                <Select defaultValue="all" style={{ width: 160, background: '#f5f5f5' }} bordered={false} options={[{ value: 'all', label: 'ทั้งหมด' }]} />
                            </Space>
                            {currentTab === 'กิจกรรมทั้งหมด' && (
                                <Button type="primary" icon={<PlusOutlined />} onClick={handleOpenCreate} style={{ background: '#000', borderColor: '#000', borderRadius: '8px', height: '40px', padding: '0 24px' }}>
                                    สร้างกิจกรรมใหม่
                                </Button>
                            )}
                        </div>
                    </div>

                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                        {loading ? <div style={{ textAlign: 'center', padding: '20px' }}>กำลังโหลดข้อมูล...</div> :
                            filteredPosts.length === 0 ? <div style={{ textAlign: 'center', padding: '20px', color: '#999' }}>ไม่พบข้อมูล</div> :
                                filteredPosts.map((post) => (
                                    <Card key={post.ID} style={{ borderRadius: '12px', border: '1px solid #d9d9d9' }} bodyStyle={{ padding: '24px', position: 'relative' }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                            <div>
                                                <Title level={4} style={{ margin: 0 }}>{post.title}</Title>
                                                <Space style={{ marginTop: 8, marginBottom: 8 }}>
                                                    {renderStatusTag(post.status)}
                                                    <Text type="secondary">| {new Date(post.start_date!).toLocaleDateString('th-TH')}</Text>
                                                </Space>
                                            </div>
                                        </div>
                                        <Text type="secondary" ellipsis={{ tooltip: post.detail }} style={{ display: 'block', marginBottom: 16 }}>{post.detail}</Text>
                                        
                                        {/* Actions */}
                                        {currentTab === 'กิจกรรมทั้งหมด' ? (
                                            <div style={{ position: 'absolute', top: '24px', right: '24px' }}>
                                                <Space size="middle">
                                                    <EditOutlined style={{ fontSize: '20px', cursor: 'pointer', color: '#1890ff' }} onClick={() => handleOpenEdit(post)} />
                                                    <Popconfirm title="ยืนยันการลบ?" onConfirm={() => handleDelete(post.ID)} okText="ลบ" cancelText="ยกเลิก" okButtonProps={{ danger: true }}>
                                                        <DeleteOutlined style={{ fontSize: '20px', color: '#ff4d4f', cursor: 'pointer' }} />
                                                    </Popconfirm>
                                                </Space>
                                            </div>
                                        ) : (
                                            <div style={{ marginTop: '20px', textAlign: 'right' }}>
                                                <Space>
                                                    <Button danger icon={<CloseCircleOutlined />} onClick={() => showRejectModal(post.ID)}>ไม่อนุมัติ</Button>
                                                    <Button type="primary" icon={<CheckSquareFilled />} style={{ backgroundColor: '#28a745' }} onClick={() => handleUpdateStatus(post, 'approved')}>อนุมัติ</Button>
                                                </Space>
                                            </div>
                                        )}
                                    </Card>
                                ))}
                    </Space>
                </Card>

                <Modal title="ไม่อนุมัติ" open={isRejectModalOpen} onCancel={() => setIsRejectModalOpen(false)} onOk={handleRejectSubmit}>
                    <TextArea rows={4} value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} />
                </Modal>
            </Layout>
        );
    }

    // VIEW: CREATE / EDIT
    if (currentView === 'create') {
        return (
            <Layout style={{ minHeight: '100vh', background: '#fff', padding: '24px' }}>
                <Card style={{ borderRadius: '16px', border: '1px solid #d9d9d9', maxWidth: '1000px', margin: '0 auto', width: '100%' }} bodyStyle={{ padding: '40px' }}>
                    <div style={{ marginBottom: '24px' }}>
                        <Button type="text" icon={<ArrowLeftOutlined />} onClick={handleCloseCreate} style={{ fontSize: '16px', padding: 0 }}>
                            กลับหน้าหลัก
                        </Button>
                    </div>

                    <Title level={3} style={{ marginBottom: '24px' }}>
                        {editingPost ? 'แก้ไขกิจกรรม' : 'สร้างกิจกรรมใหม่'}
                    </Title>

                    <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
                        <Form.Item name="activityName" label="ชื่อกิจกรรม" rules={[{ required: true }]}>
                            <Input size="large" style={{ borderRadius: '8px' }} />
                        </Form.Item>

                        <Form.Item name="description" label="รายละเอียดกิจกรรม" rules={[{ required: true }]}>
                            <TextArea rows={4} size="large" style={{ borderRadius: '8px' }} />
                        </Form.Item>

                        <Row gutter={24}>
                            <Col span={12}>
                                <Form.Item name="startDate" label="เริ่มต้นกิจกรรม" rules={[{ required: true }]}>
                                    <Input size="large" style={{ borderRadius: '8px' }} type="date" />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item name="endDate" label="สิ้นสุดกิจกรรม" rules={[{ required: true }]}>
                                    <Input size="large" style={{ borderRadius: '8px' }} type="date" />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Form.Item name="organizer" label="ผู้จัดกิจกรรม" rules={[{ required: true }]}>
                            <Input size="large" style={{ borderRadius: '8px' }} />
                        </Form.Item>

                        <Form.Item name="type" label="ประเภทกิจกรรม" rules={[{ required: true }]}>
                            <Select size="large" style={{ borderRadius: '8px' }}>
                                <Select.Option value="online">Online</Select.Option>
                                <Select.Option value="onsite">Onsite</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item label="อัปโหลดรูปภาพ">
                            {/* 📌 แก้ไข: ผูก fileList state */}
                            <Upload
                                listType="picture-card"
                                maxCount={1}
                                beforeUpload={() => false}
                                fileList={fileList}
                                onChange={onFileChange}
                            >
                                {fileList.length < 1 && <div><UploadOutlined style={{ fontSize: '24px', color: '#595959' }} /></div>}
                            </Upload>
                        </Form.Item>

                        <div style={{ marginTop: '40px' }}>
                            <Space>
                                <Button size="large" style={{ borderRadius: '8px', width: '120px' }} onClick={handleCloseCreate}>
                                    ยกเลิก
                                </Button>
                                <Button type="primary" size="large" htmlType="submit" loading={loading} style={{ background: '#000', borderColor: '#000', borderRadius: '8px', width: '120px' }}>
                                    บันทึก
                                </Button>
                            </Space>
                        </div>
                    </Form>
                </Card>
            </Layout>
        );
    }

    return null;
};

export default ActivityManager;