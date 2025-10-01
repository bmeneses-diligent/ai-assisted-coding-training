# AIADT-115 – Add Due Date Field to Todos

## Objective

Add an optional due date field to the Todo application, allowing users to set, edit, and view deadlines for their tasks. This enhances task management capabilities by enabling better prioritization and time-management.

## Non-Goals

- Reminder notifications or calendar sync
- Automatic sorting by due date
- API/backend persistence (this is future work)
- Past date restrictions (users may need historical todos)

---

## Context

### Business Value

Allow users to set and view deadlines for tasks, enabling better prioritization and time-management.

### Key Decisions (from ticket review)

1. **Persistence Strategy**: Implement with in-memory state only. Once AIADT-10 (sessionStorage persistence) merges, the `dueDate` field will automatically be included in persistence as it's part of the `Todo` interface.
2. **Date Format**: Store as date-only strings in simplified ISO format (YYYY-MM-DD) to avoid timezone complexity.
3. **Scope**: Includes overdue visual indication and edit modal wiring.
4. **Validation**: Rely on MUI DatePicker's built-in validation; no additional business rules restricting past dates.

### Dependencies to Install

- `@mui/x-date-pickers`: `^7.0.0`
- `date-fns`: `^3.0.0`

### Code Areas Affected

- `src/types/Todo.ts`
- `src/contexts/TodoContext.tsx`
- `src/components/TodoModal/TodoModal.tsx`
- `src/components/TodoList/TodoItem.tsx`
- `src/App.tsx` (for edit modal wiring and LocalizationProvider)
- Tests in `src/__tests__/`

---

## Architecture/Design Overview

### Data Model Changes

```typescript
// src/types/Todo.ts
export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: string; // NEW: Optional ISO date string (YYYY-MM-DD)
}
```

### Component Hierarchy

```
App (with LocalizationProvider)
├── TodoModal (DatePicker component)
└── TodoList
    └── TodoItem (display due date with overdue indicator)
```

### User Flow

1. **Create**: User opens modal → optionally selects due date → creates todo
2. **Edit**: User clicks todo → modal opens with existing due date → can change/remove date
3. **View**: User sees due date displayed in todo list, with visual indicator if overdue

---

## Task List

### Task 1: Install Required Dependencies

**Status**: TODO  
**Depends On**: None  
**Description**:
Install the required npm packages for date picking functionality:

- `@mui/x-date-pickers@^7.0.0` - MUI date picker components
- `date-fns@^3.0.0` - Date formatting and parsing utilities

**Verification**:

- Packages appear in `package.json` dependencies
- `npm install` completes without errors
- No version conflicts with existing MUI packages

### Task 2: Update Todo Type Definition

**Status**: TODO  
**Depends On**: None  
**Description**:
Add the optional `dueDate` field to the `Todo` interface in `src/types/Todo.ts`.

**Code Snippet**:

```typescript
export interface Todo {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  dueDate?: string; // ISO date string (YYYY-MM-DD) - NOTE: Will be persisted automatically when AIADT-10 merges
}
```

**Verification**:

- TypeScript compiles without errors
- No linter errors in the types file
- Add a comment documenting the AIADT-10 persistence dependency

### Task 3: Add LocalizationProvider to App

**Status**: TODO  
**Depends On**: [1]  
**Description**:
Wrap the application in `LocalizationProvider` from `@mui/x-date-pickers` to enable date picker functionality throughout the app. Place it at the same level as `AtlasThemeProvider` in `App.tsx`.

**Code Snippet**:

```typescript
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

function App() {
  // ... existing state and handlers ...

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <AtlasThemeProvider>
        <CssBaseline />
        <TodoProvider>
          {/* existing app content */}
        </TodoProvider>
      </AtlasThemeProvider>
    </LocalizationProvider>
  );
}
```

**Verification**:

- App renders without errors
- No console warnings about missing LocalizationProvider
- TypeScript compiles successfully

### Task 4: Update TodoContext to Support Due Date

**Status**: TODO  
**Depends On**: [2]  
**Description**:
Modify the `addTodo` and `editTodo` functions in `src/contexts/TodoContext.tsx` to accept and handle the optional `dueDate` parameter.

**Code Snippet**:

```typescript
const addTodo = (title: string, description: string, dueDate?: string) => {
  const newTodo: Todo = {
    id: uuidv4(),
    title,
    description,
    completed: false,
    createdAt: new Date(),
    dueDate, // Include optional due date
  };
  setTodos([...todos, newTodo]);
};

const editTodo = (id: string, updates: Partial<Todo>) => {
  setTodos(todos.map(todo => (todo.id === id ? { ...todo, ...updates } : todo)));
};
```

Also update `TodoContextType` interface to reflect the new signature:

```typescript
interface TodoContextType {
  todos: Todo[];
  addTodo: (title: string, description: string, dueDate?: string) => void;
  editTodo: (id: string, updates: Partial<Todo>) => void;
  toggleTodoCompletion: (id: string) => void;
  deleteTodo: (id: string) => void;
}
```

**Verification**:

- TypeScript compiles without errors
- Context exports updated function signatures
- No breaking changes to existing consumers

### Task 5: Implement Edit Modal State Management in App.tsx

**Status**: TODO  
**Depends On**: [2]  
**Description**:
Replace the placeholder `handleEditTodo` function with proper modal state management to enable editing todos with the due date field.

**Code Snippet**:

```typescript
import { useState } from 'react';
import { TodoModal } from './components/TodoModal/TodoModal';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'create' | 'edit'>('create');
  const [editingTodo, setEditingTodo] = useState<Todo | null>(null);

  const handleEditTodo = (todo: Todo) => {
    setEditingTodo(todo);
    setModalMode('edit');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTodo(null);
    setModalMode('create');
  };

  return (
    // ... providers ...
    <>
      {/* existing layout */}
      <TodoModal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        mode={modalMode}
        initialValues={editingTodo ? {
          id: editingTodo.id,
          title: editingTodo.title,
          description: editingTodo.description,
          completed: editingTodo.completed,
          dueDate: editingTodo.dueDate,
        } : undefined}
      />
    </>
  );
}
```

**Verification**:

- Clicking a todo item opens the modal in edit mode
- Modal displays the correct todo data
- Closing modal resets state properly
- No TypeScript errors

### Task 6: Add Date Picker to TodoModal

**Status**: TODO  
**Depends On**: [1, 3, 4]  
**Description**:
Add a `DatePicker` component to the `TodoModal` for selecting due dates. Include state management for the due date field and pass it to the context functions.

**Code Snippet**:

```typescript
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { parseISO } from 'date-fns';

export const TodoModal: React.FC<TodoModalProps> = ({
  isOpen,
  onClose,
  mode = 'create',
  initialValues,
}) => {
  const { addTodo, editTodo } = useTodo();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [completed, setCompleted] = useState(false);
  const [dueDate, setDueDate] = useState<Date | null>(null); // NEW
  const [titleError, setTitleError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && initialValues) {
        setTitle(initialValues.title);
        setDescription(initialValues.description);
        setCompleted(initialValues.completed);
        setDueDate(initialValues.dueDate ? parseISO(initialValues.dueDate) : null); // NEW
      } else {
        setTitle('');
        setDescription('');
        setCompleted(false);
        setDueDate(null); // NEW
      }
      setTitleError('');
    }
  }, [isOpen, mode, initialValues]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    // Format dueDate to YYYY-MM-DD string
    const dueDateString = dueDate ? dueDate.toISOString().split('T')[0] : undefined;

    if (mode === 'create') {
      addTodo(title.trim(), description.trim(), dueDateString);
    } else if (mode === 'edit' && initialValues) {
      editTodo(initialValues.id, {
        title: title.trim(),
        description: description.trim(),
        completed,
        dueDate: dueDateString,
      });
    }
    onClose();
  };

  return (
    <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="sm">
      {/* ... existing dialog title ... */}
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* ... existing title and description fields ... */}

            <DatePicker
              label="Due Date (optional)"
              value={dueDate}
              onChange={(newValue) => setDueDate(newValue)}
              slotProps={{
                textField: {
                  fullWidth: true,
                  helperText: 'Select an optional due date for this task',
                  inputProps: { 'data-testid': 'due-date-picker' },
                },
              }}
            />

            {/* ... existing completed checkbox for edit mode ... */}
          </Box>
        </DialogContent>
        {/* ... existing dialog actions ... */}
      </form>
    </Dialog>
  );
};
```

Update `TodoModalProps` interface:

```typescript
interface TodoModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  initialValues?: {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    dueDate?: string; // NEW
  };
}
```

**Verification**:

- Date picker appears in modal for both create and edit modes
- MUI DatePicker handles invalid date validation automatically
- Selected date is properly formatted to YYYY-MM-DD on submit
- Clearing the date field sets it to undefined
- No console errors or TypeScript issues

### Task 7: Display Due Date in TodoItem

**Status**: TODO  
**Depends On**: [2, 6]  
**Description**:
Update `TodoItem` component to display the due date with user-friendly formatting. Include visual indication for overdue items (red text or warning icon for dates before today).

**Code Snippet**:

```typescript
import { format, parseISO, isBefore, startOfToday } from 'date-fns';
import { Chip } from '@mui/material';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';

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
```

**Verification**:

- Due date displays with user-friendly format (e.g., "Jan 15, 2025")
- Overdue items show red chip with warning icon
- Completed todos don't show overdue indicator (even if past due)
- Todos without due date don't show any date chip
- Date formatting works correctly across different locales

### Task 8: Update CreateTodoButton Integration

**Status**: TODO  
**Depends On**: [5, 6]  
**Description**:
Update `CreateTodoButton` component to work with the new modal state management in `App.tsx`. Move the modal opening logic to the App component.

**Code Snippet**:

```typescript
// In App.tsx, add handler for create button
const handleCreateClick = () => {
  setModalMode('create');
  setEditingTodo(null);
  setIsModalOpen(true);
};

// Pass to CreateTodoButton
<CreateTodoButton onClick={handleCreateClick} />

// Update CreateTodoButton component
interface CreateTodoButtonProps {
  onClick: () => void;
}

export const CreateTodoButton: React.FC<CreateTodoButtonProps> = ({ onClick }) => {
  return (
    <Button
      variant="contained"
      color="primary"
      onClick={onClick}
      startIcon={<AddIcon />}
      data-testid="create-todo-button"
    >
      New Todo
    </Button>
  );
};
```

**Verification**:

- Clicking "New Todo" button opens modal in create mode
- Modal is empty (no pre-filled data)
- Creating a todo with due date works correctly
- No TypeScript errors

### Task 9: Update Unit Tests for Todo Type

**Status**: TODO  
**Depends On**: [2]  
**Description**:
Update existing unit tests in `src/__tests__/TodoContext.test.tsx` to handle the optional `dueDate` field in the `Todo` interface.

**Code Snippet**:

```typescript
describe('TodoContext', () => {
  it('should add a todo without due date', () => {
    // ... existing test ...
    addTodo('Test Todo', 'Test Description');
    expect(todos[0]).toMatchObject({
      title: 'Test Todo',
      description: 'Test Description',
      completed: false,
      dueDate: undefined,
    });
  });

  it('should add a todo with due date', () => {
    // ... test setup ...
    addTodo('Test Todo', 'Test Description', '2025-12-31');
    expect(todos[0]).toMatchObject({
      title: 'Test Todo',
      description: 'Test Description',
      completed: false,
      dueDate: '2025-12-31',
    });
  });

  it('should edit a todo and update due date', () => {
    // ... test setup ...
    editTodo(todoId, { dueDate: '2025-12-31' });
    expect(todos[0].dueDate).toBe('2025-12-31');
  });

  it('should edit a todo and remove due date', () => {
    // ... test setup with dueDate ...
    editTodo(todoId, { dueDate: undefined });
    expect(todos[0].dueDate).toBeUndefined();
  });
});
```

**Verification**:

- All existing tests still pass
- New tests for due date functionality pass
- Test coverage remains at or above baseline

### Task 10: Add Unit Tests for TodoModal with DatePicker

**Status**: TODO  
**Depends On**: [6]  
**Description**:
Create comprehensive unit tests for the `TodoModal` component covering due date selection, editing, and clearing scenarios.

**Code Snippet**:

```typescript
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoModal } from '../components/TodoModal/TodoModal';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

describe('TodoModal - Due Date', () => {
  const mockOnClose = jest.fn();
  const mockAddTodo = jest.fn();
  const mockEditTodo = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderModal = (props) => {
    return render(
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <TodoModal {...props} />
      </LocalizationProvider>
    );
  };

  it('should render date picker in create mode', () => {
    renderModal({ isOpen: true, onClose: mockOnClose, mode: 'create' });
    expect(screen.getByLabelText(/due date/i)).toBeInTheDocument();
  });

  it('should create todo with due date', async () => {
    renderModal({ isOpen: true, onClose: mockOnClose, mode: 'create' });

    await userEvent.type(screen.getByTestId('title-input'), 'Test Todo');
    // Test date picker interaction
    // ... date selection logic ...

    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(mockAddTodo).toHaveBeenCalledWith('Test Todo', '', '2025-12-31');
    });
  });

  it('should display existing due date in edit mode', () => {
    const initialValues = {
      id: '1',
      title: 'Test',
      description: 'Desc',
      completed: false,
      dueDate: '2025-12-31',
    };

    renderModal({
      isOpen: true,
      onClose: mockOnClose,
      mode: 'edit',
      initialValues
    });

    // Verify date picker shows the existing date
    // ... assertion logic ...
  });

  it('should allow clearing due date in edit mode', async () => {
    const initialValues = {
      id: '1',
      title: 'Test',
      description: 'Desc',
      completed: false,
      dueDate: '2025-12-31',
    };

    renderModal({
      isOpen: true,
      onClose: mockOnClose,
      mode: 'edit',
      initialValues
    });

    // Clear the date picker
    // ... clear logic ...

    fireEvent.click(screen.getByTestId('submit-button'));

    await waitFor(() => {
      expect(mockEditTodo).toHaveBeenCalledWith('1', expect.objectContaining({
        dueDate: undefined,
      }));
    });
  });
});
```

**Verification**:

- All TodoModal date picker tests pass
- Edge cases covered (null date, invalid date, clearing date)
- No warnings in test output
- Test coverage for TodoModal remains high

### Task 11: Add Unit Tests for TodoItem Due Date Display

**Status**: TODO  
**Depends On**: [7]  
**Description**:
Create unit tests for the `TodoItem` component to verify due date display and overdue indicator functionality.

**Code Snippet**:

```typescript
import { render, screen } from '@testing-library/react';
import { TodoItem } from '../components/TodoList/TodoItem';
import { format, parseISO, subDays, addDays } from 'date-fns';

describe('TodoItem - Due Date Display', () => {
  const mockOnEditClick = jest.fn();

  const baseTodo = {
    id: '1',
    title: 'Test Todo',
    description: 'Description',
    completed: false,
    createdAt: new Date(),
  };

  it('should not display due date chip when no due date', () => {
    render(<TodoItem todo={baseTodo} onEditClick={mockOnEditClick} />);
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('should display due date in user-friendly format', () => {
    const todo = { ...baseTodo, dueDate: '2025-12-31' };
    render(<TodoItem todo={todo} onEditClick={mockOnEditClick} />);

    expect(screen.getByText('Dec 31, 2025')).toBeInTheDocument();
  });

  it('should show overdue indicator for past due date', () => {
    const yesterday = subDays(new Date(), 1).toISOString().split('T')[0];
    const todo = { ...baseTodo, dueDate: yesterday };

    render(<TodoItem todo={todo} onEditClick={mockOnEditClick} />);

    // Check for warning icon or red styling
    const chip = screen.getByText(format(parseISO(yesterday), 'PP')).closest('.MuiChip-root');
    expect(chip).toHaveClass('MuiChip-colorError');
  });

  it('should not show overdue indicator for completed todos', () => {
    const yesterday = subDays(new Date(), 1).toISOString().split('T')[0];
    const todo = { ...baseTodo, dueDate: yesterday, completed: true };

    render(<TodoItem todo={todo} onEditClick={mockOnEditClick} />);

    // Should not have error color
    const chip = screen.getByText(format(parseISO(yesterday), 'PP')).closest('.MuiChip-root');
    expect(chip).not.toHaveClass('MuiChip-colorError');
  });

  it('should not show overdue indicator for future dates', () => {
    const tomorrow = addDays(new Date(), 1).toISOString().split('T')[0];
    const todo = { ...baseTodo, dueDate: tomorrow };

    render(<TodoItem todo={todo} onEditClick={mockOnEditClick} />);

    const chip = screen.getByText(format(parseISO(tomorrow), 'PP')).closest('.MuiChip-root');
    expect(chip).not.toHaveClass('MuiChip-colorError');
  });
});
```

**Verification**:

- All TodoItem date display tests pass
- Overdue logic works correctly
- Edge cases covered (no date, past, future, completed)
- No test failures or warnings

### Task 12: Integration Testing

**Status**: TODO  
**Depends On**: [8, 9, 10, 11]  
**Description**:
Perform manual integration testing to verify the complete feature works end-to-end across all user flows.

**Testing Checklist**:

1. **Create todo with due date**:
   - Open create modal
   - Fill in title and description
   - Select a future due date
   - Submit and verify todo appears with formatted date

2. **Create todo without due date**:
   - Create todo without selecting a date
   - Verify no date chip appears

3. **Edit todo to add due date**:
   - Click existing todo (without date)
   - Add a due date
   - Save and verify date appears

4. **Edit todo to change due date**:
   - Click todo with existing date
   - Change the date
   - Save and verify new date appears

5. **Edit todo to remove due date**:
   - Click todo with date
   - Clear the date picker
   - Save and verify date chip disappears

6. **Overdue indicator**:
   - Create todo with past due date
   - Verify red chip with warning icon appears
   - Mark todo as complete
   - Verify overdue indicator disappears

7. **Date formatting**:
   - Verify dates display in user-friendly format (e.g., "Jan 15, 2025")
   - Test with different dates to ensure consistency

8. **Validation**:
   - Try entering invalid date formats
   - Verify MUI DatePicker handles validation
   - No console errors appear

**Verification**:

- All manual test scenarios pass
- No console errors or warnings
- UI is responsive and intuitive
- Date formatting is consistent

### Task 13: Update Tests to Match New Baseline

**Status**: TODO  
**Depends On**: [9, 10, 11]  
**Description**:
Run the full test suite and ensure all tests pass with coverage at or above the existing baseline.

**Verification**:

- Run `npm test`
- All tests pass
- No test failures or warnings
- Coverage report shows ≥ baseline coverage
- No type errors with `npm run typecheck`

---

## Acceptance Criteria Mapping

| Acceptance Criterion                                               | Task(s)          |
| ------------------------------------------------------------------ | ---------------- |
| User can optionally pick a due date when creating a todo           | 6, 8             |
| Existing todos without due date remain unaffected                  | 2, 7             |
| Editing a todo shows current due date and allows change or removal | 5, 6             |
| Due date shows in todo item list                                   | 7                |
| Validation prevents submission of clearly invalid dates            | 6 (MUI built-in) |
| Data persists after page refresh (when AIADT-10 merges)            | 2 (documented)   |
| All unit tests pass and coverage ≥ existing baseline               | 9, 10, 11, 13    |

---

## Risks and Edge Cases

### Risks

1. **Date-fns version compatibility**: Ensure date-fns v3 works with MUI date pickers v7
2. **Timezone issues**: Using date-only format (YYYY-MM-DD) mitigates this
3. **Test complexity**: Date picker testing can be tricky; may need to mock date functions

### Edge Cases Handled

- ✅ Todos without due dates (backward compatibility)
- ✅ Invalid dates (MUI DatePicker validation)
- ✅ Past due dates (allowed, with overdue indicator)
- ✅ Completed overdue todos (no warning indicator)
- ✅ Clearing due date in edit mode
- ✅ Malformed date strings (treated as undefined)

---

## Rollback Plan

If issues arise:

1. Revert the PR/commit
2. App will continue to function without due date feature
3. Existing todos are unaffected (optional field)
4. No data migration needed

---

## Telemetry/Monitoring

No additional telemetry required for this client-side feature. Monitor:

- Console errors in production (none expected)
- User feedback on date picker UX

---

## Manual QA Checklist

After implementation:

- [ ] Create todo with due date → appears correctly
- [ ] Create todo without due date → no date shown
- [ ] Edit todo to add due date → date appears
- [ ] Edit todo to change due date → date updates
- [ ] Edit todo to remove due date → date disappears
- [ ] Overdue indicator shows for past dates
- [ ] Overdue indicator hidden for completed todos
- [ ] Date format is user-friendly (e.g., "Jan 15, 2025")
- [ ] MUI DatePicker prevents invalid dates
- [ ] All unit tests pass (`npm test`)
- [ ] TypeScript compiles (`npm run typecheck`)
- [ ] No linter errors (`npm run lint`)
- [ ] No console errors or warnings

---

## Execution Guide

1. Pick the next task that is not in progress and has all dependencies marked as DONE.
   If multiple tasks are eligible, pick the first one in the list.

2. Execute the selected task:
   a. Set status to IN-PROGRESS
   b. Follow the task description
   c. Complete verification steps
   d. Set status to DONE when verified successfully

3. Continue to the next eligible task until all tasks are completed.

---

## References

- Jira Ticket: https://diligentbrands.atlassian.net/browse/AIADT-115
- MUI Date Pickers: https://mui.com/x/react-date-pickers/
- date-fns Documentation: https://date-fns.org/
- Related: AIADT-10 (sessionStorage persistence)
