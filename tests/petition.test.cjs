require('./register.cjs');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const { validateSignature, petitionVersion } = require('../src/lib/petitionValidation.ts');
const { readPetitionBody, petitionGate } = require('../src/lib/petitionApi.ts');
const valid = { name: ' Ana  Popescu ', email: ' ANA@EXAMPLE.COM ', consent: true, version: petitionVersion };
test('signature requires explicit consent and current petition version', () => {
  assert.deepEqual(validateSignature(valid), { name: 'Ana Popescu', email: 'ana@example.com' });
  for (const patch of [{ consent: false }, { consent: 'true' }, { version: 'old' }, { website: 'bot' }, { name: '<script>' }, { email: 'not-email' }, { email: 'a@b.com\nx' }, { name: 'x' }]) assert.throws(() => validateSignature({ ...valid, ...patch }));
});
test('does not retain unsolicited CNP, address or marketing fields', () => {
  assert.deepEqual(Object.keys(validateSignature({ ...valid, cnp: 'sensitive', address: 'private', marketing: true })).sort(), ['email','name']);
});
test('request byte limit applies without Content-Length', async () => {
  const request = new Request('https://example.com', { method: 'POST', body: JSON.stringify({ text: 'x'.repeat(5000) }) });
  await assert.rejects(() => readPetitionBody(request), /prea mare/);
});
test('malformed JSON is rejected', async () => {
  await assert.rejects(() => readPetitionBody(new Request('https://example.com', { method: 'POST', body: '{' })));
});
test('unconfigured signing is closed without touching a database or mail', async () => {
  const old = process.env.PETITION_ENABLED; process.env.PETITION_ENABLED = 'false';
  try {
    const route = require('../src/app/api/petition/sign/route.ts');
    const response = await route.POST(new Request('https://example.com/api/petition/sign', { method: 'POST', body: JSON.stringify(valid) }));
    assert.equal(response.status, 503);
    assert.match((await response.json()).error, /Nicio susținere/);
  } finally { if (old === undefined) delete process.env.PETITION_ENABLED; else process.env.PETITION_ENABLED = old; }
});
test('withdrawal remains available when new signature collection is paused', () => {
  const keys = ['PETITION_ENABLED','PETITION_ORIGIN','MONGODB_URI']; const saved = Object.fromEntries(keys.map(k => [k,process.env[k]]));
  process.env.PETITION_ENABLED = 'false'; process.env.PETITION_ORIGIN = 'https://example.com'; process.env.MONGODB_URI = 'mongodb://unused/test';
  try {
    assert.equal(petitionGate(new Request('https://example.com', { method: 'POST', headers: { origin: 'https://example.com', 'content-type':'application/json' }, body:'{}' }), true), null);
    assert.equal(petitionGate(new Request('https://example.com', { method: 'POST', headers: { origin: 'https://attacker.example', 'content-type':'application/json' }, body:'{}' }), true).status, 403);
  } finally { for (const k of keys) if(saved[k] === undefined) delete process.env[k]; else process.env[k] = saved[k]; }
});
