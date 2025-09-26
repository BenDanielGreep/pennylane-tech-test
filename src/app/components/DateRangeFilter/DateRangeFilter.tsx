import React, { useState, useCallback } from 'react'

interface DateRangeFilterProps {
  start: string | null
  end: string | null
  onChange: (start: string | null, end: string | null) => void
}

const DateRangeFilter: React.FC<DateRangeFilterProps> = ({
  start,
  end,
  onChange,
}) => {
  const [localStart, setLocalStart] = useState<string>(start || '')
  const [localEnd, setLocalEnd] = useState<string>(end || '')

  const apply = useCallback(() => {
    if (localStart && localEnd && localEnd < localStart) {
      window.alert('End date must be after or equal to start date.')
      return
    }
    onChange(localStart || null, localEnd || null)
  }, [localStart, localEnd, onChange])

  const clear = useCallback(() => {
    setLocalStart('')
    setLocalEnd('')
    onChange(null, null)
  }, [onChange])

  return (
    <div
      className="d-flex flex-wrap align-items-end gap-2"
      data-testid="date-range-filter"
    >
      <div className="d-flex flex-column">
        <label htmlFor="date-start" className="small text-muted mb-1">
          Start Date
        </label>
        <input
          id="date-start"
          type="date"
          className="form-control form-control-sm"
          value={localStart}
          onChange={(e) => setLocalStart(e.target.value)}
        />
      </div>
      <div className="d-flex flex-column">
        <label htmlFor="date-end" className="small text-muted mb-1">
          End Date
        </label>
        <input
          id="date-end"
          type="date"
          className="form-control form-control-sm"
          value={localEnd}
          onChange={(e) => setLocalEnd(e.target.value)}
        />
      </div>
      <div className="d-flex gap-2">
        <button
          type="button"
          className="btn btn-sm btn-outline-secondary"
          onClick={apply}
          disabled={localStart === (start || '') && localEnd === (end || '')}
        >
          Apply
        </button>
        {(start || end || localStart || localEnd) && (
          <button
            type="button"
            className="btn btn-sm btn-outline-secondary"
            onClick={clear}
          >
            Clear
          </button>
        )}
      </div>
    </div>
  )
}

export default DateRangeFilter
