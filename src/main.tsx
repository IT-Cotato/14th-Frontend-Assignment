import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // 실패하면 자동으로 다시 요청하지 않고 바로 오류와 ‘다시 시도’를 보여 준다. (W05 요청 상태)
      retry: false,
      // 목록은 페이지에 들어올 때 갱신한다. 창 포커스만으로는 다시 요청하지 않는다.
      refetchOnWindowFocus: false,
      // 기본 도감은 16마리뿐이라, 앱이 켜져 있는 동안 받은 목록·상세를 지우지 않는다.
      gcTime: Infinity,
    },
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </QueryClientProvider>
  </StrictMode>,
)
