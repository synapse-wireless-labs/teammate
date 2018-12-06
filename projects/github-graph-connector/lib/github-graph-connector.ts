import { IncomingMessage } from 'http';
import * as https from 'https';

import {
  PULL_REQUESTS_NEEDING_REVIEW_QUERY,
  USERNAME_QUERY
} from './gql-queries';

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
    generatePostOptions(secret, PULL_REQUESTS_NEEDING_REVIEW_QUERY),
    PULL_REQUESTS_NEEDING_REVIEW_QUERY
  ) as Promise<PullRequestsOnYourRepositories>;
}

function getYourUsername(secret: string) {
  return promisePost(
    generatePostOptions(secret, USERNAME_QUERY),
    USERNAME_QUERY
  ) as Promise<Username>;
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
interface Username {
  data: {
    viewer: {
      login: string;
    };
  };
}
interface PullRequestsOnYourRepositories {
  data: {
    viewer: {
      repositories: Repositories;
    };
  };
}
interface Repositories {
  nodes: [
    {
      name: string;
      pullRequests: {
        nodes: [
          {
            title: string;
            permalink: string;
            author: {
              login: string;
            };
            reviewRequests: {
              nodes: [
                {
                  requestedReviewer: {
                    login: string;
                  };
                }
              ];
            };
          }
        ];
      };
    }
  ];
}

export {
  getYourUsername,
  getNumberOfPullRequestsYouAreRequestedToReview,
  getPullRequestsOnRepositoryOfLoggedInUser
};
