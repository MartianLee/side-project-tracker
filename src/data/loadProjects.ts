import { GithubRepo, LocalGitInfo, ManualEntry, Project } from '../domain/types';
import { mergeProject } from '../domain/merge';

export interface AssembleDeps {
  workspaceMap: Map<string, string>;
  getLocalGitInfo: (path: string) => Promise<LocalGitInfo | null>;
  manual: Record<string, ManualEntry>;
}

export async function assembleProjects(
  repos: GithubRepo[],
  deps: AssembleDeps,
  now: Date,
): Promise<Project[]> {
  return Promise.all(
    repos.map(async (repo) => {
      const localPath = deps.workspaceMap.get(repo.name) ?? null;
      const local = localPath ? await deps.getLocalGitInfo(localPath) : null;
      return mergeProject(repo, local, localPath, deps.manual[repo.name], now);
    }),
  );
}
