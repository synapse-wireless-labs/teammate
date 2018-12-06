import { IncomingMessage } from 'http';
import * as https from 'https';

const QUERY = JSON.stringify({
  query: `
    query getPullRequestsOnRepositoryOfLoggedInUser {
      viewer {
        repositories(last: 100) {
          nodes {
            pullRequests(last: 100) {
              nodes {
                title
                permalink
                author {
                  login
                }
                reviewRequests(last: 20) {
                  nodes {
                    id
                  }
                }
              }
            }
          }
        }
      }
    }
  `
});
const SECRET_FILE_PATH = './github-api.secret';
const API_URL = 'https://api.github.com/graphql';

export class GithubGraphConnector {
  // TODO: allow reading secret from file
  // TODO: allow arbitrary secret filename
  // TODO: allow arbitrary HTTP requester
  secret: string;
  options: {
    method: 'POST';
    headers: {
      Authorization: string;
      'Content-Type': 'application/json';
      'Content-Length': number;
    };
  };

  constructor() {
    this.secret = '1a5fad2434cad102024da0a0e78d0ab36bdf95b1';
    this.options = {
      method: 'POST',
      headers: {
        Authorization: `bearer ${this.secret}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(QUERY)
      }
    };
  }

  static getPullRequestsOnRepositoryOfLoggedInUser() {
    const secret = '1a5fad2434cad102024da0a0e78d0ab36bdf95b1';
    const options = {
      hostname: 'api.github.com',
      path: '/graphql',
      method: 'POST',
      headers: {
        Authorization: `bearer ${secret}`,
        'User-Agent': 'teammate',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(QUERY)
      }
    };
    let responseDataStream = '';
    let responseJson = {};
    let client = https
      .request(options, (res: IncomingMessage) => {
        res.setEncoding('utf8');
        res.on(
          'data',
          chunk => (responseDataStream = responseDataStream.concat(chunk))
        );
        res.on('end', () => {
          responseJson = JSON.stringify(responseDataStream);
          console.log(responseJson);
        });
      })
      .on('error', (error: Error) =>
        console.error(`An HTTP error occurred: ${error.message}`)
      );
    client.write(QUERY);
    client.end();
  }
}
