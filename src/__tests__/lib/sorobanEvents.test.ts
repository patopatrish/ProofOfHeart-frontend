jest.mock('@stellar/stellar-sdk', () => {
  const nativeToScVal = (value: unknown, opts: { type: string }) => ({
    __native: value,
    toXDR: () => Buffer.from(`${opts.type}:${String(value)}`),
  });

  return {
    nativeToScVal,
    scValToNative: (value: { __native?: unknown }) => value.__native,
    rpc: { Server: jest.fn() },
  };
});

import * as StellarSdk from '@stellar/stellar-sdk';
import {
  isVoteCastEvent,
  parseVoteCastApprove,
  scValToTopicSegment,
  voteCastTopicFilter,
} from '@/lib/sorobanEvents';

describe('sorobanEvents vote cast', () => {
  it('builds campaign_vote_cast topic filter segments', () => {
    const topics = voteCastTopicFilter(7);
    expect(topics[0][2]).toBe('*');

    const symbol = StellarSdk.nativeToScVal('campaign_vote_cast', { type: 'symbol' });
    const campaign = StellarSdk.nativeToScVal(7, { type: 'u32' });
    expect(topics[0][0]).toBe(scValToTopicSegment(symbol as never));
    expect(topics[0][1]).toBe(scValToTopicSegment(campaign as never));
  });

  it('identifies vote cast events and parses approve flag', () => {
    const event = {
      id: 'evt-vote-1',
      topic: [
        StellarSdk.nativeToScVal('campaign_vote_cast', { type: 'symbol' }),
        StellarSdk.nativeToScVal(3, { type: 'u32' }),
      ],
      value: { __native: true },
    } as Parameters<typeof isVoteCastEvent>[0];

    expect(isVoteCastEvent(event, 3)).toBe(true);
    expect(isVoteCastEvent(event, 4)).toBe(false);
    expect(parseVoteCastApprove(event)).toBe(true);
  });
});
