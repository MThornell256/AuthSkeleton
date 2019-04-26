import * as express from 'express';
import { Request, Response } from 'express';

// Webpack + Typescript + Express + NodeJS Example
// Also has unit test examples
// https://medium.com/the-andela-way/how-to-set-up-an-express-api-using-webpack-and-typescript-69d18c8c4f52

const app = express();

const {
  PORT = 3000,
} = process.env;

app.get('/', (request: Request, response: Response) => {
  response.send('supsss');
});

app.listen(PORT, () => {
  console.log('server started at http://localhost:' + PORT);
});