import React from 'react'

interface SortByProps {
  toggleSort(field: string): void
}

const SortBy: React.FC<SortByProps> = ({ toggleSort }) => {
  return (
    <div className="mb-2" data-testid="sortby-component">
      <select
        className="btn btn-sm btn-outline-secondary"
        onChange={(e) => toggleSort(e.target.value)}
      >
        <option value="">-select an option-</option>
        <option value="-id">ID (desc)</option>
        <option value="id">ID (asc)</option>
        <option value="-date">Date (desc)</option>
        <option value="date">Date (asc)</option>
        <option value="-deadline">Deadline (desc)</option>
        <option value="deadline">Deadline (asc)</option>
        <option value="-total">Total (desc)</option>
        <option value="total">Total (asc)</option>
      </select>
    </div>
  )
}

export default SortBy
