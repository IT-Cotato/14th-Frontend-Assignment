import Button from '../Button/Button'
import './StatePanel.css'

type StatePanelProps =
  | { variant: 'loading' }
  | { variant: 'empty'; title?: string; description?: string }
  | { variant: 'error'; onRetry: () => void }

const content = {
  loading: { icon: '...', title: '포켓몬을 불러오는 중', description: '잠시만 기다려 주세요.' },
  empty: { icon: '0', title: '검색 결과가 없어요', description: '다른 이름이나 번호로 검색해 보세요.' },
  error: { icon: '!', title: '연결이 원활하지 않아요', description: '네트워크를 확인하고 다시 시도해 주세요.' },
}

function StatePanel(props: StatePanelProps) {
  const { icon } = content[props.variant]
  const title = props.variant === 'empty' ? props.title ?? content.empty.title : content[props.variant].title
  const description = props.variant === 'empty' ? props.description ?? content.empty.description : content[props.variant].description
  return (
    <div className={`state-panel state-panel--${props.variant}`}
      role={props.variant === 'error' ? 'alert' : 'status'}>
      <span className="state-panel__icon" aria-hidden="true">{icon}</span>
      <h3 className="state-panel__title">{title}</h3>
      <p className="state-panel__description">{description}</p>
      {props.variant === 'error' && <Button onClick={props.onRetry}>다시 시도</Button>}
    </div>
  )
}

export default StatePanel
