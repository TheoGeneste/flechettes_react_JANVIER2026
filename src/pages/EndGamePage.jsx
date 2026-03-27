import "../styles/endGamePage.css"

const EndGamePage = ({ players, setPlayers, gameMode, setPage, typeOutOfGame }) => {

    const sortingPlayer = players.sort((a, b) => a.score - b.score)

    const handleRestart = () => {
        setPlayers(players.map(player => {
            return {pseudo : player.pseudo, score : gameMode, histo : []}
        }))
        setPage("Game")
    }

    const handleNewGame = () => {
        setPlayers([]);
        setPage("Config");
    }

    return <div className="end-game-page">
        <h2>Mode {gameMode} - Sortie {typeOutOfGame}</h2>
        {sortingPlayer.map((player, index) => {
            return <div key={index} className="player-ranking">
                <h5>Position : {index + 1}</h5>
                <h5>{player.pseudo} - {player.score}</h5>
            </div>
        })}
        <div className="end-game-buttons">
            <button className="btn-restart" onClick={handleRestart}>Recommencer</button>
            <button className="btn-new-game" onClick={handleNewGame}>Nouvelle partie</button>
        </div>
    </div>;
}

export default EndGamePage;