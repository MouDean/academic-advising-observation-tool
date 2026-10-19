import test from 'node:test';
import assert from 'node:assert/strict';
import { validateSessionData, validateObservationData } from '../src/utils/validation.js';
import { SESSION_TYPES } from '../src/utils/constants.js';
import { generateSampleSessions } from '../src/utils/sampleData.js';

test('rejects missing session metadata', () => {
  const result = validateSessionData({ sessionInfo: {} });
  assert.equal(result.isValid, false);
  assert.equal(result.errors.length, 5);
});
test('accepts complete supported metadata and rejects unknown session types', () => {
  const sessionInfo = { date:'2026-01-01', time:'10:00', advisor:'Demo Advisor', studentCode:'DEMO001', sessionType:SESSION_TYPES.INITIAL_ADVISING.value };
  assert.equal(validateSessionData({ sessionInfo }).isValid,true);
  assert.equal(validateSessionData({ sessionInfo:{...sessionInfo,sessionType:'not-a-type'} }).isValid,false);
});
test('incomplete observations require justification without dividing by zero', () => {
  assert.equal(validateObservationData({}).completionRate,0);
  assert.equal(validateObservationData({}).requiresJustification,true);
  const result = validateObservationData({category:{a:{rating:'Good',notes:''},b:{rating:'',notes:''}}});
  assert.equal(result.completionRate,50);
  assert.equal(result.requiresJustification,false);
});
test('sample generator creates only fictional identities', () => {
  const sessions=generateSampleSessions(5);
  assert.equal(sessions.length,5);
  for(const session of sessions){
    assert.match(session.sessionInfo.studentCode,/^DEMO00[1-4]$/);
    assert.match(session.sessionInfo.advisor,/^Demo Advisor [ABC]$/);
  }
});
