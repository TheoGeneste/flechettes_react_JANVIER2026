import { useEffect, useState } from "react";
import "../styles/config.css"
import { toast } from "react-toastify";

const Config = ({ players, setPlayers,gameMode, setGameMode, typeOutOfGame, setTypeOutOfGame,setPage }) => {
    const [numberPlayer, setNumberPlayer] = useState(2);
    const gameModes = ["301", "501", "701"];
    const [errors, setErrors] = useState({})


    const handleChange = (e, postionPlayer) => {
        let updatePlayers = [...players];
        updatePlayers[postionPlayer] = { pseudo: e.target.value, score: gameMode, histo: [] };
        setPlayers(updatePlayers);
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let newErrors = {}
        // Vérifier que le nombre de joueurs est au minimum 2
        if (numberPlayer < 2) {
            newErrors.numberPlayer = "Le nombre de joueur minimum est de 2 !";
        }

        // Vérifier que tout mes players ont un pseuso 
        const allPlayerHavePseudo = players.every(
            player => player != undefined && player.pseudo.trim() !== ""
        )

        if (allPlayerHavePseudo == false) {
            newErrors.players = "Tous les joueurs doivent avoir un pseudo !";
        }

        // Vérifier que le gameMode correspond à un element du tableau gameModes
        if (!gameModes.includes(gameMode)) {
            newErrors.gameMode = "Le mode de jeu selectionné n'existe pas !";

        }

        // Vérifier que le typeOutOfGame correspond à Simple ou Double
        if (typeOutOfGame != "Simple" && typeOutOfGame != "Double") {
            newErrors.typeOutOfGame = "Le mode de sortie selectionné n'existe pas !";
            
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            console.log("On a des erreurs", newErrors);
            toast.error("Vérifier le formulaire")
            return;
        }else{
            setPage("Game")
        }
        console.log(players, gameMode, typeOutOfGame);
    }

    useEffect(()=> {
        let newPlayers = [...players]; 
        setPlayers(newPlayers.slice(0,numberPlayer))
    }, [numberPlayer])

    useEffect(() => {
        let newPlayers = players.map((player) => {
            return { pseudo: player.pseudo , score: gameMode, histo: player.histo }
        }); 
        setPlayers(newPlayers);
        
    }, [gameMode])


    return <>
        <form onSubmit={handleSubmit}>
            <label htmlFor="numberPlayer">Nombre de joueurs</label>
            <input id="numberPlayer" type="number" min={0} value={numberPlayer} 
            onChange={(e) => {
                if (e.target.value >=2) {
                    setNumberPlayer(e.target.value);
                }
                // let newPlayers = [...players]; 
                // setPlayers(newPlayers.slice(0, e.target.value))
            }} required />
            {Array.from({ length: numberPlayer }).map((_, index) => {
                return <div key={index}>
                    <label htmlFor={`player${index+1}`}>Player {index + 1 }</label>
                    <input type="text" name="pseudo" id={`player${index+1}`} onChange={(e) => handleChange(e, index)} required aria-required/>
                </div>
            })}
            <label htmlFor="gameMode">Mode de jeu</label>
            <select name="gameMode" id="gameMode" value={gameMode} onChange={(e) => {setGameMode(e.target.value)}}>
                {gameModes.map((mode) => {
                    return <option key={mode} value={mode}>{mode}</option>
                })}
            </select>
            <label htmlFor="typeOutOfGame">Type de sortie</label>
            <select name="typeOutOfGame" id="typeOutOfGame" value={typeOutOfGame} onChange={(e) => {setTypeOutOfGame(e.target.value)}}>
                <option value="Simple">Simple</option>
                <option value="Double">Double</option>
            </select>
            <input type="submit" value={"Commencer"} />
        </form>
    </>;
}

export default Config;