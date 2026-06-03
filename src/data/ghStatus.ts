import { Command } from '@tauri-apps/plugin-shell';

export type GhAuthState = 'checking' | 'ok' | 'unauthed' | 'missing';

export interface GhStatus {
  state: GhAuthState;
  detail: string; // ok면 계정명, 아니면 보조 메시지
}

// 순수: `gh auth status` 실행 결과 해석 (실행 실패=미설치는 wrapper에서 처리)
export function parseGhAuth(code: number, stdout: string, stderr: string): GhStatus {
  if (code === 0) {
    const m = (stdout + '\n' + stderr).match(/account\s+(\S+)/i);
    return { state: 'ok', detail: m ? m[1] : 'github.com' };
  }
  return { state: 'unauthed', detail: 'gh에 로그인되어 있지 않습니다.' };
}

export async function checkGhAuth(): Promise<GhStatus> {
  try {
    const out = await Command.create('gh', ['auth', 'status']).execute();
    return parseGhAuth(out.code ?? 1, out.stdout, out.stderr);
  } catch {
    // 프로그램을 찾지 못함 등 → gh 미설치로 간주
    return { state: 'missing', detail: 'gh CLI를 찾을 수 없습니다.' };
  }
}
