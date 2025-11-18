import React, { useEffect, useState } from "react";
import type { ReactElement } from "react";
import { Navigate } from "react-router-dom";

interface AuthGuardProps {
    children: ReactElement;
}

export default function AuthGuard({ children }: AuthGuardProps) {
    const [loading, setLoading] = useState(true);
    const [authorized, setAuthorized] = useState(false);

    useEffect(() => {
        const checkAuth = async () => {
            const res = await fetch(import.meta.env.VITE_SERVER_URL + "/auth", {
                method: "get",
                credentials: "include"
            });
            setAuthorized(res.ok);
            setLoading(false);
        };
        checkAuth();
    }, []);

    if (loading) return <div></div>;
    return authorized ? children : <Navigate to="/login" replace />;
}