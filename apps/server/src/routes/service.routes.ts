import { Router } from 'express';
import { serviceController } from '../controllers/service.controller';
import { authenticate } from '../middleware/auth';

const router = Router();

router.get('/categories', (req, res, next) => serviceController.getCategories(req, res, next));
router.get('/', (req, res, next) => serviceController.getServices(req, res, next));
router.get('/:id', (req, res, next) => serviceController.getServiceById(req, res, next));

router.use(authenticate);
router.post('/orders', (req, res, next) => serviceController.createOrder(req, res, next));
router.get('/orders/list', (req, res, next) => serviceController.getOrders(req, res, next));
router.get('/orders/:id', (req, res, next) => serviceController.getOrderById(req, res, next));
router.put('/orders/:id/status', (req, res, next) => serviceController.updateOrderStatus(req, res, next));
router.post('/orders/:id/review', (req, res, next) => serviceController.reviewOrder(req, res, next));

export default router;
