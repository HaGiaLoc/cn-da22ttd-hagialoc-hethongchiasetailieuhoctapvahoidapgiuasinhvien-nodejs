import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/helpers'

export default function TheCauHoi({ question }) {
  return (
    <div className="question-item" onClick={() => window.location.href = `/qa/${question.maCauHoi}`}>
      <div className="question-header">
        <div className="question-votes">
          <i className="fas fa-arrow-up"></i>
          <span className="vote-count">{question.votes}</span>
          <small>votes</small>
        </div>
        <div className="question-content">
          <h3 className="question-title">{question.tieuDeCauHoi || question.tieuDeCH}</h3>
          <p className="question-excerpt">{question.noiDungCauHoi || question.noiDungCH}</p>
        </div>
        <div className="question-info">
          <div className="info-item">
            <i className="fas fa-book"></i>
            <span>{question.tenMon}</span>
          </div>
          <div className="info-item">
            <i className="fas fa-graduation-cap"></i>
            <span>{question.tenNganh}</span>
          </div>
        </div>
      </div>
      <div className="question-footer">
        <div className="question-tags">
          {question.tags && (Array.isArray(question.tags) 
            ? question.tags 
            : (typeof question.tags === 'string' ? question.tags.split(',').filter(t => t.trim()) : [])
          ).map((tag, index) => (
            <span key={index} className="tag">{typeof tag === 'string' ? tag : tag.tenTag || tag}</span>
          ))}
        </div>
        <div className="question-stats">
          <span>
            <i className="fas fa-comments"></i> {question.soLuongTraLoi || question.totalAnswers || 0} câu trả lời
          </span>
          <span>{formatDate(question.ngayDatCH || question.ngayDang)}</span>
        </div>
      </div>
    </div>
  )
}
