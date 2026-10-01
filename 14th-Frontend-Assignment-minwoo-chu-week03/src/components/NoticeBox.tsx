interface NoticeBoxProps {
  title: string
  description: string
  // 'warning' is used for the duplicate-add notice,
  // 'default' is used for the Week 2 empty-list guidance.
  tone?: 'default' | 'warning'
}

function NoticeBox({ title, description, tone = 'default' }: NoticeBoxProps) {
  return (
    <div className={`notice-box${tone === 'warning' ? ' notice-box-warning' : ''}`}>
      <p className="notice-box-title">{title}</p>
      <p className="notice-box-desc">{description}</p>
    </div>
  )
}

export default NoticeBox
