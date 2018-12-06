import { IncomingMessage } from 'http';
import * as https from 'https';

const USERNAME_QUERY = JSON.stringify({
  query: `
    query getUserName {
      viewer {
        login
      }
    }
  `
});
const PULL_REQUEST_QUERY = JSON.stringify({
  query: `
    query getPullRequestsOnRepositoryOfLoggedInUser {
      viewer {
        repositories(last: 100) {
          nodes {
            name,
            pullRequests(last: 10) {
              nodes {
                title
                permalink
                author {
                  login
                }
                reviewRequests(last: 5) {
                  nodes {
                    requestedReviewer {
                      ... on User {
                        login
                      }
                    }
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

  static promisePost(postOptions: any, postData: any) {
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
            responseJson = JSON.parse(responseDataStream);
            resolve(responseJson);
          });
        })
        .on('error', (error: Error) =>
          console.error(`An HTTP error occurred: ${error.message}`)
        );
      client.write(postData);
      client.end();
    });
  }
  static getPullRequestsOnRepositoryOfLoggedInUser() {
    const secret = 'acd9375999df0526553b2bd45c239055027157f9';
    const options = {
      hostname: 'api.github.com',
      path: '/graphql',
      method: 'POST',
      headers: {
        Authorization: `bearer ${secret}`,
        'User-Agent': 'teammate',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(PULL_REQUEST_QUERY)
      }
    };
    return this.promisePost(options, PULL_REQUEST_QUERY) as Promise<
      PullRequestsOnYourRepositories
    >;
  }

  static getYourUsername() {
    const secret = 'acd9375999df0526553b2bd45c239055027157f9';
    const options = {
      hostname: 'api.github.com',
      path: '/graphql',
      method: 'POST',
      headers: {
        Authorization: `bearer ${secret}`,
        'User-Agent': 'teammate',
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(USERNAME_QUERY)
      }
    };
    return this.promisePost(options, USERNAME_QUERY) as Promise<Username>;
  }

  static async getNumberOfPullRequestsYouAreRequestedToReview() {
    const username = (await this.getYourUsername()).data.viewer.login;
    const repositories = (await this.getPullRequestsOnRepositoryOfLoggedInUser())
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
interface PullRequest {
  title: string;
  permalink: string;
  author: {
    login: string;
  };
}
