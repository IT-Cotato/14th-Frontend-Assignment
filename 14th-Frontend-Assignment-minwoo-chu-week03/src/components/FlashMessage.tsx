interface FlashMessageProps {
  message: string
}

//Small floating confirmation, shown after a successful add or save.
//   App.tsx decides how long it stays on screen.
function FlashMessage({ message }: FlashMessageProps) {
  return (
    <div className="flash-message" role="status" aria-live="polite">
      {message}
    </div>
  )
}

export default FlashMessage
