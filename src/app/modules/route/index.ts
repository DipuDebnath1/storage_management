
import { favoriteRoute } from '../favorites/favorites.route';
import { fileRoute } from '../file/file.route';
import { folderRoute } from '../folder/folder.route';
import { UserRoute } from '../user/user.route';
import express from 'express';

const router = express.Router();
const moduleRoute = [
  {
    path: '/auth',
    route: UserRoute,
  },
  {
    path: '/folder',
    route: folderRoute,
  },
  {
    path: '/storage',
    route: fileRoute,
  },
  {
    path: '/favorite',
    route: favoriteRoute,
  },
];

moduleRoute.forEach((route) => {
  router.use(route.path, route.route);
});

export default router;
