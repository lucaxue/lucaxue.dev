import { formatDate } from '~/utils'

describe('formatDate', () => {
  it('formats a date string', () => {
    const formatted = formatDate('2002-04-25T15:00:00.000+00:00')
    expect(formatted).toEqual('Apr 25, 2002')
  })

  it('formats a date object', () => {
    const formatted = formatDate(new Date('2002-04-25T15:00:00.000+00:00'))
    expect(formatted).toEqual('Apr 25, 2002')
  })

  it('omits the current year', () => {
    const formatted = formatDate(`${new Date().getFullYear()}-01-01`)
    expect(formatted).toEqual('Jan 1')
  })

  it('returns an error message for invalid dates', () => {
    expect(formatDate('not a date')).toEqual('Invalid Date')
  })
})
