import {auth} from "./firebase-config.js";

import {
    signInWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js";

/* ==========================================
   ADMIN LOGIN
========================================== */
export async function adminLogin(
    email,
    password
) {
    email = String(email || "").trim();

    password = String(password || "");

    if (!email) {
        return {
            success: false,
            message: "Please enter admin email."
        };
    }

    if (!password) {
        return {
            success: false,
            message: "Please enter password."
        };
    }

    try {
        const result =
            await signInWithEmailAndPassword(
                auth,
                email,
                password
            );

        const user =
            result.user;

        console.log(
            "Admin Authentication Success:",
            user.uid
        );

        return {
            success: true,
            uid: user.uid,
            email: user.email
        };
    }

    catch (error) {
        console.error("Admin Login Error:", error);
        return {
            success: false,
            message:
                error.message ||
                "Admin login failed."
        };
    }
}

/* ==========================================
   ADMIN LOGOUT
========================================== */
export async function adminLogout() {
    try {
        await signOut(auth);

        console.log("Admin logged out.");
        return {
            success: true
        };
    }

    catch (error) {
        console.error("Admin Logout Error:", error);
        return {
            success: false,
            message:
                error.message ||
                "Logout failed."
        };
    }
}

/* ==========================================
   CURRENT USER
========================================== */
export function getCurrentAuthUser() {
    return auth.currentUser || null;
}

/* ==========================================
   AUTH STATE
========================================== */
export function watchAdminAuth(
    callback
) {
    return onAuthStateChanged(
        auth,
        user => {
            callback(
                user || null
            );
        }
    );
}

export async function isCurrentUserAdmin() {

    const user =
        auth.currentUser;


    if (!user) {

        return false;

    }


    const tokenResult =
        await user.getIdTokenResult();


    return (
        tokenResult.claims.admin === true
    );

}