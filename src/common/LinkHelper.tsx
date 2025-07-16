import React from 'react';
import { Link } from 'react-router-dom';
import { Typography } from '@mui/material';

interface StockTypeLinkProps {
  id: string;
  label: string;
}

export const StockIdLink: React.FC<StockTypeLinkProps> = ({ id, label }) => {
  if (!id || !label) return null;

  return (
    <Link to={`/stocks/${id}/show`}>
      <Typography
        color="primary"
        sx={{
          textDecoration: 'underline',
          cursor: 'pointer',
          '&:hover': { opacity: 0.8 },
        }}
      >
        {label}
      </Typography>
    </Link>
  );
}; 


export const UserIdLink: React.FC<StockTypeLinkProps> = ({ id, label }) => {
  if (!id || !label) return null;
  
  return (
    <Link to={`/users/${id}/show`}>
      <Typography
        color="primary"
        sx={{
          textDecoration: 'underline',
          cursor: 'pointer',
          '&:hover': { opacity: 0.8 },
        }}
      >
        {label}
      </Typography>
    </Link>
  );
}; 