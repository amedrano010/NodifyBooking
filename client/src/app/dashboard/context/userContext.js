import { createContext, useContext, useState, useEffect } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState({
        _id: "1",
        name: "Abram",
        email: "abram@gmail.com",
        role: "admin",
        company: {
            _id: "67bc20ce826eb16b26fbf8cc",
            name: "Nodify",
            stores: [
                { _id: 1, name: "Violetear" },
                { _id: 2, name: "Potranco" },
                { _id: 3, name: "Corpus" },
            ],
        },
        selectedStore: 1,
    });

    console.log(user);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
}

export function useUser() {
    return useContext(UserContext);
}
