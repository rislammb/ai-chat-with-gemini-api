import {useState} from "react";

function App() {
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    const [chatHistory] = useState([]);

    const surpriseOptions = [
        "Who won the latest peace prize?",
        "Where does pizza come from?",
        "Who do you make a BLT sandwich?",
    ]

    const surprise = () => {
        const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
        setValue(randomValue);
    }

    const getResponse = async () => {
        if (!value) {
            setError("Error! Please ask a a question!");
            return
        }
        try {
            const options = {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    history: chatHistory,
                    message: value,
                }),
            }
            const response = await fetch("http://localhost:8000/gemini", options);
            const data = await response.text();
            console.log(data);
        } catch (error) {
            console.log(error)
            setError("something went wrong! please try again later.")
        }
    }

    const handleClear = () => {
        setError("");
    }

    return (
        <div className="app">
            <p>What do yoy want to know?
                <button className={"surprise"} onClick={surprise} disabled={!chatHistory}>Surprise me</button>
            </p>
            <div className={"input-container"}>
                <input value={value} placeholder={"When is winter...?"} onChange={(e) => setValue(e.target.value)}/>
                {error ? <button onClick={handleClear}>Clear</button> : <button onClick={getResponse}>Ask me</button>}
            </div>
            {error && <p>{error}</p>}
            <div className="search-result">
                <div key={""}>
                    <p className="answer"></p>
                </div>
            </div>
        </div>
    )
}

export default App
