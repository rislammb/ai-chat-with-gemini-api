import { useEffect, useRef, useState } from "react";
import markdownit from "markdown-it";
import { interactWithAI } from "./utils/actions.js";
import Loading from "./components/Loading.jsx";

const App = () => {
  const [submitting, setSubmitting] = useState(false);
  const [value, setValue] = useState("");
  const [error, setError] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const md = markdownit({
    html: true,
    linkify: true,
    typographer: true,
  });
  const scrollToRef = useRef(null);

  const surpriseOptions = [
    "Who won the latest peace prize?",
    "Where does pizza come from?",
    "Who do you make a BLT sandwich?",
  ];

  const surprise = () => {
    const randomValue =
      surpriseOptions[Math.floor(Math.random() * surpriseOptions.length)];
    setValue(randomValue);
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter") {
      if (event.shiftKey) {
        return;
      } else {
        handleSubmit(event);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!value) {
      setError("Error! Please ask a a question!");
      return;
    }

    setSubmitting(true);
    setChatHistory((prevState) => [
      ...prevState,
      {
        role: "user",
        parts: [{ text: value }],
      },
    ]);
    interactWithAI([...chatHistory], value)
      .then((data) => {
        setChatHistory((prevState) => [
          ...prevState,
          {
            role: "model",
            parts: [{ text: data }],
          },
        ]);
        setValue("");
      })
      .catch((error) => {
        console.log(error);
        setError("Something went wrong! please try again later.");
      })
      .finally(() => setSubmitting(false));
  };

  const handleClear = () => {
    setError("");
    setValue("");
    setChatHistory([]);
  };

  useEffect(() => {
    if (scrollToRef.current) {
      scrollToRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory.length]);

  const getParsedContent = (text) => md.render(text || "");

  return (
    <div className="app">
      <div className="search-result">
        {chatHistory.map((chatItem, index) => (
          <div
            key={index}
            className={
              chatItem.role === "user" ? "chat-item user" : "chat-item"
            }
          >
            {chatItem.role !== "user" && <img src="./logo.png" width={48} />}
            <article
              className="answer"
              dangerouslySetInnerHTML={{
                __html: getParsedContent(chatItem.parts[0].text),
              }}
            />
            {index === chatHistory.length - 2 && <div ref={scrollToRef} />}
          </div>
        ))}
        {submitting && <Loading />}
      </div>
      <div className={"bottom"}>
        <div className={"bottom_content"}>
          <p className="bottom_p">
            What do yoy want to know?
            <button
              className={"surprise"}
              onClick={chatHistory.length > 0 ? handleClear : surprise}
            >
              {chatHistory.length > 0 ? "Clear Chat" : "Surprise me"}
            </button>
          </p>
          <form className={"input-container"} onSubmit={handleSubmit}>
            <textarea
              rows={1}
              value={value}
              placeholder={"When is winter...?"}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={submitting}
              draggable={false}
            />
            {error ? (
              <button onClick={handleClear}>Clear</button>
            ) : (
              <button type={"submit"} disabled={!value || submitting}>
                Ask
              </button>
            )}
          </form>
          {error && <p className="error-text">{error}</p>}
        </div>
      </div>
    </div>
  );
};

export default App;
