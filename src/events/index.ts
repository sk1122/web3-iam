import { Router } from 'express';
import { EventController } from './events.controller';

export const eventsRouter = Router();
const eventController = new EventController();

eventsRouter.get('/', (req, res) => eventController.findEvent(req, res));
eventsRouter.post('/', (req, res) => eventController.createEvent(req, res));
eventsRouter.patch('/add-data', (req, res) => eventController.addEventData(req, res));
