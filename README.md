# Food Tracker App Guide

Food Tracker is a multi-page mobile app built with Expo, TypeScript, and Expo Router.

The app lets you:
- Create, view, update, and delete food log entries
- Store all data locally with AsyncStorage
- Review weekly calories by day in a chart view
- Navigate between Home, Food Log, Reports, and About screens

## 1. Tech Stack

- Expo SDK 54
- React Native + React 19
- TypeScript
- Expo Router (Stack navigation)
- AsyncStorage for local persistence

## 2. Data Model

Each food log entry includes:
- id: string
- name: string
- calories: number
- timestamp: string (ISO date-time)

Reference: [types/foodLog.ts](types/foodLog.ts)

## 3. Storage Strategy

- Storage engine: @react-native-async-storage/async-storage
- Storage key: food_logs
- Data is serialized JSON in local device storage

Storage utility methods:
- getAllLogs
- addLog
- updateLog
- deleteLog
- getLogById
- getTodayStats
- getWeekStats

Reference: [utils/foodLogStorage.ts](utils/foodLogStorage.ts)

## 4. Navigation and Screens

The app uses a root Stack navigator.

Main routes:
- / -> Home
- /food-log -> Food Log list
- /add-food-log -> Add entry form (modal presentation)
- /edit-food-log?id=... -> Edit entry form (modal presentation)
- /reports -> Weekly reports
- /about -> About and usage details

Reference: [app/_layout.tsx](app/_layout.tsx)

## 5. Feature Walkthrough

### Home Screen

Reference: [app/index.tsx](app/index.tsx)

Shows:
- Brief app intro
- Quick stats:
   - Total entries
   - Calories today
   - Calories this week
- Action cards to navigate to Food Log, Reports, and About

Notes:
- Stats refresh when screen regains focus, so values update after add/edit/delete.

### Food Log Screen

Reference: [app/food-log.tsx](app/food-log.tsx)

Implements list + actions:
- Displays all saved entries in a FlatList
- Sorts entries by timestamp descending (newest first)
- Edit action routes to /edit-food-log with id param
- Delete action with confirmation

Delete confirmation behavior:
- iOS/Android: native Alert dialog
- Web: custom modal confirmation

Reference for web modal: [utils/DeleteConfirmation.tsx](utils/DeleteConfirmation.tsx)

### Add / Edit Screen

References:
- [app/add-food-log.tsx](app/add-food-log.tsx)
- [app/edit-food-log.tsx](app/edit-food-log.tsx)

Behavior:
- Single shared form for create and update
- Edit mode is determined by route param id
- Form fields:
   - Food Name
   - Calories
   - Date and time input (format: YYYY-MM-DD HH:mm)
- Validation:
   - Food name required
   - Calories required and must be >= 0

### Reports Screen

Reference: [app/reports.tsx](app/reports.tsx)

Shows:
- Week navigation (previous/next week)
- Calories by day chart (bar visualization)
- Summary cards:
   - Week total
   - Daily average
   - Peak day

### About Screen

Reference: [app/about.tsx](app/about.tsx)

Contains:
- App purpose
- Key features
- Data storage explanation
- Quick usage guide

## 6. Project Structure

      app/
         _layout.tsx
         index.tsx
         food-log.tsx
         add-food-log.tsx
         edit-food-log.tsx
         reports.tsx
         about.tsx
      types/
         foodLog.ts
      utils/
         foodLogStorage.ts
         DeleteConfirmation.tsx

## 7. Setup and Run

1. Install dependencies

      npm install

2. Start Expo (default)

      npm run start

3. Useful alternatives

      npm run web
      npm run android
      npm run ios
      npm run startLocal

Android device reverse tunnel helper:

      npm run reversePhone

Lint:

      npm run lint

## 8. How to Use the App

1. Open Home screen and review quick stats.
2. Tap Food Log.
3. Tap + Add and create an entry.
4. Return to Food Log to edit or delete an entry.
5. Open Reports to inspect weekly totals and daily bars.
6. Open About for app overview and storage details.

## 9. Notes and Limitations

- Data is local-only (no backend sync).
- Clearing app data or uninstalling the app removes saved logs.
- Date/time input is typed text on the current form implementation.

## 10. Troubleshooting

### Metro or cache issues

Try:

      npm run startLocal

or

      npm run start

then press r in Expo terminal to reload.

### Web build starts but screen shows stale errors

- Restart Expo server.
- Hard refresh browser tab.

### Dependency compatibility warning for AsyncStorage

If Expo reports a version mismatch, align to the Expo-recommended version:

      npx expo install @react-native-async-storage/async-storage

## 11. Future Improvements

- Add search and filters on Food Log
- Add export/import backup
- Add monthly and custom range reports
- Add unit and integration tests

