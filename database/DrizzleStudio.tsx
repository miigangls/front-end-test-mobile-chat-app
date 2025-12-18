import React from 'react';
import { View } from 'react-native';
import * as SQLite from 'expo-sqlite';

const NoopStudio = () => null;

let useDrizzleStudio: any = NoopStudio;

if (__DEV__) {
  try {
    const expoDrizzleStudioPlugin = require('expo-drizzle-studio-plugin');
    if (expoDrizzleStudioPlugin && expoDrizzleStudioPlugin.useDrizzleStudio) {
      useDrizzleStudio = expoDrizzleStudioPlugin.useDrizzleStudio;
    }
  } catch (error) {
    console.warn('Drizzle Studio plugin not available, skipping integration', error);
  }
}

export function DrizzleStudioDevTool() {
  let db: SQLite.SQLiteDatabase | null = null;
  if (__DEV__ && useDrizzleStudio !== NoopStudio) {
    try {
      db = SQLite.openDatabaseSync('chat-app.db');
    } catch (error) {
      console.warn('Failed to open database for Drizzle Studio:', error);
      db = null;
    }
  }

  useDrizzleStudio(db);
  
  return <View />;
} 