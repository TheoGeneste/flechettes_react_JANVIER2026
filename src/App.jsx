import { useState } from "react"
import Config from "./pages/Config";
import { ToastContainer } from "react-toastify";
import GamePage from "./pages/GamePage";


function App() {
  const [players, setPlayers] = useState([]);
  // [{ "pseudo": "J1", score: "501", histo: [
  //  [20, 60, 0],
  //  [0, 0, 0],
  // ] },
  // { "pseudo": "J2", score: "501", histo: [] },
  // { "pseudo": "J3", score: "501", histo: [] },
  // { "pseudo": "J4", score: "501", histo: [] }]

  const [gameMode, setGameMode] = useState("301");
  const [typeOutOfGame, setTypeOutOfGame] = useState("Double");
  const [page, setPage] = useState("Config");

  return (
    <>
      {page == "Config" && <Config players={players} setPlayers={setPlayers} gameMode={gameMode} setGameMode={setGameMode}
        typeOutOfGame={typeOutOfGame} setTypeOutOfGame={setTypeOutOfGame} setPage={setPage} />}
      {page == "Game" && <GamePage gameMode={gameMode}
        players={players} setPlayers={setPlayers} setPage={setPage} typeOutOfGame={typeOutOfGame} />}
        {page == "EndGame" && <h1>Fin de partie</h1>}
      <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
      />
    </>
  )
}

export default App
