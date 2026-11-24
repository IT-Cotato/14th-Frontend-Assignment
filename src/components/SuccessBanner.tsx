import './SuccessBanner.css';

interface SuccessBannerProps {
  message: string;
}

function SuccessBanner({ message }: SuccessBannerProps) {
  return (
    <div className="success-banner" role="status">
      <span className="success-banner__icon" aria-hidden="true">
        <svg width="12" height="10" viewBox="0 0 12 10">
          <path d="M1 5l3.5 3.5L11 1.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </span>
      <p className="success-banner__message">{message}</p>
    </div>
  );
}

export default SuccessBanner;