import React from 'react';

interface OverlayProps {
  title: string;
  description: string;
}

export const Overlay: React.FC<OverlayProps> = ({ title, description }) => {
  return (
    <div className="overlay-panel">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
};
