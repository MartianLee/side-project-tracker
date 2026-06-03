import { describe, it, expect } from 'vitest';
import { toNameToPath } from '../../src/data/workspaceMap';

describe('toNameToPath', () => {
  it('maps directory entries to name→absolute path', () => {
    const entries = [
      { name: 'algo-visual', isDirectory: true },
      { name: 'fit-claw', isDirectory: true },
      { name: '.DS_Store', isDirectory: false },
    ];
    const map = toNameToPath('/Users/you/workspace', entries);
    expect(map.get('algo-visual')).toBe('/Users/you/workspace/algo-visual');
    expect(map.get('fit-claw')).toBe('/Users/you/workspace/fit-claw');
    expect(map.has('.DS_Store')).toBe(false);
  });
});
