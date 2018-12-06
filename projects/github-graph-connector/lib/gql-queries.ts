const USERNAME_QUERY = JSON.stringify({
  query: `
    query getUserName {
      viewer {
        login
      }
    }
  `
});
const PULL_REQUESTS_NEEDING_REVIEW_QUERY = JSON.stringify({
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

export { USERNAME_QUERY, PULL_REQUESTS_NEEDING_REVIEW_QUERY };
