import { Router } from 'express';
import { isAuthenticated } from '../middlewares';
import { EventController } from './events.controller';

export const eventsRouter = Router();
const eventController = new EventController();

eventsRouter.get('/', isAuthenticated, (req, res) => eventController.findEvent(req, res));
eventsRouter.post('/', isAuthenticated, (req, res) => eventController.createEvent(req, res));