import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, database } from '../services/firebase';
import {
    onAuthStateChanged,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    updateProfile
} from 'firebase/auth';
import { ref, set, get, update } from 'firebase/database';
import { toast } from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
            setLoading(true);
            if (currentUser) {
                setUser(currentUser);
                // Fetch extended profile from Realtime Database
                try {
                    const userRef = ref(database, `users/${currentUser.uid}`);
                    const snapshot = await get(userRef);
                    if (snapshot.exists()) {
                        setUserProfile(snapshot.val());
                    } else {
                        setUserProfile(null);
                    }
                } catch (err) {
                    console.error("Error fetching user profile:", err);
                    toast.error("Error cargando perfil de usuario");
                }
            } else {
                setUser(null);
                setUserProfile(null);
            }
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    // Register function
    const register = async (email, password, fullName, phone, address) => {
        try {
            // Validate inputs
            if (!fullName || fullName.trim().length === 0) {
                toast.error("El nombre completo es requerido");
                throw new Error("Nombre completo requerido");
            }

            if (!email || !password) {
                toast.error("Email y contraseña son requeridos");
                throw new Error("Email y contraseña requeridos");
            }

            // Generate username from full name
            const generateUsername = (name) => {
                // Remove accents and special characters
                const normalized = name
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toLowerCase()
                    .replace(/\s+/g, '_')
                    .replace(/[^a-z0-9_]/g, '');

                // Add random number for uniqueness
                const randomNum = Math.floor(Math.random() * 1000);
                return `${normalized}_${randomNum}`;
            };

            // Create user account
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const newUser = userCredential.user;

            // Generate username
            const username = generateUsername(fullName.trim());

            // Update display name (only if we have a valid name)
            try {
                await updateProfile(newUser, {
                    displayName: fullName.trim()
                });
            } catch (profileError) {
                console.warn("Could not update profile:", profileError);
                // Continue anyway, this is not critical
            }

            // Save extended info to Realtime Database
            const userRef = ref(database, `users/${newUser.uid}`);
            await set(userRef, {
                uid: newUser.uid,
                username: username,
                fullName: fullName.trim(),
                email: email.trim(),
                phone: phone || '',
                address: address || '',
                createdAt: new Date().toISOString(),
                role: 'customer'
            });

            toast.success(`¡Bienvenido, ${fullName}!`);
            return true;
        } catch (error) {
            console.error("Registration error:", error);

            // User-friendly error messages
            if (error.code === 'auth/email-already-in-use') {
                toast.error("Este correo ya está registrado");
            } else if (error.code === 'auth/weak-password') {
                toast.error("La contraseña debe tener al menos 6 caracteres");
            } else if (error.code === 'auth/invalid-email') {
                toast.error("El correo electrónico no es válido");
            } else {
                toast.error(error.message || "Error al registrar usuario");
            }

            throw error;
        }
    };

    // Login Function
    const login = async (email, password) => {
        try {
            await signInWithEmailAndPassword(auth, email, password);
            toast.success("¡Hola de nuevo!");
            return true;
        } catch (error) {
            toast.error("Error al iniciar sesión: " + error.message);
            throw error;
        }
    };

    // Logout Function
    const logout = async () => {
        try {
            await signOut(auth);
            toast.success("Hasta pronto");
        } catch (error) {
            console.error(error);
        }
    };

    const updateUserProfile = async (uid, data) => {
        try {
            const userRef = ref(database, `users/${uid}`);
            await update(userRef, data);
            setUserProfile({ ...userProfile, ...data });
            toast.success("Perfil actualizado");
        } catch (error) {
            toast.error("Error actualizando perfil");
        }
    };

    const value = {
        user,
        userProfile,
        loading,
        register,
        login,
        logout,
        updateUserProfile
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
};
