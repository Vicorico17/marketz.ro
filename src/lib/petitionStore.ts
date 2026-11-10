import { MongoClient } from 'mongodb';
import { createHash, randomBytes } from 'node:crypto';
import { getPetitionConfig } from './petitionConfig';
import { petitionVersion, privacyVersion } from './petitionValidation';
const hash = (value: string) => createHash('sha256').update(value).digest('hex');
interface Signature {
  emailHash: string; version: string; name: string; email: string;
  status: 'submitted'; emailVerified: false; consentAt: Date; privacyVersion: string;
  withdrawHash: string; expiresAt: Date; receiptStatus: 'pending' | 'sent' | 'failed';
}
let database: Promise<ReturnType<MongoClient['db']>> | undefined;
async function db() {
  if (!database) database = (async () => {
    const client = new MongoClient(process.env.MONGODB_URI!, { serverSelectionTimeoutMS: 5000 });
    try {
      await client.connect(); const database = client.db();
      await Promise.all([
        database.collection('petition_signatures').createIndex({ emailHash: 1, version: 1 }, { unique: true }),
        database.collection('petition_signatures').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
        database.collection('petition_limits').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
      ]);
      return database;
    } catch (error) { await client.close(); throw error; }
  })().catch((error) => { database = undefined; throw error; });
  return database;
}
export async function requestSignature(name: string, email: string) {
  const database = await db(); const now = new Date();
  const limits = database.collection<{ _id: string; count: number; expiresAt: Date }>('petition_limits');
  const bucket = await limits.findOneAndUpdate({ _id: String(Math.floor(Date.now() / 60000)) }, { $inc: { count: 1 }, $setOnInsert: { expiresAt: new Date(Date.now() + 120000) } }, { upsert: true, returnDocument: 'after' });
  if (!bucket || bucket.count > 20) throw new Error('RATE_LIMIT');
  const signatures = database.collection<Signature>('petition_signatures');
  const filter = { emailHash: hash(email), version: petitionVersion };
  await signatures.deleteOne({ ...filter, expiresAt: { $lte: now } });
  const withdrawToken = randomBytes(32).toString('hex');
  const record: Signature = { ...filter, name, email, status: 'submitted', emailVerified: false, consentAt: now, privacyVersion, withdrawHash: hash(withdrawToken), expiresAt: new Date(Date.now() + 180 * 86400000), receiptStatus: 'pending' };
  try { await signatures.insertOne(record); }
  catch (error) { if ((error as { code?: number }).code === 11000) return; throw error; }
  // The submission is already durable. A receipt is never a condition for signing.
  const config = getPetitionConfig();
  const withdrawUrl = `${config.origin}/petitie/retragere#token=${withdrawToken}`;
  const text = `Îți mulțumim pentru susținerea petiției Marketz!\n\nNu este necesară nicio confirmare.\nNume declarat: ${name}\nVersiune: ${petitionVersion}\n\nPetiția: ${config.origin}/petitie\n\nDacă nu ai completat formularul sau vrei să retragi susținerea, poți șterge înregistrarea aici: ${withdrawUrl}\n\nOrganizator: ${config.organizer}\nContact: ${config.contact}\nDatele nu apar public și nu te-am înscris la marketing.`;
  let receiptStatus: 'sent' | 'failed' = 'failed';
  try {
    const response = await fetch('https://api.resend.com/emails', { method: 'POST', headers: { Authorization: `Bearer ${process.env.RESEND_API_KEY}`, 'Content-Type': 'application/json' }, body: JSON.stringify({ from: process.env.PETITION_FROM_EMAIL, to: [email], subject: 'Mulțumim pentru susținere — Marketz', text }), signal: AbortSignal.timeout(5000) });
    if (response.ok) receiptStatus = 'sent';
  } catch { /* Receipt failure does not undo the saved submission. */ }
  try { await signatures.updateOne(filter, { $set: { receiptStatus } }); }
  catch { /* Keep the durable record; receipt remains pending for operational review. */ }
}
export async function withdrawSignature(token: string) {
  if (!/^[a-f0-9]{64}$/.test(token)) return false;
  const signatures = (await db()).collection<Signature>('petition_signatures');
  // Withdrawal is valid across petition versions while the record exists.
  const result = await signatures.deleteOne({ withdrawHash: hash(token), expiresAt: { $gt: new Date() } });
  return result.deletedCount === 1;
}

export async function getSignatureCount(): Promise<number | null> {
  if (!process.env.MONGODB_URI) return null;
  try {
    return await (await db()).collection<Signature>('petition_signatures').countDocuments({
      version: petitionVersion, status: 'submitted', expiresAt: { $gt: new Date() },
    }, { maxTimeMS: 3000 });
  } catch { return null; }
}
