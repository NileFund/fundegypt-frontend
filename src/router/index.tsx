import { createBrowserRouter, Outlet } from 'react-router-dom'
import { ROUTES } from '../utils/constants'
import PageWrapper from '../components/layout/PageWrapper';


import LoginPage from '../pages/auth/LoginPage'

import RegisterPage from '../pages/auth/RegisterPage'
import ActivationPage from '../pages/auth/ActivationPage'
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage'
import ResetPasswordPage from '../pages/auth/ResetPasswordPage'

import UserProfilePage from '../pages/profile/UserProfilePage'
import EditProfilePage from '../pages/profile/EditProfilePage'
import MyDonationsPage from '../pages/profile/MyDonationsPage'
import DeleteAccountPage from '../pages/profile/DeleteAccountPage'

import ProjectDetailPage from '../pages/projects/ProjectDetailPage'
import CreateProjectPage from '../pages/projects/CreateProjectPage'
import EditProjectPage from '../pages/projects/EditProjectPage'
import ExplorePage from '../pages/projects/ExplorePage'

import HomePage from '../pages/home/HomePage'
import SearchResultsPage from '../pages/home/SearchResultsPage'
import CategoryBrowsePage from '../pages/home/CategoryBrowsePage'

import NotFoundPage from '../pages/error/NotFoundPage'


export const router = createBrowserRouter([

  {
    path: '/',
    element: (
      <PageWrapper>
        <Outlet />
      </PageWrapper>
    ),
    children: [
      { path: ROUTES.HOME, element: <HomePage /> },
      { path: ROUTES.PROFILE, element: <UserProfilePage /> },
      { path: ROUTES.EDIT_PROFILE, element: <EditProfilePage /> },
      { path: ROUTES.MY_DONATIONS, element: <MyDonationsPage /> },
      { path: ROUTES.EXPLORE, element: <ExplorePage /> },
      { path: ROUTES.PROJECT_DETAIL, element: <ProjectDetailPage /> },
      { path: ROUTES.CREATE_PROJECT, element: <CreateProjectPage /> },
      { path: ROUTES.EDIT_PROJECT, element: <EditProjectPage /> },
      { path: ROUTES.SEARCH, element: <SearchResultsPage /> },
      { path: ROUTES.CATEGORY, element: <CategoryBrowsePage /> },
      { path: ROUTES.NOT_FOUND, element: <NotFoundPage /> },
      { path: ROUTES.DELETE_ACCOUNT, element: <DeleteAccountPage /> },
    ],
  },
  // Auth routes (No Navbar/Footer)
  { path: ROUTES.LOGIN, element: <LoginPage /> },
  { path: ROUTES.REGISTER, element: <RegisterPage /> },
  { path: ROUTES.ACTIVATE, element: <ActivationPage /> },
  { path: ROUTES.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
  { path: ROUTES.RESET_PASSWORD, element: <ResetPasswordPage /> },
])