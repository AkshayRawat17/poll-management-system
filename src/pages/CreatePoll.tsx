import React, { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';
import ButtonComponent from "../components/ButtonComponent";

interface PollOption {
    id: number;
    text: string;
}

export default function CreatePoll() {
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState<PollOption[]>([
        { id: 1, text: '' },
        { id: 2, text: '' }
    ]);

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index].text = value;
        setOptions(newOptions);
    };

    const addOption = () => {
        setOptions([...options, { id: Date.now(), text: '' }]);
    };

    const handleSubmit = async () => {
        if (!question.trim() || options.some(opt => !opt.text.trim())) {
            alert("Please fill in all fields");
            return;
        }

        const pollData = {
            question,
            options: options.map(opt => ({ text: opt.text, votes: 0 })),
            createdAt: new Date()
        };

        try {
            await addDoc(collection(db, "polls"), pollData);
            alert("New Poll Created");
            setQuestion('');
            setOptions([{ id: 1, text: '' }, { id: 2, text: '' }]);
        } catch (error) {
            console.error("Error adding poll: ", error);
        }
    };

    return (
        <div className="poll-container">
            <form>
                <h2 className='create-poll-head'>Create a New Poll</h2>
                <input
                    type="text"
                    placeholder="Create Your New Poll...."
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                />
                {options.map((option, index) => (
                    <input
                        key={option.id}
                        type="text"
                        placeholder={`Option ${index + 1}`}
                        value={option.text}
                        onChange={(e) => handleOptionChange(index, e.target.value)}
                    />
                ))}
                {/* <button type="button" onClick={addOption}>Add Option</button> */}
                <ButtonComponent title="Add Options" onClick={addOption} />
                {/* <button type="submit">Create Poll</button> */}
                <ButtonComponent title="Create Poll" onClick={handleSubmit} />
            </form>
        </div>
    );
}
