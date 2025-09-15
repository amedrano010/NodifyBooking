import { createContext, useContext, useState, useEffect } from "react";

export const UserContext = createContext();

export function UserProvider({ children }) {
    const [user, setUser] = useState({
        _id: "67bc20ce826eb16b26fbf8c9",
        first: "Abram",
        last: "Medrano",
        email: "abram@nodifyapps.io",
        stores: [
            {
                _id: "67bc20cf826eb16b26fbf8ce",
                name: "Violetear",
                company: "Nodify",
                companyId: "67bc20ce826eb16b26fbf8cc",
                user_role: "Admin",
                employees: [
                    {
                        _id: "67bc20ce826eb16b26fbf8c9",
                        first: "Abram",
                        last: "Medrano",
                        email: "abram@nodifyapps.io",
                        services: [],
                    },
                ],
            },
            {
                _id: "67bc20cf826eb16b26fbf8ce",
                name: "Potranco",
                company: "Wildernooks",
                companyId: "67bc20ce826eb16b26fbf8cc",
                user_role: "Manager",
            },
            {
                _id: "67bc20cf826eb16b26fbf8ce",
                name: "Corpus",
                company: "Something else",
                companyId: "67bc20ce826eb16b26fbf8cc",
                user_role: "Staff",
            },
        ],

        selectedStore: {
            _id: "67bc20cf826eb16b26fbf8ce",
            name: "Violetear",
            company: "Nodify",
            companyId: "67bc20ce826eb16b26fbf8cc",
            user_role: "Admin",
        },
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
