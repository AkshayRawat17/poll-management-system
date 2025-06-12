import React from 'react'
import Button from '@mui/material/Button';
import { NavLink } from 'react-router-dom';

export default function NavbarAdmin() {
    return (
        <>
            <div className="admin-navbar">
                <h4 className='admin-text' >Admin Dashboard</h4>
                <Button variant="text" ><NavLink to="/admin/create-poll" className="admin-anchor" >Create New Poll</NavLink></Button>
                <Button variant="text" > <NavLink to="/admin/result" className="admin-anchor" >Poll Result</NavLink> </Button>
            </div>
        </>
    )
}
