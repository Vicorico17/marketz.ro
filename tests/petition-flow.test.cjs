require('./register.cjs');
const { test } = require('node:test');
const assert = require('node:assert/strict');
const Module = require('node:module');
// In-memory stand-in exercises the service contract, without real emails or personal data.
// It does not replace a live MongoDB/provider integration test before launch.
const records = [];
const matches = (row, filter) => Object.entries(filter).every(([key, value]) => {
  if (value && typeof value === 'object' && !(value instanceof Date)) {
    if ('$lte' in value) return row[key] <= value.$lte;
    if ('$gt' in value) return row[key] > value.$gt;
  }
  return row[key] === value;
});
const signatures = {
  async createIndex() {},
  async insertOne(record) {
    if (records.some(r => r.emailHash === record.emailHash && r.version === record.version)) throw Object.assign(new Error('duplicate'), { code:11000 });
    records.push({ ...record }); return { insertedId: 'test' };
  },
  async deleteOne(filter) { const i = records.findIndex(r => matches(r,filter)); if (i < 0) return { deletedCount:0 }; records.splice(i,1); return { deletedCount:1 }; },
  async updateOne(filter, update, options = {}) {
    let row = records.find(r => matches(r,filter)); let inserted = false;
    if (!row && options.upsert) {
      const desired = update.$set;
      if (records.some(r => r.emailHash === desired.emailHash && r.version === desired.version)) throw Object.assign(new Error('duplicate'), { code:11000 });
      row = {}; records.push(row); inserted = true;
    }
    if (!row) return { modifiedCount:0, upsertedCount:0 };
    Object.assign(row,update.$set); for (const key of Object.keys(update.$unset || {})) delete row[key];
    return { modifiedCount: inserted ? 0 : 1, upsertedCount: inserted ? 1 : 0 };
  },
};
const fakeDb = { collection(name) { return name === 'petition_signatures' ? signatures : { async createIndex() {}, async findOneAndUpdate() { return { count:1 }; } }; } };
const originalLoad = Module._load;
Module._load = function (name, ...args) { if (name === 'mongodb') return { MongoClient: class { async connect() {} db() { return fakeDb; } async close() {} } }; return originalLoad.call(this,name,...args); };
const service = require('../src/lib/petitionStore.ts');
Module._load = originalLoad;
process.env.PETITION_ORIGIN = 'https://petition.example';
process.env.PETITION_CONTACT_EMAIL = 'contact@example.invalid';
process.env.PETITION_FROM_EMAIL = 'sender@example.invalid';
process.env.MONGODB_URI = 'mongodb://unused/test';
process.env.RESEND_API_KEY = 'test-only';
test('one-step signing saves immediately, sends a receipt and supports withdrawal', async () => {
  records.length = 0; const oldFetch = global.fetch; const messages = [];
  global.fetch = async (_url, options) => { messages.push(JSON.parse(options.body)); return new Response('{}',{status:200}); };
  try {
    await service.requestSignature('Test Supporter','supporter@example.invalid');
    assert.equal(records.length,1); assert.equal(records[0].status,'submitted');
    assert.equal(records[0].emailVerified,false); assert.equal(records[0].receiptStatus,'sent');
    const token=messages[0].text.match(/#token=([a-f0-9]{64})/)[1];
    assert.notEqual(records[0].withdrawHash,token);
    assert.match(messages[0].text,/Nu este necesară nicio confirmare/);
    await service.requestSignature('Overwrite Attempt','supporter@example.invalid');
    assert.equal(records[0].name,'Test Supporter'); assert.equal(messages.length,1);
    assert.equal(await service.withdrawSignature(token),true);
    assert.equal(records.length,0); assert.equal(await service.withdrawSignature(token),false);
  } finally { global.fetch = oldFetch; }
});
test('expired or malformed withdrawal token cannot delete another record', async () => {
  records.length=0; const oldFetch=global.fetch; let message;
  global.fetch=async (_url,opts) => { message=JSON.parse(opts.body); return new Response('{}'); };
  try {
    await service.requestSignature('Expiry Test','expiry@example.invalid');
    const token=message.text.match(/#token=([a-f0-9]{64})/)[1];
    assert.equal(await service.withdrawSignature('bad'),false);
    assert.equal(await service.withdrawSignature('a'.repeat(64)),false);
    records[0].expiresAt=new Date(0);
    assert.equal(await service.withdrawSignature(token),false);
  } finally { global.fetch=oldFetch; }
});
test('receipt delivery failure does not undo or reject a saved submission', async () => {
  records.length=0; const oldFetch=global.fetch; global.fetch=async () => new Response('{}',{status:503});
  try {
    await service.requestSignature('Failure Test','failure@example.invalid');
    assert.equal(records[0].status,'submitted'); assert.equal(records[0].receiptStatus,'failed');
    assert.equal(records[0].emailVerified,false);
  } finally { global.fetch=oldFetch; }
});
