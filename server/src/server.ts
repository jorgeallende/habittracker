//Back-end API RESTful em Nodejs

import fastify from 'fastify';
import cors from '@fastify/cors';
import { appRoutes } from './routes';

const app = fastify({ logger: true });
app.register(cors);
app.register(appRoutes);

app
	.listen({
		port: 3333
	})
	.then(() => {
		console.log('Server is running on port 3333');
	});
