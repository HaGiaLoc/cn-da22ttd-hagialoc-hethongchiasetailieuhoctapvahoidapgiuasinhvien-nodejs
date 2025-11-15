import { useState } from 'react'

export default function PhanTrang({ currentPage, totalPages, onPageChange }) {
  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1)
    }
  }

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1)
    }
  }

  return (
    <div className="pagination">
      <button
        className="btn btn-outline"
        onClick={handlePrevious}
        disabled={currentPage === 1}
      >
        <i className="fas fa-chevron-left"></i> Trước
      </button>
      
      <span className="pagination-info">
        Trang {currentPage} / {totalPages}
      </span>
      
      <button
        className="btn btn-outline"
        onClick={handleNext}
        disabled={currentPage === totalPages}
      >
        Sau <i className="fas fa-chevron-right"></i>
      </button>
    </div>
  )
}
