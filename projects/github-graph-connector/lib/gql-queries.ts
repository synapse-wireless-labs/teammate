const USERNAME_QUERY = JSON.stringify({
  query: `
    query getUserName {
      viewer {
        login
      }
    }
  `
});
const REPOSITORIES_WITH_OPEN_PULL_REQUESTS_WITH_REQUESTED_REVIEWERS_QUERY = JSON.stringify(
  {
    query: `
    query getPullRequestsOnRepositoryOfLoggedInUser {
      viewer {
        repositories(last: 100) {
          nodes {
            name,
            pullRequests(states: OPEN, last: 10) {
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
  }
);
const OPEN_PULL_REQUESTS_WITH_MERGEABILITY_STATUS_QUERY = JSON.stringify({
  query: `
    query getOpenPullRequestsAndMergeability {
      viewer {
        pullRequests(states: OPEN, first: 100) {
          nodes {
            title,
            mergeable,
          }
        }
      }
    }
  `
});

export {
  USERNAME_QUERY,
  REPOSITORIES_WITH_OPEN_PULL_REQUESTS_WITH_REQUESTED_REVIEWERS_QUERY,
  OPEN_PULL_REQUESTS_WITH_MERGEABILITY_STATUS_QUERY
};
