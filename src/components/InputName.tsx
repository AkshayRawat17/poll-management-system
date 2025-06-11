import React from 'react'
import TextField from '@mui/material/TextField'

interface Props {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputName({ value, onChange }: Props) {
    return (
        <TextField
            className='input-fields'
            id="standard-name-input"
            label="Name"
            type="text"
            autoComplete="name"
            variant="standard"
            value={value}
            onChange={onChange}
        />
    )
}
