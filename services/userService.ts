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
    return 'http://10.0.2.2:3000/api';
  }
  // For iOS Simulator and Web
  return 'http://localhost:3000/api';
};

const API_URL = getApiUrl();

export type UserGoal = 'lose' | 'maintain' | 'gain';

export interface UserProfile {
  goal: UserGoal;
  targetCalories: number;
  createdAt: any;
}

export async function createUserProfile(
  uid: string,
  goal: UserGoal,
  targetCalories: number
): Promise<void> {
  const response = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ uid, goal, targetCalories }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to create user profile');
  }
}

export async function getUserProfile(uid: string): Promise<UserProfile | null> {
  const response = await fetch(`${API_URL}/users/${uid}`);
  
  if (response.status === 404) {
    return null;
  }
  
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to fetch user profile');
  }
  
  return await response.json();
}

export async function updateUserProfile(
  uid: string,
  updates: Partial<UserProfile>
): Promise<void> {
  const response = await fetch(`${API_URL}/users/${uid}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Failed to update user profile');
  }
}
