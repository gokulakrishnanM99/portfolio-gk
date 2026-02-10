import { GitHubRepo } from '../types';

const USERNAME = 'gokulakrishnanM99';

export const fetchGitHubRepos = async (): Promise<GitHubRepo[]> => {
  try {
    const response = await fetch(`https://api.github.com/users/${USERNAME}/repos?sort=updated&per_page=100`);
    if (!response.ok) {
      throw new Error('Failed to fetch repositories');
    }
    const data = await response.json();
    // Filter out forks if desired, or keep them. Here we keep non-forks primarily, or all.
    // Let's keep all but sort by stars then updated.
    return data;
  } catch (error) {
    console.error("Error fetching repos:", error);
    return [];
  }
};
