import express, {
  Application,
  ErrorRequestHandler,
  Request,
  Response,
} from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import globalErrorHandler from './midlewere/globalErrorHandler';
import notFoundRoute from './midlewere/notFoundRoute';
import router from './app/modules/route';
const app: Application = express();

// parser
app.use(cors({ origin: '*', credentials: true }));
app.use(cookieParser());
app.use(express.json());

// Serve static files
// app.use('src/uploads', express.static(path.join(__dirname, 'uploads')));
// Serve the public folder statically
app.use('/public', express.static('public'));

app.use('/api', router);

const getController = (req: Request, res: Response) => {
  res.send('storage management systems');
};
app.get('/', getController);

app.use(notFoundRoute);
app.use(globalErrorHandler as unknown as ErrorRequestHandler);

export default app;
