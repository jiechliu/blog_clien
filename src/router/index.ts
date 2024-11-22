import { RouteConfig } from 'react-router-config'
import Cesium from '@/presentation/page/cesium'
import Collect from '@/presentation/page/collect';
import Detail from '@/presentation/page/detail';
import Home from '@/presentation/page/home';
import Login from '@/presentation/page/login';
import Mall from '@/presentation/page/mall';
import Register from '@/presentation/page/register';
import Release from '@/presentation/page/release';
import Search from '@/presentation/page/search';
import User from '@/presentation/page/user';
import UserSetting from '@/presentation/page/user-setting';
import Gold from '@/presentation/page/user/components/gold'
import UserAll from '@/presentation/page/user/components/user-all';

export const router: RouteConfig[] = [
  {
    path: '/',
    component: Home,
    exact: true,
  },
  {
    path: '/login',
    component: Login,
  },
  {
    path: '/register',
    component: Register,
  },
  {
    path: '/release',
    component: Release,
  },
  {
    path: '/detail/:id',
    component: Detail,
  },
  {
    path: '/user-setting',
    component: UserSetting,
  },
  {
    path: '/user/:id',
    component: User,
    exact: true,
  },
  {
    path: '/user-gold',
    component: Gold,
    exact: true,
  },
  {
    path: '/search',
    component: Search,
  },
  {
    path: '/user-all',
    component: UserAll,
  },
  {
    path: '/collect',
    component: Collect,
  },
  {
    path: '/cesium',
    component: Cesium,
  },
  {
    path: '/mall',
    component: Mall,
  },
];
