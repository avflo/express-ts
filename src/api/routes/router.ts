import { Router } from 'express';
import catsRoutes from './cats';

export default () => {
	const app = Router();
	catsRoutes(app);
    return app;
}