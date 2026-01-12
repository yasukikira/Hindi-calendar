import React from 'react';

const Confetti = () => {
  const particles = Array.from({ length: 30 });
  const colors = ['#FFD700', '#FF6347', '#32CD32', '#1E90FF', '#FF69B4'];

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" style={{ zIndex: 50 }}>
      {particles.map((_, i) => (
        <div 
          key={i}
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            animation: `confetti-fall ${2 + Math.random() * 2}s linear infinite`,
            animationDelay: `${Math.random() * 2}s`,
            backgroundColor: colors[Math.floor(Math.random() * colors.length)]
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;