import React, { createContext, useState, useContext } from 'react';

const LoginContext = createContext();

export const useLoginContext = () => useContext(LoginContext);

export const LoginProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    return (
        <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn, isLoading, setIsLoading }}>
            {children}
        </LoginContext.Provider>
    )
}