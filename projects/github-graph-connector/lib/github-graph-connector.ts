import { IncomingMessage } from 'http';
import * as https from 'https';

import {
  OPEN_PULL_REQUESTS_WITH_MERGEABILITY_STATUS_QUERY,
  REPOSITORIES_WITH_OPEN_PULL_REQUESTS_WITH_REQUESTED_REVIEWERS_QUERY,
  USERNAME_QUERY
} from './gql-queries';
import {
  PullRequestsOnYourRepositoriesResponse,
  UsernameResponse,
  PullRequestsWithMergeabilityStatusResponse
} from './models';

const API_URL = 'https://api.github.com/graphql';

// TODO: allow arbitrary HTTP client
// TODO: regenerate secret if expired
function generatePostOptions(secret: string, query: string) {
  return {
    hostname: 'api.github.com',
    path: '/graphql',
    method: 'POST',
    headers: {
      Authorization: `bearer ${secret}`,
      'User-Agent': 'teammate',
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(query)
    }
  };
}
function promisePost(postOptions: any, postData: any) {
  return new Promise((resolve, reject) => {
    let responseDataStream = '';
    let responseJson: {};

    let client = https
      .request(postOptions, (res: IncomingMessage) => {
        res.on('error', reject);
        res.setEncoding('utf8');
        res.on(
          'data',
          chunk => (responseDataStream = responseDataStream.concat(chunk))
        );
        res.on('end', () => {
          try {
            responseJson = JSON.parse(responseDataStream);
            resolve(responseJson);
          } catch (error) {
            reject(error);
          }
        });
      })
      .on('error', (error: Error) => {
        console.error(`An HTTP error occurred: ${error.message}`);
        reject(error);
      });
    client.write(postData);
    client.end();
  });
}

function getPullRequestsOnRepositoryOfLoggedInUser(secret: string) {
  return promisePost(
    generatePostOptions(
      secret,
      REPOSITORIES_WITH_OPEN_PULL_REQUESTS_WITH_REQUESTED_REVIEWERS_QUERY
    ),
    REPOSITORIES_WITH_OPEN_PULL_REQUESTS_WITH_REQUESTED_REVIEWERS_QUERY
  ) as Promise<PullRequestsOnYourRepositoriesResponse>;
}

function getYourUsername(secret: string) {
  return promisePost(
    generatePostOptions(secret, USERNAME_QUERY),
    USERNAME_QUERY
  ) as Promise<UsernameResponse>;
}

async function getNumberOfPullRequestsYouAreRequestedToReview(secret: string) {
  const username = (await getYourUsername(secret)).data.viewer.login;
  const repositories = (await getPullRequestsOnRepositoryOfLoggedInUser(secret))
    .data.viewer.repositories;
  const repositoriesWithPullRequests = repositories.nodes.filter(
    repository => repository.pullRequests.nodes.length > 0
  );
  const numberOfPullRequestsToReview: number = repositoriesWithPullRequests.reduce(
    (previous, currentRepository) => {
      const toReview = currentRepository.pullRequests.nodes.filter(
        pullRequest => {
          return (
            pullRequest.reviewRequests.nodes.find(
              reviewRequest =>
                reviewRequest.requestedReviewer.login === username
            ) !== undefined
          );
        }
      ).length;
      return previous + toReview;
    },
    0
  );
  console.log({
    username: username,
    numberOfPullRequestsToReview: numberOfPullRequestsToReview,
    repositoriesWithPullRequests: repositoriesWithPullRequests.map(
      repository => {
        return {
          name: repository.name,
          pullRequests: repository.pullRequests.nodes.map(
            pullRequest => pullRequest.title
          )
        };
      }
    )
  });
  return numberOfPullRequestsToReview;
}

async function getNumberOfOpenPullRequestsWithABuildRunning(secret: string) {
  const openPullRequestsResponse = (await promisePost(
    generatePostOptions(
      secret,
      OPEN_PULL_REQUESTS_WITH_MERGEABILITY_STATUS_QUERY
    ),
    OPEN_PULL_REQUESTS_WITH_MERGEABILITY_STATUS_QUERY
  )) as PullRequestsWithMergeabilityStatusResponse;

  const openPullRequests =
    openPullRequestsResponse.data.viewer.pullRequests.nodes;

  console.log(openPullRequests);

  return openPullRequests.filter(
    pullRequest => pullRequest.mergeable === 'UNKNOWN'
  ).length;
}

export {
  getYourUsername,
  getNumberOfPullRequestsYouAreRequestedToReview,
  getPullRequestsOnRepositoryOfLoggedInUser,
  getNumberOfOpenPullRequestsWithABuildRunning
};
