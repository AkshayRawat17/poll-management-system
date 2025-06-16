import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import Button from '@mui/material/Button';
import { NavLink } from "react-router-dom";
import NavbarAdmin from "../components/NavbarAdmin";

interface User {
    id: string;
    name: string;
    email: string;
}

export default function UsersList() {
    const [allUsers, setAllUsers] = useState<User[]>([]);

    useEffect(() => {
        const fetchUsers = async () => {
            const usersCollection = collection(db, "users");
            const snap = await getDocs(usersCollection);
            const usersData = snap.docs.map(doc => ({
                id: doc.id,
                ...doc.data(),
            })).filter((user: any) => user.role !== "admin") as User[];
            setAllUsers(usersData);
        };
        fetchUsers();
    }, []);

    return (
        <>
        <NavbarAdmin />
            <div className="table-container">
                <h2 className="table-user">All Users</h2>
                <div className="table">
                    {
                        allUsers.length ?
                            <>
                                <table>
                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Name</th>
                                            <th>Email</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {
                                            allUsers.map(user => (
                                                <tr key={user.id}>
                                                    <td>{user.id}</td>
                                                    <td>{user.name}</td>
                                                    <td>{user.email}</td>
                                                </tr>
                                            ))}
                                    </tbody>
                                </table>
                            </> : null
                    }
                </div>
            </div>
        </>
    );
}

