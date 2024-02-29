import "./App.css";
import { useEffect, useMemo, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";

function App() {
  const initialState = {
    email: "",
    time: "",
  };
  const [data, setData] = useState(initialState);
  const [show, setShow] = useState(false);
  const socket = useMemo(() => io("http://localhost:8000"), []);
  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected");
      // setSocketId(socket.id);
    });
    socket.on("mail-sent", (data) => {
      if(data){
        setShow(true);
      }
    });
    // socket.on("welcome", (data) => {
    //   console.log(data);
    // });

    // return () => {
    //   socket.disconnect();
    // };
  }, []);
  const sendEmail = async () => {
    console.log("Data", data);
    try {
      const res = await axios.post("http://localhost:8000/send-mail", data);
      console.log(res.data);
    } catch (error) {}
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setData({ ...data, [name]: value });
  };
  return (
    <>
    <div className="App">
      <h1>Send Mail POC</h1>
      <input
        type="email"
        placeholder="Enter your email"
        value={data.email}
        name="email"
        onChange={(e) => handleChange(e)}
      />
      <input
        type="datetime-local"
        placeholder="time"
        name="time"
        value={data.time}
        onChange={(e) => handleChange(e)}
      />
      <button onClick={sendEmail}>Send Mail</button>
    </div>
    {show && <div>
      <h1>Happy birthday 🎂🎂🎂!!!!</h1>
    </div>}
    </>
  );
}

export default App;
