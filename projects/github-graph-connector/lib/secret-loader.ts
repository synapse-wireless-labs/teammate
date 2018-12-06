import * as fs from 'fs';

const SECRET_FILE_PATH = '../github-api.secret';

export function readFileWithPromise(fullPath: string) {
  return new Promise<string>((resolve, reject) => {
    fs.readFile(fullPath, { encoding: 'utf-8' }, (err, data) => {
      if (!err) {
        resolve(data);
      } else {
        reject(err);
      }
    });
  });
}
