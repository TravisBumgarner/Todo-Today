import React from 'react'
import { TBackupInterval, TColorTheme, TDateFormat, TWeekStart } from 'sharedTypes'

const initialState: State = {
  dateFormat: TDateFormat.A,
  weekStart: TWeekStart.SUNDAY,
  colorTheme: TColorTheme.BEACH,
  backupInterval: TBackupInterval.WEEKLY
}

type State = {
  dateFormat: TDateFormat,
  weekStart: TWeekStart,
  colorTheme: TColorTheme,
  backupInterval: TBackupInterval
}

function useLocalStorage<Key extends keyof State>(key: Key): [State[Key], (newValue: State[Key]) => void ] {
  const [value, setValue] = React.useState<State[Key]>(localStorage.getItem(key) as State[Key])
  
  const updatedSetValue = React.useCallback(
    newValue => {
      localStorage.setItem(key, newValue);
      location.reload()
      setValue(newValue ?? initialState[key]);
    },
    [initialState, key, value, setValue]
  );
  return [value, updatedSetValue];
}

export default useLocalStorage