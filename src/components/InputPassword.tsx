import React from 'react'
import TextField from '@mui/material/TextField'

interface Props {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputPassword({ value, onChange }: Props) {
    return (
        <TextField
            className='input-fields'
            id="standard-password-input"
            label="Password"
            type="password"
            autoComplete="password"
            variant="standard"
            value={value}
            onChange={onChange}
        />
    )
}
