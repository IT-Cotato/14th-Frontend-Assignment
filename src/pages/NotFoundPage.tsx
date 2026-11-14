import { useNavigate } from 'react-router';
import StatePanel from '../components/StatePanel';

function NotFoundPage() {
  const navigate = useNavigate();
  const hasPrevious = window.navigation?.canGoBack ?? false;

  return (
    <StatePanel
      tone="error"
      icon="!"
      title="페이지를 찾을 수 없어요"
      description="주소를 확인하거나 도감으로 돌아가세요."
      secondaryAction={hasPrevious ? { label: '이전 화면', onClick: () => navigate(-1) } : undefined}
      action={{ label: '홈으로', to: '/' }}
    />
  );
}

export default NotFoundPage;