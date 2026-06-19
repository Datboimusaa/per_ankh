import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { PORT, FRONTEND_URL } from './src/config/env.js';
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';
import workspaceRoutes from './src/routes/workspace.routes.js';
import memberRoutes from './src/routes/members.routes.js';
import boardRoutes from './src/routes/board.routes.js';
import errorMiddleware from './src/middlewares/error.middleware.js';

const app = express();


/* MIDDLEWARES */
app.use(express.json());
app.use(cors({
    origin: `${FRONTEND_URL}`,
    credentials: true
}));
app.use(cookieParser());


/* ROUTES */
app.get('/', (req, res) => {
    res.send("API is running");
});
app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/workspaces', workspaceRoutes)
app.use('/api/workspaces', memberRoutes)
app.use('/api/workspaces', boardRoutes)

/* ERROR MIDDLEWARE */
app.use(errorMiddleware);


app.listen(PORT, ()=> {
    console.log(`API is running on http://localhost:${PORT}`);
});