import express from 'express'
import cors from 'cors'
import morgan from 'morgan'
import authRouter from './routes/auth.routes.js';
import blogRouter from './routes/blog.routes.js';
import commentRouter from './routes/comment.routes.js';
import dotenv from 'dotenv'
dotenv.config()
import path from 'path';
import { fileURLToPath } from 'url';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.static(path.join(__dirname, 'public')));



app.use(cors());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.get('/',(req,res)=>{
    res.send('ok')
})
app.use('/api/auth', authRouter);
app.use('/api/blogs', blogRouter);
app.use('/api/comments', commentRouter);

app.listen(3001, 'localhost'); 
app.on('listening', function() {
    console.log('Express server started on port %s at %s', server.address().port, server.address().address);
});