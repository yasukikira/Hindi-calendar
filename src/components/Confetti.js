import React from 'react';

const Confetti = () => {
  const particles = Array.from({ length: 20 });
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-10">
      {particles.map((_, i) => (
        <div 
          key={i}
          className="confetti-piece"
          style={{
            left: `${Math.random() * 100}%`,
            animation: `confetti-fall ${1 + Math.random() * 2}s linear infinite`,
            animationDelay: `${Math.random()}s`,
            backgroundColor: ['#ff0', '#f00', '#0f0', '#00f', '#f0f'][Math.floor(Math.random() * 5)]
          }}
        />
      ))}
    </div>
  );
};

export default Confetti;
