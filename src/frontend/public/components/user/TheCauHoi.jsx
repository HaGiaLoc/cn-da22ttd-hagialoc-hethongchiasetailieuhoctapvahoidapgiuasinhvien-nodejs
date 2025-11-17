import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/helpers'

export default function TheCauHoi({ question }) {
  return (
    <div className="question-item" onClick={() => window.location.href = `/qa/${question.id}`}>
      <div className="question-header">
        <div className="question-votes">
          <i className="fas fa-arrow-up"></i>
          <span className="vote-count">{question.votes}</span>
          <small>votes</small>
        </div>
        <div className="question-content">
          <h3 className="question-title">{question.title}</h3>
          <p className="question-excerpt">{question.content}</p>
        </div>
        <div className="question-info">
          <div className="info-item">
            <i className="fas fa-book"></i>
            <span>{question.subject}</span>
          </div>
          <div className="info-item">
            <i className="fas fa-graduation-cap"></i>
            <span>{question.major}</span>
          </div>
        </div>
      </div>
      <div className="question-footer">
        <div className="question-tags">
          {question.tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
        <div className="question-stats">
          <span>
            <i className="fas fa-comments"></i> {question.answers} câu trả lời
          </span>
          <span>
            <i className="fas fa-eye"></i> {question.views}
          </span>
          <span>{formatDate(question.date)}</span>
        </div>
      </div>
    </div>
  )
}
