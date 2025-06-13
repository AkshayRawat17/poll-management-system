import React, { useEffect, useState } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { Box, Typography, LinearProgress } from '@mui/material';
import NavbarAdmin from '../components/NavbarAdmin';

interface Poll {
    id: string;
    question: string;
    options: string[];
    votes: Record<string, number>;
}

function LinearProgressWithLabel({ value }: { value: number }) {
    return (
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box sx={{ width: '100%', mr: 1 }}>
                <LinearProgress variant="determinate" value={value} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">{`${Math.round(value)}%`}</Typography>
            </Box>
        </Box>
    );
}

export default function Admin() {
    const [polls, setPolls] = useState<Poll[]>([]);

    useEffect(() => {
        const fetchPolls = async () => {
            const snapshot = await getDocs(collection(db, 'polls'));
            const pollsData = snapshot.docs.map((doc) => ({
                id: doc.id,
                ...doc.data()
            })) as Poll[];
            setPolls(pollsData);
        };

        fetchPolls();
    }, []);

    return (
        <>
            <NavbarAdmin />
            <Box sx={{ p: 3 }}>
                <Typography variant="h4" gutterBottom>
                    Admin Polls
                </Typography>

                {polls.map((poll) => {
                    const totalVotes = Object.values(poll.votes || {}).reduce((a, b) => a + b, 0);

                    return (
                        <Box key={poll.id} sx={{ mb: 4 }}>
                            <Typography variant="h6" gutterBottom>
                                {poll.question}
                            </Typography>
                            {poll.options.map((option, index) => {
                                const voteCount = poll.votes?.[option] || 0;
                                const percentage = totalVotes > 0 ? (voteCount / totalVotes) * 100 : 0;
                                return (
                                    <Box key={index} sx={{ mb: 1 }}>
                                        <Typography variant="body1">{option}</Typography>
                                        <LinearProgressWithLabel value={percentage} />
                                    </Box>
                                );
                            })}
                        </Box>
                    );
                })}
            </Box>
        </>
    );
}
