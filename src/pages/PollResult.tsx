import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { NavLink, useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";

interface Option {
  text: string;
  votes: number;
}

interface Poll {
  id: string;
  question: string;
  options: Option[];
}

export default function PollResult() {
  const [polls, setPolls] = useState<Poll[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const auth = getAuth();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const pollSnap = await getDocs(collection(db, "polls"));
          const allPolls: Poll[] = pollSnap.docs.map((doc) => {
            const data = doc.data();

            const options: Option[] = Array.isArray(data.options)
              ? data.options.map((opt: any) => ({
                  text: opt.text,
                  votes: (data.votes && data.votes[opt.text]) || 0,
                }))
              : Object.keys(data.votes || {}).map((text) => ({
                  text,
                  votes: data.votes[text],
                }));

            return {
              id: doc.id,
              question: data.question || "Untitled Poll",
              options,
            };
          });

          const filteredPolls = allPolls.filter((poll) =>
            poll.options.some((opt) => opt.votes > 0)
          );

          setPolls(filteredPolls);
        } catch (error) {
          console.error("Error fetching poll results:", error);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-content">
          <h1 className="navbar-title">Poll System</h1>
        </div>
        <Button variant="text">
          <NavLink to="#" className="admin-anchor" onClick={() => navigate(-1)}>
            Back
          </NavLink>
        </Button>
      </nav>

      <div className="modern-result-container">
        <h2 className="result-heading">Poll Results</h2>
        <div className="poll-cards">
          {polls.length === 0 ? (
            <p style={{ textAlign: "center", color: "#666" }}>
              No poll results yet.
            </p>
          ) : (
            polls.map((poll) => {
              const maxVotes = Math.max(...poll.options.map((opt) => opt.votes));
              const winners = poll.options.filter(
                (opt) => opt.votes === maxVotes && maxVotes > 0
              );
              const isDraw = winners.length > 1;

              return (
                <div className="poll-card-result" key={poll.id}>
                  <h3 className="poll-question">{poll.question}</h3>
                  <ul className="option-list">
                    {poll.options.map((opt, index) => (
                      <li
                        key={index}
                        className={`option-item ${
                          winners.some((w) => w.text === opt.text) && isDraw
                            ? "draw-option"
                            : winners.length === 1 &&
                              winners[0].text === opt.text
                            ? "winner-option"
                            : ""
                        }`}
                      >
                        <span className="option-name">{opt.text}</span>
                        <span className="option-votes">
                          {opt.votes} vote{opt.votes !== 1 ? "s" : ""}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <div className="winner-banner">
                    {winners.length === 0 ? (
                      "No votes yet"
                    ) : isDraw ? (
                      <>
                        <strong>Draw between:</strong>{" "}
                        {winners.map((w) => w.text).join(", ")}
                      </>
                    ) : (
                      <>
                         Winner: <strong>{winners[0].text}</strong>
                      </>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </>
  );
}
