import React from 'react';
import { Button } from '@mui/material';

interface CreateTodoButtonProps {
  onClick: () => void;
}

export const CreateTodoButton: React.FC<CreateTodoButtonProps> = ({ onClick }) => {
  return (
    <Button variant="contained" color="primary" onClick={onClick} data-testid="create-todo-button">
      Add Todo
    </Button>
  );
};
