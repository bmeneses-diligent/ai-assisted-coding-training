import React from 'react';
import {
  ListItem,
  ListItemText,
  IconButton,
  Checkbox,
  Divider,
  Typography,
  Box,
  Chip,
} from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { format, parseISO, isBefore, startOfToday } from 'date-fns';
import type { Todo } from '../../types/Todo';
import { useTodo } from '../../hooks/useTodo';

interface TodoItemProps {
  todo: Todo;
  onEditClick: (todo: Todo) => void;
}

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onEditClick }) => {
  const { toggleTodoCompletion, deleteTodo } = useTodo();

  // Check if due date is overdue
  const isOverdue = todo.dueDate && isBefore(parseISO(todo.dueDate), startOfToday());

  return (
    <>
      <ListItem
        sx={{
          bgcolor: 'background.paper',
          py: 1,
          borderLeft: todo.completed ? '4px solid green' : '4px solid transparent',
          '&:hover': {
            bgcolor: 'action.hover',
            cursor: 'pointer',
          },
        }}
        onClick={() => onEditClick(todo)}
        secondaryAction={
          <IconButton
            edge="end"
            aria-label="delete"
            onClick={e => {
              e.stopPropagation();
              deleteTodo(todo.id);
            }}
          >
            Delete
          </IconButton>
        }
      >
        <Checkbox
          edge="start"
          checked={todo.completed}
          onClick={e => {
            e.stopPropagation();
            toggleTodoCompletion(todo.id);
          }}
          color="primary"
          sx={{ mr: 1 }}
        />
        <ListItemText
          disableTypography
          primary={
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography
                variant="body1"
                sx={{
                  textDecoration: todo.completed ? 'line-through' : 'none',
                  color: todo.completed ? 'text.secondary' : 'text.primary',
                  fontWeight: 500,
                }}
              >
                {todo.title}
              </Typography>
              {todo.dueDate && (
                <Chip
                  icon={isOverdue && !todo.completed ? <WarningAmberIcon /> : undefined}
                  label={format(parseISO(todo.dueDate), 'PP')}
                  size="small"
                  color={isOverdue && !todo.completed ? 'error' : 'default'}
                  sx={{
                    height: '20px',
                    fontSize: '0.75rem',
                  }}
                />
              )}
            </Box>
          }
          secondary={
            <Typography
              variant="body2"
              sx={{
                color: 'text.secondary',
                textDecoration: todo.completed ? 'line-through' : 'none',
              }}
            >
              {todo.description}
            </Typography>
          }
        />
      </ListItem>
      <Divider />
    </>
  );
};
