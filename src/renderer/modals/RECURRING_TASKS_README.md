# Recurring Tasks Modal

A modal for creating recurring tasks with customizable frequency and days of the week.

## Features

- **Frequency Options:**
  - Every Week: Task appears every week on selected days
  - Every Other Week: Task appears every other week (even-numbered weeks) on selected days
  - Monthly: Task appears on the first week of each month on selected days

- **Day Selection:** Choose any combination of days (Sunday through Saturday)

- **Task Details:**
  - Title (required)
  - Status (NEW, IN_PROGRESS, COMPLETED, CANCELED, BLOCKED)
  - Details (optional notes)

## Database Schema

Recurring tasks are stored in the `recurringTasks` table with the following structure:

```typescript
interface TRecurringTask {
  id: string                        // Unique identifier
  title: string                     // Task title
  frequency: ERecurringFrequency    // EVERY_WEEK | EVERY_OTHER_WEEK | MONTHLY
  daysOfWeek: EDayOfWeek[]         // Array of days (0=Sunday, 1=Monday, etc.)
  details: string                   // Optional task details
  status: ETaskStatus              // Task status
}
```

## Usage

To open the Recurring Tasks Modal from anywhere in the app:

```typescript
import { activeModalSignal } from '../signals';
import { ModalID } from '../modals';

// Trigger the modal
activeModalSignal.value = { id: ModalID.RECURRING_TASKS_MODAL };
```

### Example: Add a button to TodoList

In `TodoList.tsx`, you could add a button like:

```tsx
<Button
  onClick={() => {
    activeModalSignal.value = { id: ModalID.RECURRING_TASKS_MODAL };
  }}
>
  Add Recurring Task
</Button>
```

## Examples

- **Every other Tuesday and Thursday:** 
  - Frequency: Every Other Week
  - Days: Tuesday, Thursday

- **Every Wednesday:**
  - Frequency: Every Week  
  - Days: Wednesday

- **Monthly on Mondays and Fridays:**
  - Frequency: Monthly (First Week)
  - Days: Monday, Friday

## Future Integration

The modal currently stores recurring tasks in the database but doesn't automatically generate task instances yet. Future features could include:

- Automatic task generation based on recurring schedule
- Edit/delete existing recurring tasks
- View list of all recurring tasks
- Enable/disable recurring tasks
- Custom date ranges for recurring tasks
