import { useCallback, useEffect, useRef, useState } from "react";
import { Alert, Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useNavigate } from "@tanstack/react-router";
import { useUnit } from "effector-react";

import { $auth } from "stores/auth";
import { $loginState, loginFx } from "stores/login";
import { rolesRoutes } from "utils/roles";
import { useIsDesktop } from "utils/useIsDesktop";

export function LoginForm() {
    const [usernameError, setUsernameError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const usernameInput = useRef<HTMLInputElement>(null);
    const passwordInput = useRef<HTMLInputElement>(null);

    const navigate = useNavigate();

    const loginState = useUnit($loginState);
    const authState = useUnit($auth);
    const isDesktop = useIsDesktop();

    useEffect(() => {
        if (authState) {
            const value = {
                to: rolesRoutes[authState.self.role],
            };

            navigate(value);
        }
    }, [authState, navigate]);

    const handleLogin = useCallback(() => {
        const username = usernameInput.current?.value;
        const password = passwordInput.current?.value;

        if (!username) {
            setUsernameError("Username is required");
        }
        if (!password) {
            setPasswordError("Password is required");
        }
        if (username && password) {
            loginFx({ username, password });
            setPasswordError("");
            setUsernameError("");
        }
    }, [passwordInput, usernameInput]);

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            handleLogin();
        }
    };

    return (
        <Box
            sx={{
                position: "relative",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "100vh",
                backgroundImage: { xs: "none", sm: 'url("/bg.png")' },
                backgroundSize: "cover",
                backgroundPosition: "center",
                backgroundRepeat: "no-repeat",
                "::before": {
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "100%",
                    backgroundColor: { xs: "none", sm: "rgba(83, 83, 83, 0.4)" },
                    zIndex: 1,
                },
            }}
        >
            <Box
                component={Paper}
                elevation={isDesktop ? 1 : 0}
                sx={{
                    width: 400,
                    borderRadius: 1,
                    zIndex: 2,
                    p: 7,
                }}
            >
                <Typography sx={{ fontSize: 24 }}>Log In</Typography>
                <TextField
                    variant="outlined"
                    sx={{ minHeight: 56, width: 1, mt: 3, mb: 2 }}
                    inputRef={usernameInput}
                    error={!!usernameError || !!loginState.errorMessage}
                    label={usernameError || "Username"}
                />
                <TextField
                    variant="outlined"
                    type="password"
                    sx={{ minHeight: 56, width: 1, mb: 2 }}
                    inputRef={passwordInput}
                    error={!!passwordError || !!loginState.errorMessage}
                    label={passwordError || "Password"}
                    onKeyDown={handleKeyDown}
                />
                <Button
                    variant="contained"
                    color="primary"
                    sx={{
                        minHeight: 42,
                        width: 1,
                        mb: 2,
                    }}
                    onClick={handleLogin}
                >
                    Log In
                </Button>
                <Box sx={{ minHeight: 70, mb: 2 }}>
                    {loginState.errorMessage ? (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {loginState.errorMessage}
                        </Alert>
                    ) : null}
                </Box>
            </Box>
        </Box>
    );
}
