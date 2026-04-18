import { createBrowserRouter, Outlet } from 'react-router-dom';
import { ROUTES } from '../utils/constants';
import PageWrapper from '../components/layout/PageWrapper';

// Auth
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';
import ActivationPage from '../pages/auth/ActivationPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';

// Profile Components
import ProfilePage from '../pages/profile/ProfilePage';
import AboutTab from '../pages/profile/components/AboutTab';
import MyDonationsTab from '../pages/profile/components/MyDonationsTab';
import MyProjectsTab from '../pages/profile/components/MyProjectsTab';

// Projects
import ProjectDetailPage from '../pages/projects/ProjectDetailPage';
import CreateProjectPage from '../pages/projects/CreateProjectPage';
import EditProjectPage from '../pages/projects/EditProjectPage';
import ExplorePage from '../pages/projects/ExplorePage';

// Home & Misc
import HomePage from '../pages/home/HomePage';
import SearchResultsPage from '../pages/home/SearchResultsPage';
import CategoryBrowsePage from '../pages/home/CategoryBrowsePage';
import NotFoundPage from '../pages/error/NotFoundPage';
import CategoryDetailPage from '../pages/home/CategoryDetailPage';

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
      { path: ROUTES.EXPLORE, element: <ExplorePage /> },
      { path: ROUTES.PROJECT_DETAIL, element: <ProjectDetailPage /> },
      { path: ROUTES.CREATE_PROJECT, element: <CreateProjectPage /> },
      { path: ROUTES.EDIT_PROJECT, element: <EditProjectPage /> },
      { path: ROUTES.SEARCH, element: <SearchResultsPage /> },
      { path: ROUTES.CATEGORY, element: <CategoryBrowsePage /> },
      { path: ROUTES.CATEGORY_DETAIL, element: <CategoryDetailPage /> },

      // Profile Feature
      {
        path: ROUTES.PROFILE,
        element: <ProfilePage />,
        children: [
          { index: true, element: <AboutTab /> },
          { path: ROUTES.MY_DONATIONS, element: <MyDonationsTab /> },
          { path: ROUTES.MY_PROJECTS, element: <MyProjectsTab /> },

          { path: ROUTES.EDIT_PROFILE, element: <AboutTab /> },
          { path: ROUTES.DELETE_ACCOUNT, element: <AboutTab /> },
        ],
      },

      { path: ROUTES.NOT_FOUND, element: <NotFoundPage /> },
    ],
  },

  // Auth pages — no navbar/footer
  { path: ROUTES.LOGIN, element: <LoginPage /> },
  { path: ROUTES.REGISTER, element: <RegisterPage /> },
  { path: ROUTES.ACTIVATE, element: <ActivationPage /> },
  { path: ROUTES.FORGOT_PASSWORD, element: <ForgotPasswordPage /> },
  { path: ROUTES.RESET_PASSWORD, element: <ResetPasswordPage /> },
]);