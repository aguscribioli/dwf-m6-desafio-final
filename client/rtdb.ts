import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const app = initializeApp({
  apiKey: 'oHA0HhhQaWi0p1HVJqsv7jFjF54F06CAqCPGtn05',
  // authDomain = projectId + ".firebaseapp.com"
  authDomain: 'apx-dwf-m6-2e361.firebaseapp.com',
  databaseURL: 'https://apx-dwf-m6-2e361-default-rtdb.firebaseio.com',
  projectId: 'apx-dwf-m6-2e361'
});

const rtdb = getDatabase(app);

export { rtdb };