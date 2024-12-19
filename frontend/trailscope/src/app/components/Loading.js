export default function Loading() {
    return (
      <div className="fixed top-0 left-0 right-0">
        <div className="h-1 bg-blue-500" 
          style={{
            animation: 'loading 1s ease-in-out infinite',
          }}
        />
        <style jsx>{`
          @keyframes loading {
            0% { width: 0% }
            100% { width: 100% }
          }
        `}</style>
      </div>
    )
  }