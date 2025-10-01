// React is used implicitly
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { CreateTodoButton } from '../components/CreateTodoButton/CreateTodoButton';
import { vi, describe, it, expect } from 'vitest';

describe('CreateTodoButton Component', () => {
  it('renders the button', () => {
    const mockOnClick = vi.fn();
    render(<CreateTodoButton onClick={mockOnClick} />);

    const button = screen.getByTestId('create-todo-button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveTextContent('Add Todo');
  });

  it('calls onClick when button is clicked', async () => {
    const mockOnClick = vi.fn();
    const user = userEvent.setup();
    render(<CreateTodoButton onClick={mockOnClick} />);

    // Click the button
    await user.click(screen.getByTestId('create-todo-button'));

    // Should call onClick handler
    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('has correct styling and accessibility', () => {
    const mockOnClick = vi.fn();
    render(<CreateTodoButton onClick={mockOnClick} />);

    const button = screen.getByTestId('create-todo-button');

    // Check button is of type button
    expect(button).toHaveAttribute('type', 'button');

    // Check it has the correct class for variant and color
    expect(button).toHaveClass('MuiButton-contained');
    expect(button).toHaveClass('MuiButton-colorPrimary');
  });

  it('can be clicked multiple times', async () => {
    const mockOnClick = vi.fn();
    const user = userEvent.setup();
    render(<CreateTodoButton onClick={mockOnClick} />);

    const button = screen.getByTestId('create-todo-button');

    // Click the button multiple times
    await user.click(button);
    await user.click(button);
    await user.click(button);

    // Should be called 3 times
    expect(mockOnClick).toHaveBeenCalledTimes(3);
  });
});
