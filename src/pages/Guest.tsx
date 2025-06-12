import { useEffect, useState } from 'react';
import { db } from "../firebase";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  increment,
  arrayUnion,
} from "firebase/firestore";
import { getAuth, onAuthStateChanged } from "firebase/auth";

interface Poll {
  id: string;
  name: string;
  options: string[];
  votes: Record<string, number>;
  voters?: string[];
}

export default function Guest() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid);
        fetchPolls();
      } else {
        setUserId(null);
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
          if (typeof opt === 'string') {
            return opt;
          } else if (typeof opt === 'object' && opt !== null && 'text' in opt && typeof opt.text === 'string') {
            return opt.text;
          }
          return String(opt);
        }) || [];

        return {
          id: docSnap.id,
          name: data.name,
          options: processedOptions,
          votes: data.votes || {},
          voters: data.voters || [],
        };
      });
      setPolls(pollData);
    } catch (error) {
      console.error("Error fetching polls:", error);
      alert("Failed to fetch polls. Please try again later.");
    }
  };

  const handleVote = async (pollId: string, option: string) => {
    if (!userId) {
      alert("Please log in to vote.");
      return;
    }

    const poll = polls.find((p) => p.id === pollId);
    if (poll?.voters?.includes(userId)) {
      alert("You have already voted for this poll.");
      return;
    }

    try {
      const pollRef = doc(db, "polls", pollId);
      await updateDoc(pollRef, {
        [`votes.${option}`]: increment(1),
        voters: arrayUnion(userId),
      });

      alert("Thank you for voting!");

      setPolls((prev) =>
        prev.map((p) =>
          p.id === pollId
            ? {
              ...p,
              votes: {
                ...p.votes,
                [option]: (p.votes?.[option] || 0) + 1,
              },
              voters: [...(p.voters || []), userId],
            }
            : p
        )
      );
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
      <div className="container">
        <div className="container-page">
          <h2 className="poll-header">Available Polls</h2> {/* Kept your h2 class */}
          <div className="guest-container">
            {polls.length === 0 ? (
              <p>No polls available.</p>
            ) : (
              <ul className="container-list">
                {polls.map((poll) => (
                  <li key={poll.id}>
                    <div className="poll-guest-container">

                      <h3 className="guest-questions">{poll.name}</h3>
                      <ul className="guest-questions-list">
                        {poll.options.map((option, index) => (
                          <li key={`${poll.id}-${option}-${index}`} style={{ marginBottom: '8px' }}>

                            <button
                              onClick={() => handleVote(poll.id, option)}
                              disabled={poll.voters?.includes(userId)}
                              className="btn-guest"
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