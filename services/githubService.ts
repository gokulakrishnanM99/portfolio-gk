import { GitHubRepo } from '../types';
import { HIDDEN_REPOS, HIDDEN_REPO_TOPICS } from '../constants';

const USERNAME = 'gokulakrishnanM99';

export const fetchGitHubRepos = async (): Promise<GitHubRepo[]> => {
  try {
    const response = await fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=100`);
    if (!response.ok) {
      throw new Error('Failed to fetch repositories');
    }
    const data: GitHubRepo[] = await response.json();
    
    // Filter out hidden repos by name or topic
    const filteredRepos = data.filter((repo) => {
      if (HIDDEN_REPOS.includes(repo.name)) return false;
      if (repo.topics && repo.topics.some(topic => HIDDEN_REPO_TOPICS.includes(topic.toLowerCase()))) return false;
      return true;
    });

    return filteredRepos;
  } catch (error) {
    console.error("Error fetching repos:", error);
    return [];
  }
};
