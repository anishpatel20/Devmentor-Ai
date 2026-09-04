import { createContext, useContext, useState } from "react";

const createEmptyContext = () => ({
    code: "",
    language: "",
    error: "",
    problem: "",
    rootCause: "",
    solution: "",
    fixedCode: "",
});

const SharedContext = createContext(null);

export const SharedContextProvider = ({ children }) => {
    const [context, setContext] = useState(createEmptyContext);

    // Used when the developer changes the current task/input.
    // Old AI-generated information becomes invalid.
    const updateUserContext = (updates) => {
        setContext((current) => ({
            ...current,
            ...updates,

            rootCause: "",
            solution: "",
            fixedCode: "",
        }));
    };

    // Used after Debug successfully produces new analysis.
    const updateDebugContext = (updates) => {
        setContext((current) => ({
            ...current,
            ...updates,
        }));
    };

    // Starts a completely new task.
    const clearContext = () => {
        setContext(createEmptyContext());
    };

    const value = {
        context,
        updateUserContext,
        updateDebugContext,
        clearContext,
    };

    return (
        <SharedContext.Provider value={value}>
            {children}
        </SharedContext.Provider>
    );
};

export const useSharedContext = () => {
    const value = useContext(SharedContext);

    if (!value) {
        throw new Error(
            "useSharedContext must be used inside a SharedContextProvider"
        );
    }

    return value;
};