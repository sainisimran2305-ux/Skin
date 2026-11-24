import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

const SESSION_KEY = 'prakriti_auth_session_v3';
const USERS_DB_KEY = 'prakriti_registered_users_v3';

// Official Store Admin Credentials
export const ADMIN_CREDENTIALS = {
  name: 'Simran Saini (Admin)',
  email: 'sainisimran2304@gmail.com',
  password: 'simran',
  role: 'owner',
};

// Also export as OWNER_CREDENTIALS for backwards compatibility if referenced
export const OWNER_CREDENTIALS = ADMIN_CREDENTIALS;

export const AuthProvider = ({ children }) => {
  // Registered customer accounts database
  const [registeredUsers, setRegisteredUsers] = useState(() => {
    try {
      const saved = localStorage.getItem(USERS_DB_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read users database:', e);
    }
    return [];
  });

  // Current logged in user session (null by default; visitors must authenticate first)
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem(SESSION_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.email && parsed.isAuthenticated) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read session:', e);
    }
    return null;
  });

  // Save registered users list
  const saveUsersDB = (newUsers) => {
    setRegisteredUsers(newUsers);
    try {
      localStorage.setItem(USERS_DB_KEY, JSON.stringify(newUsers));
    } catch (e) {
      console.error('Failed to save users database:', e);
    }
  };

  // Save active session
  const saveSession = (userData) => {
    setUser(userData);
    try {
      if (userData) {
        localStorage.setItem(SESSION_KEY, JSON.stringify(userData));
      } else {
        localStorage.removeItem(SESSION_KEY);
      }
    } catch (e) {
      console.error('Failed to save session:', e);
    }
  };

  // Sign Up / Register Customer Account
  const signup = async ({ name, email, password, skinType = 'all' }) => {
    const trimmedEmail = email.trim().toLowerCase();
    const trimmedName = name.trim();

    if (!trimmedName) {
      return { success: false, error: 'Please enter your full name.' };
    }
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      return { success: false, error: 'Please provide a valid email address.' };
    }
    if (!password || password.length < 4) {
      return { success: false, error: 'Password must be at least 4 characters long.' };
    }

    // Do not allow registering admin email as a regular customer
    if (trimmedEmail === ADMIN_CREDENTIALS.email.toLowerCase()) {
      return {
        success: false,
        error: 'This email is reserved for the Store Administrator. Please sign in as Admin.',
      };
    }

    // Check if email already registered
    const exists = registeredUsers.some((u) => u.email.toLowerCase() === trimmedEmail);
    if (exists) {
      return { success: false, error: 'An account with this email already exists. Please sign in.' };
    }

    const newUserRecord = {
      name: trimmedName,
      email: trimmedEmail,
      password: password,
      skinType: skinType || 'all',
      role: 'customer',
      createdAt: new Date().toISOString(),
    };

    const updatedUsers = [...registeredUsers, newUserRecord];
    saveUsersDB(updatedUsers);

    // Automatically log in the newly registered customer
    const sessionUser = {
      name: newUserRecord.name,
      email: newUserRecord.email,
      skinType: newUserRecord.skinType,
      role: 'customer',
      isAuthenticated: true,
    };
    saveSession(sessionUser);

    return { success: true, user: sessionUser };
  };

  // Login (validates Admin or Registered Customer)
  const login = async (email, password) => {
    const trimmedEmail = email.trim().toLowerCase();

    // 1. Check Store Administrator Credentials
    if (
      trimmedEmail === ADMIN_CREDENTIALS.email.toLowerCase() &&
      password === ADMIN_CREDENTIALS.password
    ) {
      const adminUser = {
        name: ADMIN_CREDENTIALS.name,
        email: ADMIN_CREDENTIALS.email,
        role: 'owner',
        isAuthenticated: true,
      };
      saveSession(adminUser);
      return { success: true, role: 'owner', user: adminUser };
    }

    // 2. Check Customer in Registered Users
    const foundUser = registeredUsers.find((u) => u.email.toLowerCase() === trimmedEmail);
    if (foundUser) {
      if (foundUser.password !== password) {
        return { success: false, error: 'Incorrect password. Please try again.' };
      }
      const customerUser = {
        name: foundUser.name,
        email: foundUser.email,
        skinType: foundUser.skinType || 'all',
        role: 'customer',
        isAuthenticated: true,
      };
      saveSession(customerUser);
      return { success: true, role: 'customer', user: customerUser };
    }

    // If email is admin's email but password was wrong
    if (trimmedEmail === ADMIN_CREDENTIALS.email.toLowerCase()) {
      return { success: false, error: 'Incorrect administrator password.' };
    }

    // Unregistered account
    return {
      success: false,
      error: 'No account found with this email. Please click Create Account to sign up as a customer.',
    };
  };

  // Logout
  const logout = () => {
    saveSession(null);
  };

  const isAuthenticated = Boolean(user && user.isAuthenticated);
  const isOwner = Boolean(user && user.role === 'owner' && user.isAuthenticated);
  const isAdmin = isOwner;
  const isCustomer = Boolean(user && user.role === 'customer' && user.isAuthenticated);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isOwner,
        isAdmin,
        isCustomer,
        registeredUsers,
        login,
        signup,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
