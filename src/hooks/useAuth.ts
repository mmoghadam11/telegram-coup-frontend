import React from "react";
import {AuthContext} from "../context/AuthProvider";

export function useAuth() {
    const context = React.useContext(AuthContext);
    if (context === null) {
        throw new Error(`useAuth must be used within a AuthProvider`);
    }
    return context;
}