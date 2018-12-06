interface UsernameResponse {
  data: {
    viewer: {
      login: string;
    };
  };
}
interface PullRequestsOnYourRepositoriesResponse {
  data: {
    viewer: {
      repositories: {
        nodes: Repository[];
      };
    };
  };
}
interface Repository {
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
interface PullRequestsWithMergeabilityStatusResponse {
  data: {
    viewer: {
      pullRequests: {
        nodes: PullRequestWithMergeabilityStatus[];
      };
    };
  };
}
interface PullRequestWithMergeabilityStatus {
  title: string;
  mergeable: 'MERGEABLE' | 'CONFLICTING' | 'UNKNOWN';
}

export {
  Repository,
  PullRequestsOnYourRepositoriesResponse,
  UsernameResponse,
  PullRequestsWithMergeabilityStatusResponse,
  PullRequestWithMergeabilityStatus
};
