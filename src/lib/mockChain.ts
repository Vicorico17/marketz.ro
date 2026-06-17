import { randomBytes } from 'crypto';

let localBlock = 7_420_000;

function randomHex(bytes: number) {
  return randomBytes(bytes).toString('hex');
}

export function mockAddress() {
  return `0x${randomHex(20)}`;
}

export function mockConditionId() {
  return `0x${randomHex(32)}`;
}

export function mockTxHash() {
  return `0x${randomHex(32)}`;
}

export function nextMockBlock() {
  localBlock += Math.floor(Math.random() * 4) + 1;
  return localBlock;
}

export function createMockChainRef() {
  return {
    network: 'Marketz Mockchain',
    contractAddress: '0x4d61726b65747a00000000000000000000000000',
    conditionId: mockConditionId(),
    blockCreated: nextMockBlock(),
  };
}
