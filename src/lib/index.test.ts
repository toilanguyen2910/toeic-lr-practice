import { describe, expect, it } from 'vitest'
import type { EngineApi } from './contract'
import { DEFAULT_SETTINGS, STORAGE_KEYS } from './contract'
import { SAMPLE_BANK } from './sample'
import * as barrel from './index'
import { engineApi } from './index'

/**
 * Test hợp đồng: `src/lib/index.ts` phải export ĐỦ mọi thành viên của `EngineApi`.
 * Nếu UI gọi một hàm mà barrel thiếu, test này đỏ ngay.
 */
describe('index.ts — barrel khớp EngineApi', () => {
  const requiredFunctions: Array<keyof EngineApi> = [
    'createSession',
    'answerQuestion',
    'toggleFlag',
    'tickSession',
    'submitSession',
    'scoreSession',
    'saveSession',
    'loadSession',
    'clearSession',
    'loadHistory',
    'pushHistory',
    'clearHistory',
    'loadSettings',
    'saveSettings',
    'formatClock',
    'estimateScore',
  ]

  it('export đủ 16 hàm của EngineApi', () => {
    expect(requiredFunctions).toHaveLength(16)
    for (const name of requiredFunctions) {
      expect(typeof barrel[name]).toBe('function')
    }
  })

  it('engineApi chứa đúng các hàm đó và trỏ cùng thực thể', () => {
    for (const name of requiredFunctions) {
      expect(typeof engineApi[name]).toBe('function')
      expect(engineApi[name]).toBe(barrel[name])
    }
  })

  it('export lại hằng số hợp đồng', () => {
    expect(barrel.DEFAULT_SETTINGS).toEqual(DEFAULT_SETTINGS)
    expect(barrel.STORAGE_KEYS).toEqual(STORAGE_KEYS)
    expect(barrel.HISTORY_LIMIT).toBe(100)
  })

  it('export các hàm kiểm tra hình dạng dữ liệu cho UI', () => {
    expect(typeof barrel.parseSession).toBe('function')
    expect(typeof barrel.parseHistoryEntry).toBe('function')
    expect(typeof barrel.parseSettings).toBe('function')
  })

  it('parseSession công khai hoạt động đúng qua barrel', () => {
    const session = barrel.createSession(SAMPLE_BANK, {
      mode: 'practice',
      parts: [5],
      seed: 1,
      now: 1_700_000_000_000,
    })
    expect(barrel.parseSession(session)).toEqual(session)
    expect(barrel.parseSession({ id: 'x' })).toBeNull()
    expect(barrel.parseSession('rác')).toBeNull()
    expect(barrel.parseSession(null)).toBeNull()
  })

  it('parseSession từ chối object bị sửa tay sai kiểu', () => {
    const session = barrel.createSession(SAMPLE_BANK, {
      mode: 'practice',
      parts: [5],
      seed: 1,
      now: 1_700_000_000_000,
    })
    // Đáp án không phải letter hợp lệ.
    expect(
      barrel.parseSession({ ...session, answers: { [session.questionIds[0]!]: 'Z' } }),
    ).toBeNull()
    // status lạ.
    expect(barrel.parseSession({ ...session, status: 'đang-làm' })).toBeNull()
  })

  it('có thể chạy một vòng đời trọn vẹn qua engineApi', () => {
    const session = engineApi.createSession(SAMPLE_BANK, {
      mode: 'practice',
      parts: [5, 7],
      seed: 2026,
      now: 1_700_000_000_000,
    })
    expect(session.questionIds).toHaveLength(4)

    const first = session.questionIds[0]!
    const answered = engineApi.answerQuestion(session, first, 'B')
    const flagged = engineApi.toggleFlag(answered, first)
    const ticked = engineApi.tickSession(flagged, 90)
    const submitted = engineApi.submitSession(ticked, 1_700_000_500_000)

    expect(submitted.status).toBe('submitted')
    expect(submitted.submittedAt).toBe(1_700_000_500_000)

    const result = engineApi.scoreSession(SAMPLE_BANK, submitted)
    expect(result.total).toBe(4)
    // Điểm ước lượng đi qua barrel vẫn tính đúng: sàn của tổng nay là 0 chứ
    // không phải 10, và mọi giá trị phải nằm trên thang 0..990.
    expect(result.estimate.total).toBeGreaterThanOrEqual(0)
    expect(result.estimate.total).toBeLessThanOrEqual(990)
    expect(result.estimate.approximate).toBe(true)
    expect(engineApi.formatClock(submitted.elapsedSeconds)).toBe('01:30')
  })
})
