import { describe, expect, it } from 'vitest'
import { formatClock } from './time'

describe('formatClock — mốc cơ bản dưới 1 giờ', () => {
  it('0 → 00:00', () => {
    expect(formatClock(0)).toBe('00:00')
  })

  it('59 → 00:59', () => {
    expect(formatClock(59)).toBe('00:59')
  })

  it('61 → 01:01', () => {
    expect(formatClock(61)).toBe('01:01')
  })

  it('600 → 10:00', () => {
    expect(formatClock(600)).toBe('10:00')
  })

  it('3599 → 59:59 (ngay trước mốc 1 giờ)', () => {
    expect(formatClock(3599)).toBe('59:59')
  })

  it('luôn đệm 2 chữ số cho phút và giây', () => {
    expect(formatClock(5)).toBe('00:05')
    expect(formatClock(65)).toBe('01:05')
  })
})

describe('formatClock — từ 1 giờ trở lên dùng h:mm:ss', () => {
  it('3600 → 1:00:00', () => {
    expect(formatClock(3600)).toBe('1:00:00')
  })

  it('3699 → 1:01:39', () => {
    expect(formatClock(3699)).toBe('1:01:39')
  })

  it('4500 → 1:15:00 (hết giờ Listening)', () => {
    expect(formatClock(4500)).toBe('1:15:00')
  })

  it('7200 → 2:00:00 (đề đầy đủ 120 phút)', () => {
    expect(formatClock(7200)).toBe('2:00:00')
  })

  it('giờ không đệm 2 chữ số nhưng phút/giây thì có', () => {
    expect(formatClock(3605)).toBe('1:00:05')
  })
})

describe('formatClock — giá trị không dùng được đều về 00:00', () => {
  it('null → 00:00', () => {
    expect(formatClock(null)).toBe('00:00')
  })

  it('undefined → 00:00', () => {
    expect(formatClock(undefined)).toBe('00:00')
  })

  it('NaN → 00:00', () => {
    expect(formatClock(Number.NaN)).toBe('00:00')
  })

  it('số âm → 00:00', () => {
    expect(formatClock(-1)).toBe('00:00')
    expect(formatClock(-3600)).toBe('00:00')
  })

  it('Infinity → 00:00', () => {
    expect(formatClock(Number.POSITIVE_INFINITY)).toBe('00:00')
    expect(formatClock(Number.NEGATIVE_INFINITY)).toBe('00:00')
  })
})

describe('formatClock — số lẻ được làm tròn xuống', () => {
  it('59.9 → 00:59', () => {
    expect(formatClock(59.9)).toBe('00:59')
  })

  it('0.4 → 00:00', () => {
    expect(formatClock(0.4)).toBe('00:00')
  })
})

describe('formatClock — tính thuần và tất định', () => {
  it('gọi nhiều lần cùng đầu vào cho cùng kết quả', () => {
    const first = formatClock(3661)
    const second = formatClock(3661)
    expect(first).toBe(second)
    expect(first).toBe('1:01:01')
  })

  it('khớp regex mm:ss hoặc h:mm:ss trên dải giá trị rộng', () => {
    for (const seconds of [0, 1, 59, 60, 61, 599, 3599, 3600, 7200, 35999]) {
      expect(formatClock(seconds)).toMatch(/^(?:\d{2}:\d{2}|\d+:\d{2}:\d{2})$/)
    }
  })
})
