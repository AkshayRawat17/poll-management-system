import React from 'react'
import TextField from '@mui/material/TextField'

interface Props {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputEmail({ value, onChange }: Props) {
    return (
        <TextField
            className='input-fields'
            id="standard-email-input"
            label="Email"
            type="email"
            autoComplete="email"
            variant="standard"
            value={value}
            onChange={onChange}
        />
    )
}
