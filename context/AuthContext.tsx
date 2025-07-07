import {
  createContext,
  useState,
  useEffect,
  useCallback,
  useContext,
  useMemo,
  ReactNode
} from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_ENDPOINT, LOCAL_API_ENDPOINT } from "../constant/url";

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  profileImage: string | null;
  isGoogleAuth: boolean;
  status: string;
  role: string;
  createdAt: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  token: string;
  guest: boolean;
  loading: boolean;
  error: string | null;
  profileData: ProfileData | null;

  setGuestMode: (isGuest: boolean) => void;
  fetchUserDetails: () => Promise<void>;
  saveTokenToStorage: (newToken: string) => Promise<void>;
  logout: () => Promise<void>;
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'auth_token';
const USER_DATA_KEY = 'user_data';

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [token, setToken] = useState('');
  const [guest, setGuest] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);

  const saveTokenToStorage = async (newToken: string): Promise<void> => {
    try {
      console.log("newToken", newToken)
      setToken(newToken)
      await AsyncStorage.setItem(TOKEN_KEY, JSON.stringify({ token: newToken }));
    } catch (err) {
      console.error('Error saving token:', err);
      throw err;
    }
  };

  const getTokenFromStorage = async (): Promise<string | null> => {
    try {
      const tokenDataString = await AsyncStorage.getItem(TOKEN_KEY);
      if (!tokenDataString) return null;
      const parsed = JSON.parse(tokenDataString);
      console.log("parsed",parsed)
      return parsed.token || null;
    } catch (err) {
      console.error('Error parsing token from storage:', err);
      await AsyncStorage.removeItem(TOKEN_KEY);
      return null;
    }
  };

  const saveUserDataToStorage = async (userData: ProfileData): Promise<void> => {
    try {
      await AsyncStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    } catch (err) {
      console.error('Error saving user data:', err);
    }
  };

  const getUserDataFromStorage = async (): Promise<ProfileData | null> => {
    try {
      const userDataString = await AsyncStorage.getItem(USER_DATA_KEY);
      return userDataString ? JSON.parse(userDataString) : null;
    } catch (err) {
      console.error('Error parsing user data:', err);
      await AsyncStorage.removeItem(USER_DATA_KEY);
      return null;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(TOKEN_KEY);
      await AsyncStorage.removeItem(USER_DATA_KEY);
      setToken('');
      setIsAuthenticated(false);
      setProfileData(null);
      setGuest(false);
      console.log("logout")
      return true
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const fetchUserDetails = useCallback(async (): Promise<void> => {
    const newToken = await getTokenFromStorage(); // ✅ await here

    console.log("newToken from storage →", newToken);

    if (!newToken) return;

    try {
      setLoading(true);
      setError(null);
      const BASE_URL = process.env.NODE_ENV === 'development' ? LOCAL_API_ENDPOINT : API_ENDPOINT;

      const res = await axios.get<ProfileData>(`${BASE_URL}/user/profile`, {
        headers: {
          Authorization: `Bearer ${newToken}`,
          'Content-Type': 'application/json',
        },
      });
      console.log("res.data", res.data)

      setProfileData(res.data);
      await saveUserDataToStorage(res.data);
    } catch (err: any) {
      console.error('Fetch profile error:', err);
      setError(err.response?.data?.message || 'Failed to fetch user profile');

      if (err.response?.status === 401) {
        await logout();
      }
    } finally {
      setLoading(false);
    }
  }, [token]);

  const setGuestMode = (isGuest: boolean): void => {
    setGuest(isGuest);
    setIsAuthenticated(false);
    setToken('');
    setProfileData(null);
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        setLoading(true);

        const storedToken = await getTokenFromStorage();
        if (storedToken) {
          setToken(storedToken);
          setIsAuthenticated(true);

          const cachedUser = await getUserDataFromStorage();
          if (cachedUser) setProfileData(cachedUser);
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError('Failed to initialize authentication');
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  useEffect(() => {
    if (token && isAuthenticated && !guest && !profileData) {
      fetchUserDetails();
    }
  }, [token, isAuthenticated, guest, fetchUserDetails, profileData]);

  const value = useMemo<AuthContextType>(() => ({
    isAuthenticated,
    token,
    guest,
    loading,
    error,
    profileData,
    setGuestMode,
    fetchUserDetails,
    saveTokenToStorage,
    logout,
  }), [
    isAuthenticated,
    token,
    guest,
    loading,
    error,
    profileData,
    fetchUserDetails
  ]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
