import { test } from 'node:test';
import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const pathway = new URL('../_projects/games/cs-pathway/', import.meta.url);
const read = (file) => readFileSync(new URL(file, pathway), 'utf8');
const level = read('levels/GameLevelCsPath4Toolchain.js');
const forgeThemes = JSON.parse(read('images/bg/index.json'));
const toolchainThemes = JSON.parse(read('images/bg-toolchain/index.json'));

test('Toolchain Trail uses the shared identity restore', () => {
  assert.match(level, /class GameLevelCsPath4Toolchain extends GameLevelCsPathIdentity/);
  assert.match(level, /this\.restoreIdentitySelections\(\{/);
  // getPlayerObject() only finds the player by this id, so the avatar swap needs it.
  assert.match(level, /id: 'Minimalist_Identity'/);
});

test('every Identity Forge theme has a Toolchain Trail backdrop', () => {
  const names = toolchainThemes.map((theme) => theme.name).sort();
  assert.deepEqual(names, forgeThemes.map((theme) => theme.name).sort());
  toolchainThemes.forEach((theme) => {
    assert.ok(existsSync(new URL(`images/bg-toolchain/${theme.src}`, pathway)), `missing ${theme.src}`);
  });
});

test('the default backdrop is one of the themed files', () => {
  const src = level.match(/bg-toolchain\/(toolchain-trail-[a-z]+\.png)/)?.[1];
  assert.ok(src && toolchainThemes.some((theme) => theme.src === src), `default backdrop ${src}`);
});
