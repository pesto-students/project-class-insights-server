import bodyParser from 'body-parser';
import morgan from 'morgan';
import compression from 'compression';
import cors from 'cors';
import helmet from 'helmet';

export default (app) => {
  app.use(cors());
  app.use(helmet());
  app.use(morgan('dev'));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(compression());
};
