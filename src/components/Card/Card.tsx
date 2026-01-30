import React from 'react';
import { CardProps } from './Card.types';

const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-card border border-border shadow-sm rounded-lg p-6 hover:shadow-md hover:bg-card-hover transition-all duration-200 ${className}`}>
      {children}
    </div>
  );
};

export default Card;