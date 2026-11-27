import test from 'node:test'
import assert from 'node:assert/strict'
import { getHomeSequenceFrameWindow } from '../src/motion/cinematic/homeSequencePolicy.mjs'

test('home frame sequence requests only the initial still when motion is reduced', () => {
  assert.deepEqual(getHomeSequenceFrameWindow(180, { reduceMotion: true }), [1])
})

test('home frame sequence queues a bounded window around the requested frame', () => {
  assert.deepEqual(getHomeSequenceFrameWindow(100), [98, 99, 100, 101, 102, 103, 104, 105, 106])
  assert.deepEqual(getHomeSequenceFrameWindow(1), [1, 2, 3, 4, 5, 6, 7])
  assert.deepEqual(getHomeSequenceFrameWindow(300), [298, 299, 300])
})

test('home frame sequence keeps its cache window within the available frames', () => {
  assert.equal(getHomeSequenceFrameWindow(-25).every((frame) => frame >= 1 && frame <= 300), true)
  assert.equal(getHomeSequenceFrameWindow(999).every((frame) => frame >= 1 && frame <= 300), true)
})
