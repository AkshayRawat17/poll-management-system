import { useEffect, useState } from 'react';
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged, type User } from "firebase/auth";
import LogOut from '../components/LogoutButton';
import { NavLink } from 'react-router-dom';

interface Poll {
  id: string;
  question: string;
  options: string[];
  votes: Record<string, number>;
  voters?: Record<string, string>; 
}
import Button from '@mui/material/Button';


export default function Guest() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [userDisplayName, setUserDisplayName] = useState<string>("");

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user: User | null) => {
      if (user) {
        setUserId(user.uid);
        setUserDisplayName(user.displayName || "Guest User");
        fetchPolls();
      } else {
        setUserId(null);
        setUserDisplayName("");
        setPolls([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchPolls = async () => {
    try {
      const snapshot = await getDocs(collection(db, "polls"));
      const pollData: Poll[] = snapshot.docs.map((docSnap) => {
        const data = docSnap.data();

        const processedOptions = data.options?.map((opt: any) => {
          if (typeof opt === 'string') return opt;
          if (typeof opt === 'object' && opt !== null && 'text' in opt) return opt.text;
          return String(opt);
        }) || [];

        return {
          id: docSnap.id,
          question: data.question,
          options: processedOptions,
          votes: data.votes || {},
          voters: data.voters || {},
        };
      });
      setPolls(pollData);
    } catch (error) {
      console.error("Error fetching polls:", error);
      alert("Failed to fetch polls. Please try again later.");
    }
  };

  const handleVote = async (pollId: string, selectedOption: string) => {
    if (!userId) {
      alert("Please log in to vote.");
      return;
    }

    const poll = polls.find((p) => p.id === pollId);
    if (!poll) return;

    const previousVote = poll.voters?.[userId];

    if (previousVote === selectedOption) {
      alert("You already voted for this option.");
      return;
    }

    const pollRef = doc(db, "polls", pollId);

    try {
      const updateData: any = {
        [`votes.${selectedOption}`]: increment(1),
        [`voters.${userId}`]: selectedOption,
      };

      if (previousVote && previousVote !== selectedOption) {
        updateData[`votes.${previousVote}`] = increment(-1);
      }

      await updateDoc(pollRef, updateData);

      setPolls((prevPolls) =>
        prevPolls.map((p) =>
          p.id === pollId
            ? {
              ...p,
              votes: {
                ...p.votes,
                [selectedOption]: (p.votes[selectedOption] || 0) + 1,
                ...(previousVote && previousVote !== selectedOption
                  ? {
                    [previousVote]: Math.max(
                      (p.votes[previousVote] || 0) - 1,
                      0
                    ),
                  }
                  : {}),
              },
              voters: {
                ...p.voters,
                [userId]: selectedOption,
              },
            }
            : p
        )
      );

      alert("Your vote has been updated!");
    } catch (error) {
      console.error("Error submitting vote:", error);
      alert("Something went wrong while submitting your vote. Please try again.");
    }
  };

  if (userId === null) {
    return <p>Authenticating user...</p>;
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          <h1 className="navbar-title">🗳️ Poll System</h1>
        </div>
          <Button variant="text" > <NavLink to="/result" className="admin-anchor" >Poll Result</NavLink> </Button>
        <LogOut />
      </nav>

      <div className="container">
        <div className="container-page">
          <h2 className="poll-header">Available Polls</h2>
          <div className="guest-container">
            {polls.length === 0 ? (
              <p>No polls available.</p>
            ) : (
              <ul className="container-list">
                {polls.map((poll) => (
                  <li key={poll.id}>
                    <div className="poll-guest-container">
                      <h3 className="guest-questions">{poll.question}</h3>
                      <ul className="guest-questions-list">
                        {poll.options.map((option, index) => (
                          <li key={`${poll.id}-${option}-${index}`} style={{ marginBottom: '8px' }}>
                            <button
                              onClick={() => handleVote(poll.id, option)}
                              className={`btn-guest ${poll.voters?.[userId] === option ? "selected-option" : ""
                                }`}
                            >
                              {option}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
