import * as GithubGraphConnector from './lib/github-graph-connector';
import { readFileWithPromise as readSecret } from './lib/secret-loader';
import * as path from 'path';

const fullPath = path.join(__dirname, './github-api.secret');

readSecret(fullPath)
  .then(secret => {
    GithubGraphConnector.getNumberOfPullRequestsYouAreRequestedToReview(
      secret
    ).then(numberOfPullRequestsToReview =>
      console.log(
        'Number of pull requests to review: ' + numberOfPullRequestsToReview
      )
    );

    GithubGraphConnector.getNumberOfOpenPullRequestsWithABuildRunning(
      secret
    ).then((numberOfBuilds: any) =>
      console.log(
        "Number of pull requests you've created with builds running: " +
          numberOfBuilds
      )
    );
  })
  .catch(error => console.error(error));

export { GithubGraphConnector };
