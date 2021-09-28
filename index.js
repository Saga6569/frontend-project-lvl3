import app from './src/index.js';
import 'bootstrap';

export default () => new Promise((resolve) => (resolve(app())));
