import type { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import ProtectedRoute from './ProtectedRoute';
import AdminLayout from '@/layout/admin/AdminLayout';
import { Loadable } from '@/utils/Loadable';

const AdminProfileSkill = Loadable(lazy(() => import('@/pages/admin/profile-skill')));
const AdminActivity = Loadable(lazy(() => import('@/pages/admin/activity')));
const AdminProposals = Loadable(lazy(() => import('@/pages/admin/proposals')));
const AdminCommunication = Loadable(lazy(() => import('@/pages/admin/communication')));
const AdminTeams = Loadable(lazy(() => import('@/pages/admin/teams')));
const AdminFeedback = Loadable(lazy(() => import('@/pages/admin/feedback')));
const AdminResults = Loadable(lazy(() => import('@/pages/admin/results')));
const AdminPortfolio = Loadable(lazy(() => import('@/pages/admin/portfolio')));
const AdminCertificates = Loadable(lazy(() => import('@/pages/admin/certificates')));
const AdminPoints = Loadable(lazy(() => import('@/pages/admin/points')));
const AdminSetting = Loadable(lazy(() => import('@/pages/admin/setting/Setting')));
const AdminPointsRewards = Loadable(lazy(() => import('@/pages/admin/points/rewards')));
const AdminEvents = Loadable(lazy(() => import('@/pages/admin/events')));

export const adminRoutes: RouteObject[] = [
  {
    path: '/admin',
    element: (
      <ProtectedRoute allowedRoles={['admin']}>
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminProposals/>,
      },
      {
        path: 'profile-skill',
        element: <AdminProfileSkill />,
      },
      
      {
        path: 'activity',
        element: <AdminActivity />,
      },
      
      {
        path: 'proposals',
        element: <AdminProposals />,
      },
      // ระบบสื่อสารภายในกิจกรรม
      {
        path: 'communication',
        element: <AdminCommunication />,
      },
      // ระบบลงทะเบียนและจัดการทีม
      {
        path: 'teams',
        element: <AdminTeams />,
      },
      // ระบบประเมินและความคิดเห็นกิจกรรม
      {
        path: 'feedback',
        element: <AdminFeedback />,
      },
      // ระบบประกาศผลและสรุปกิจกรรม
      {
        path: 'results',
        element: <AdminResults />,
      },
      // ระบบคลังผลงานนักศึกษา
      {
        path: 'portfolio',
        element: <AdminPortfolio />,
      },
      // ระบบรับรองผลการเข้าร่วมกิจกรรม
      {
        path: 'certificates',
        element: <AdminCertificates />,
      },
      // ระบบสะสมคะแนน
      {
        path: 'points',
        element: <AdminPoints />,
      },
      {
        path: 'points/rewards',
        element: <AdminPointsRewards />,
      },
      {
        path: 'setting',
        element: <AdminSetting/>,
      },
      {
        path: 'events',
        element: <AdminEvents />,
      },
    ],
  },
];
