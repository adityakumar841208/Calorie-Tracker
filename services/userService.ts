import { Platform } from 'react-native';

// API URL configuration based on platform
// - iOS Simulator: Use localhost
// - Android Emulator: Use 10.0.2.2 (special alias for host machine)
// - Physical Device: Use your computer's IP address (find it with `ipconfig` on Windows)
const getApiUrl = () => {
  // Uncomment the line below if testing on a physical device
  // return 'http://192.168.0.142:3000/api';
  
  if (Platform.OS === 'android') {
    // For Android Emulator
    return 'https://calorie-tracker-qp3i.onrender.com/api';
  }
  // For iOS Simulator and Web
  return 'http://localhost:3000/api';
};

const API_URL = getApiUrl();

export type UserGoal = 'lose' | 'maintain' | 'gain';

export interface UserProfile {
  goal: UserGoal;
  targetCalories: number;
  weight: number;
  createdAt: any;
}

export async function createUserProfile(
  uid: string,
  goal: UserGoal,
  targetCalories: number,
  weight: number
): Promise<void> {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ uid, goal, targetCalories, weight }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create user profile');
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  console.log(`[getUserProfile] Fetching profile for uid: ${uid}`);
  const response = await fetch(`${API_URL}/users/${uid}`);
  console.log(`[getUserProfile] Response status: ${response.status}`);
  
  if (response.status === 404) {
    console.log('[getUserProfile] Profile not found (404)');
    return null;
  }
  
  if (!response.ok) {
    const error = await response.json();
    console.error('[getUserProfile] Error:', error);
    throw new Error(error.error || 'Failed to fetch user profile');
  }
  
  const data = await response.json();
  console.log('[getUserProfile] Profile data:', data);
  return data;
}

export async function updateUserProfile(
  uid: string,
  updates: Partial<UserProfile>
): Promise<void> {
  console.log(`[updateUserProfile] Updating profile for uid: ${uid}`, updates);
  const response = await fetch(`${API_URL}/users/${uid}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });
  console.log(`[updateUserProfile] Response status: ${response.status}`);

  if (!response.ok) {
    const error = await response.json();
    console.error('[updateUserProfile] Error:', error);
    throw new Error(error.error || 'Failed to update user profile');
  }
  
  const data = await response.json();
  console.log('[updateUserProfile] Success:', data);
}
