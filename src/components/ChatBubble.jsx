import { useEffect, useState } from "react";
import { Button, Container, Form } from "react-bootstrap";
import { useSelector } from "react-redux";

const ChatBubble = () => {
  const [openChat, setOpenChat] = useState(false);
  const [visible, setVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const [messageSent, setMessageSent] = useState(false);
  const [replyMessage, setreplyMessage] = useState(false);

  const darkMode = useSelector((state) => state.darkModeEnabled);

  const sendMessage = (e) => {
    e.preventDefault();

    setMessages([...messages, message]);

    setTimeout(() => {
      setMessageSent(true);
    }, 2000);

    setTimeout(() => {
      setMessageSent(false);
      setreplyMessage(true);
    }, 4000);

    setMessage("");
  };

  return (
    <div
      className={`chat-bubble rounded-circle px-2  text-center ${
        !openChat ? "heartbeat" : ""
      }`}
    >
      <i
        className="bi bi-chat-text fs-1 pointer text-black"
        onClick={() => {
          setOpenChat(!openChat);
          setVisible(true);
        }}
      ></i>
      {visible && (
        <div
          transition-style={
            openChat ? "in:square:top-left" : "out:square:bottom-right"
          }
          className="chat-box d-flex flex-column rounded-4 pb-4 px-2"
        >
          <div className="d-flex align-items-center chat-inner px-2 rounded-top-4 ">
            <i className="bi bi-person-circle fs-2"></i>
            <p className="m-0 ms-3">Rider</p>
            <i
              className="bi bi-x fs-3 ms-auto"
              onClick={() => setOpenChat(false)}
            ></i>
          </div>
          <div className="chat-container d-flex flex-column">
            <div className="chat-message rounded-4 w-75 d-flex align-items-center py-2 px-1 mt-2 ms-1 shadow-card">
              <p className={darkMode ? "m-0 text-black" : "m-0"}>
                Ciao, sono sotto casa!
              </p>
            </div>

            {messages.map((msg, index) => (
              <div
                key={index}
                className={`chat-user-message  rounded-4 w-50 py-2 px-1 mt-2 shadow-card  ${
                  index % 2 === 0 ? "ms-auto text-end" : "ms-1 ms-auto"
                }`}
              >
                <p className="m-0 me-2">{msg}</p>
              </div>
            ))}
            {replyMessage && (
              <div className="chat-message rounded-4 w-50 d-flex align-items-center  py-2 px-2 mt-2 ms-1 shadow-card">
                <p className={darkMode ? "m-0 text-black" : "m-0"}>Okay! 😀</p>
              </div>
            )}
            {messageSent && (
              <div className="mt-auto typing-container">
                <div class="typing-loader"></div>
              </div>
            )}
          </div>

          <div className="d-flex align-items-center py-2 ps-2 bg-white rounded-bottom-4 shadow-card">
            <Form
              className="d-flex"
              onSubmit={(e) => {
                sendMessage(e);
              }}
            >
              <Form.Control
                type="text"
                placeholder="Scrivi un messaggio"
                className="ms-1"
                value={message}
                onChange={(e) => {
                  setMessage(e.target.value);
                }}
              />
              <Button
                className="px-2 bg-white text-black border-0 py-0 send-btn"
                type="submit"
              >
                <i className="bi bi-send fs-3"></i>
              </Button>
            </Form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBubble;
