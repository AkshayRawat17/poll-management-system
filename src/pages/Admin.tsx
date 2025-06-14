import { useEffect, useState } from "react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { Box, Typography, LinearProgress } from "@mui/material";
import NavbarAdmin from "../components/NavbarAdmin";

interface Option {
    text: string;
    votes: number;
}

interface Poll {
    id: string;
    name: string;
    options: Option[];
}

function LinearProgressWithLabel({ value }: { value: number }) {
    return (
        <Box sx={{ display: "flex", alignItems: "center" }}>
            <Box sx={{ width: "100%", mr: 1 }}>
                <LinearProgress variant="determinate" value={value} />
            </Box>
            <Box sx={{ minWidth: 35 }}>
                <Typography variant="body2" color="text.secondary">
                    {`${Math.round(value)}%`}
                </Typography>
            </Box>
        </Box>
    );
}

export default function DashBoard() {
    const [polls, setPolls] = useState<Poll[]>([]);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "polls"), (snapshot) => {
            const pollData: Poll[] = snapshot.docs.map((docSnap) => {
                const data = docSnap.data();
                const votesMap = data.votes || {};

                const options: Option[] = Array.isArray(data.options)
                    ? data.options.map((opt: any) => {
                        const rawVotes = votesMap[opt.text] || 0;
                        const safeVotes = Math.max(0, rawVotes);
                        return {
                            text: opt.text,
                            votes: safeVotes,
                        };
                    })
                    : [];

                return {
                    id: docSnap.id,
                    name: data.question || data.name || "Untitled Poll",
                    options,
                };
            });

            setPolls(pollData);
        });

        return () => unsubscribe();
    }, []);

    return (
        <>
            <NavbarAdmin />
            <div className="container">
                <div className="container-page">
                    <Typography variant="h4" gutterBottom className="dashboard-header">
                        Poll Status
                    </Typography>
                    {polls.map((poll) => {
                        const totalVotes = poll.options.reduce(
                            (sum, opt) => sum + Math.max(0, opt.votes),
                            0
                        ) || 1;

                        return (
                            <div key={poll.id} className="poll-card">
                                <Typography variant="h6" className="poll-title">
                                    {poll.name}
                                </Typography>
                                {poll.options.map((option) => {
                                    const votes = Math.max(0, option.votes);
                                    const percent = (votes / totalVotes) * 100;

                                    return (
                                        <Box key={option.text} sx={{ mb: 2 }}>
                                            <Typography variant="body1" className="option-label">
                                                {option.text} ({votes} votes)
                                            </Typography>
                                            <LinearProgressWithLabel value={percent} />
                                        </Box>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        </>
    );
}
