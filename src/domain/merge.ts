import {
  Project, GithubRepo, LocalGitInfo, ManualEntry, DEFAULT_MANUAL,
} from './types';
import { daysBetween, computeActivity } from './staleness';

export function mergeProject(
  repo: GithubRepo,
  local: LocalGitInfo | null,
  localPath: string | null,
  manual: ManualEntry | undefined,
  now: Date,
): Project {
  const m = manual ?? DEFAULT_MANUAL;
  const activitySource = local?.lastCommitAt ?? repo.lastPushAt;
  const days = daysBetween(activitySource, now);
  return {
    name: repo.name,
    repoUrl: repo.repoUrl,
    private: repo.private,
    language: repo.language,
    description: repo.description,
    lastPushAt: repo.lastPushAt,
    localPath: localPath ?? undefined,
    lastCommitAt: local?.lastCommitAt,
    branch: local?.branch,
    stage: m.stage,
    launched: m.launched,
    funType: m.funType,
    topics: m.topics,
    memo: m.memo,
    nextAction: m.nextAction,
    pinned: m.pinned,
    hidden: m.hidden,
    activity: computeActivity(days),
    daysSinceActivity: days,
  };
}
