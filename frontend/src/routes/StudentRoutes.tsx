import type { RouteObject } from 'react-router-dom';
import { lazy } from 'react';
import ProtectedRoute from './ProtectedRoute';
import StudentLayout from '@/layout/student/StudentLayout';
import { Loadable } from '@/utils/Loadable';
const StudentSetting = Loadable(lazy(() => import('@/pages/student/setting/Setting')));
const StudentProfileSkill = Loadable(lazy(() => import('@/pages/student/profile-skill/StudentProfile')));
const StudentEvents = Loadable(lazy(() => import('@/pages/student/events')));
const StudentProposal_Activity = Loadable(lazy(() => import("@/pages/student/activity/proposal_Activity"))) ;
const StudentActivities = Loadable(lazy(() => import("@/pages/student/activity"))) ;
const ActivityDetail = Loadable(lazy(() => import("@/pages/student/activity/ActivityDetail.tsx")));
const ActivityRegistration = Loadable(lazy(() => import("@/pages/student/registration/ActivityRegistration")));
const StudentCommunication = Loadable(lazy(() => import('@/pages/student/communication')));
const StudentTeams = Loadable(lazy(() => import('@/pages/student/teams')));
const StudentFeedback = Loadable(lazy(() => import('@/pages/student/feedback')));
const StudentResults = Loadable(lazy(() => import('@/pages/student/results')));
const StudentPortfolio = Loadable(lazy(() => import('@/pages/student/portfolio')));
const StudentPortfolioCreate = Loadable(lazy(() => import('@/pages/student/portfolio/create')));
const StudentPortfolioDetail = Loadable(lazy(() => import('@/pages/student/portfolio/detail')));
const StudentCertificates = Loadable(lazy(() => import('@/pages/student/certificates')));
const StudentPoints = Loadable(lazy(() => import('@/pages/student/points')));
const StudentPointsReward = Loadable(lazy(() => import('@/pages/student/points/reward')));
const EditProfile = Loadable(lazy(() => import('@/pages/student/profile-skill/EditProfile')));
const ProfileDemo = Loadable(lazy(() => import('@/pages/student/profile-skill/ProfileDemo')));


export const studentRoutes: RouteObject[] = [
  {
    path: "/student",
    element: (
      // <StudentLayout />
      <ProtectedRoute allowedRoles={["student"]}>
        <StudentLayout />
      </ProtectedRoute>
    ),
    children: [
      {
        index: true,
        element: <StudentEvents />,
      },

      {
        path: "profile-skill",
        element: <StudentProfileSkill />,
      },
      {
        path: "profile-skill/edit",
        element: <EditProfile />,
      },
      {
        path: "profile-skill/:userId",
        element: <StudentProfileSkill />,
      },
      {
        path: "profile-skill/demo",
        element: <ProfileDemo />,
      },
      {
        path: "events",
        element: <StudentEvents />,
      },
      
      { path: "activities/postactivities", 
        element: <StudentProposal_Activity /> 
      },

      { 
        path: "activities/:id", 
        element: <ActivityDetail /> 
      },

      { path: "activity", 
        element: <StudentActivities /> 
      },

      { 
        path: "activities/:id/register", 
        element: <ActivityRegistration /> 
      },

      {
        path: "communication",
        element: <StudentCommunication />,
      },

      {
        path: "teams",
        element: <StudentTeams />,
      },

      {
        path: "feedback",
        element: <StudentFeedback />,
      },
      {
        path: "results",
        element: <StudentResults />,
      },
      {
        path: "portfolio",
        element: <StudentPortfolio />,
      },
      {
        path: 'portfolio/create',
        element: <StudentPortfolioCreate />,
      },
      {
        path: 'portfolio/:id',
        element: <StudentPortfolioDetail />,
      },
      {
        path: 'certificates',
        element: <StudentCertificates />,
      },
      {
        path: "points",
        element: <StudentPoints />,
      },
      {
        path: 'points/reward',
        element: <StudentPointsReward />,
      },
      {
        path: 'setting',
        element: <StudentSetting />,
      },
    ],
  },
];
