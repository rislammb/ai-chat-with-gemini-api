import {useState} from "react";
import {interactWithAI} from "./utils/actions.js";

function App() {
    const [submitting, setSubmitting] = useState(false);
    const [value, setValue] = useState("");
    const [error, setError] = useState("");
    const [chatHistory, setChatHistory] = useState([]);

    const surpriseOptions = ["Who won the latest peace prize?", "Where does pizza come from?", "Who do you make a BLT sandwich?",]

    const surprise = () => {
        const randomValue = surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
        setValue(randomValue);
    }

    const getResponse = async (e) => {
        e.preventDefault();
        if (!value) {
            setError("Error! Please ask a a question!");
            return
        }

        setSubmitting(true);
        interactWithAI([...chatHistory], value).then((data) => {
            setChatHistory((prevState) => [...prevState, {
                role: "user", parts: [{text: value}],
            }, {
                role: "model", parts: [{text: data}],
            }])
            setValue("");
        }).catch((error) => {
            console.log(error)
            setError("something went wrong! please try again later.")
        }).finally(() => setSubmitting(false))
    }

    const handleClear = () => {
        setError("");
        setValue("")
        setChatHistory([]);
    }

    return (<div className="app">
        <div className="search-result">
            {chatHistory.map((chatItem, index) => (
                <div key={index} className={chatItem.role === "user" ? "chat-item user" : "chat-item"}>
                    <p className="answer">{chatItem.parts[0].text}</p>
                </div>))}
        </div>
        <div className={"bottom"}>
            <div className={"bottom_content"}>
                <p>What do yoy want to know?
                    <button className={"surprise"} onClick={surprise} disabled={chatHistory.length > 0}>Surprise
                        me</button>
                </p>
                <form className={"input-container"} onSubmit={getResponse}>
                    <input value={value} placeholder={"When is winter...?"} onChange={(e) => setValue(e.target.value)}/>
                    {error ? <button onClick={handleClear}>Clear</button> :
                        <button type={"submit"} disabled={!value || submitting}>Ask me</button>}
                </form>
                {error && <p>{error}</p>}
            </div>
        </div>
    </div>)
}

export default App
