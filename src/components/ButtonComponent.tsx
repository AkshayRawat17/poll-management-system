import React from 'react'
import Button from '@mui/material/Button'

interface Props {
    title: string;
    onClick: () => void;
}

export default function ButtonComponent({ title, onClick }: Props) {
    return (
        <Button variant="contained" className='btn' onClick={onClick}>
            {title}
        </Button>
    )
}
