import * as GithubGraphConnector from './lib/github-graph-connector';
import { readFileWithPromise as readSecret } from './lib/secret-loader';
import * as path from 'path';

const fullPath = path.join(__dirname, './github-api.secret');

readSecret(fullPath)
  .then(secret =>
    GithubGraphConnector.getNumberOfPullRequestsYouAreRequestedToReview(secret)
  )
  .catch(error => console.error(error));

export { GithubGraphConnector };
