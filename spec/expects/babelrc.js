import path from 'path';
import {readFileSync} from 'fs';

export default JSON.parse(readFileSync(path.join(process.cwd(), '.babelrc')));