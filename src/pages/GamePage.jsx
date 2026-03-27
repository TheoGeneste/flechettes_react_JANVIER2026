import { useState } from "react";
import '../styles/gamePage.css'
import { toast } from "react-toastify";
import douleOutSuggestion from '../assets/doubleOutSuggestions.json';
import singleOutSuggestion from '../assets/singleOutSuggestions.json';

const GamePage = ({ players, setPlayers, typeOutOfGame, gameMode, setPage }) => {
    const [tour, setTour] = useState(1);
    const [currentPlayer, setCurrentPlayer] = useState(0);
    const [coef, setCoef] = useState(1);
    const [scoreTour, setScoreTour] = useState(0);

    const handleFlechette = (valeurDeFlechette) => {
        // Copie la valeur pour pouvoir modifier l'état
        let updatePlayers = [...players];

        // Je met à jour le score du jouers actuel
        updatePlayers[currentPlayer].score -= valeurDeFlechette * coef;
        setScoreTour(scoreTour + valeurDeFlechette * coef);
        // Je vérifie que mon joueur à déja un tableau d'historique pour ce tour si il n'en a pas 
        // je lui en créé un
        if (!updatePlayers[currentPlayer].histo[tour - 1]) {
            updatePlayers[currentPlayer].histo[tour - 1] = []
        }

        // J'ajoute le core fait par ma flechette à mon histo
        updatePlayers[currentPlayer].histo[tour - 1].push(valeurDeFlechette * coef);

        // Condiion de Victoire
        if ((typeOutOfGame == "Simple" && updatePlayers[currentPlayer].score == 0) ||
            (typeOutOfGame == "Double" && updatePlayers[currentPlayer].score == 0 && coef == 2)
        ) {
            toast.success("Félicitation, " + updatePlayers[currentPlayer].pseudo)
            setPage("EndGame")
            return;
        } else if ((typeOutOfGame == "Double" && updatePlayers[currentPlayer].score == 0 && coef != 2) ||
            (updatePlayers[currentPlayer].score < 0)) {
            updatePlayers[currentPlayer].score += scoreTour + valeurDeFlechette * coef;
            if (players[currentPlayer + 1]) {
                setCurrentPlayer(currentPlayer + 1)
            } else {
                setCurrentPlayer(0)
                setTour(tour + 1)
            }
            setScoreTour(0);
            toast.error("Vous n'avez pas respectez la condition de victoire")
        }

        // Je vérifie si c'est la troisième flechette de mon joueur si oui je change de joueur
        if (updatePlayers[currentPlayer].histo[tour - 1].length == 3) {
            // Je vérifie que le prochain joueur existe dans mon tableau player sinon 
            // je reviens au joueur 1 => index 0
            if (players[currentPlayer + 1]) {
                setCurrentPlayer(currentPlayer + 1)
            } else {
                setCurrentPlayer(0)
                setTour(tour + 1)
            }
            setScoreTour(0);
        }

        setPlayers(updatePlayers)
        setCoef(1);
    }

    const removeFlechette = () => {
        // Copie la valeur pour pouvoir modifier l'état
        let updatePlayers = [...players];
        let curPlayer = currentPlayer;
        let curTour = tour;
        // Je récupère le dernier tour de mon joueurs qui est un tablau avec mes 3 flechettes
        let dernierTour = updatePlayers[curPlayer].histo[curTour - 1];
        // console.log("UPDATEPLAYER => ", updatePlayers);
        // console.log("CURPLAYER => ", curPlayer);

        // console.log(dernierTour);
        if ((dernierTour == undefined || dernierTour.length == 0) && curTour == 1 && curPlayer == 0) {
            toast.error("Vous ne pouvez pas annulez de coup !")
            return;
        }

        // Si j'ai pas de flechette dans ce tour je renvien en arrière, joueur précédents
        if (dernierTour == undefined || dernierTour.length == 0) {
            if (curPlayer == 0) {
                curPlayer = players.length - 1;
                curTour = tour - 1;
            } else {
                curPlayer = currentPlayer - 1;
            }
        }

        // Recherche le bon tour qui correspond au bon joueur
        dernierTour = updatePlayers[curPlayer].histo[curTour - 1];

        // Je récupère la valeur de ma dernière flechete lance
        let derniereFlechetteLance = dernierTour[dernierTour.length - 1];

        // Je met a jour l'object player avec le nouvel historique qui prend tout les valeur de tout - la dernière
        updatePlayers[curPlayer].histo[curTour - 1] = dernierTour.slice(0, dernierTour.length - 1);

        if (updatePlayers[curPlayer].histo[curTour - 1].length == 0) {
            updatePlayers[curPlayer].histo = updatePlayers[curPlayer].histo.slice(0, updatePlayers[curPlayer].histo.length - 1)
        }
        // j'ajoute le score de ma flechette a mon score pour revenir en arrière
        updatePlayers[curPlayer].score += derniereFlechetteLance;


        // Je met à jour l'état players pour l'affichage
        setPlayers(updatePlayers)
        setTour(curTour)
        setCurrentPlayer(curPlayer)
    }

    function calculMoyenne(index) {

        if (players[index].histo.length > 0 && Array.isArray(players[index].histo)) {
            let total = 0;
            let numbreFlechette = 0;
            for (let i = 0; i < players[index].histo.length; i++) {
                const tours = players[index].histo[i];
                for (let j = 0; j < tours.length; j++) {
                    const element = tours[j];
                    total += element;
                    numbreFlechette++;
                }
            }
            return total / numbreFlechette;
        }
        return 0;
    }

    function showSuggestion(){
        if (typeOutOfGame == "Double") {
            if (douleOutSuggestion[players[currentPlayer].score] != undefined) {
                let flechetteRestante = 3 - (players[currentPlayer].histo[tour -1] ? players[currentPlayer].histo[tour -1].length : 0);
                if (flechetteRestante >= douleOutSuggestion[players[currentPlayer].score][0].dartsNeeded) {
                    return douleOutSuggestion[players[currentPlayer].score][0].suggestion;
                }
            }
        }else{
            if (singleOutSuggestion[players[currentPlayer].score] != undefined) {
                let flechetteRestante = 3 - (players[currentPlayer].histo[tour -1] ? players[currentPlayer].histo[tour -1].length : 0);
                if (flechetteRestante >= singleOutSuggestion[players[currentPlayer].score][0].dartsNeeded) {
                    return singleOutSuggestion[players[currentPlayer].score][0].suggestion;
                }
            }
        }
        return "Aucune suggestion";
    }
    

    return <>
        <div className="game-page">
            {/* Mode de jeu */}
            <h2>Mode {gameMode}</h2>
            {/* Type de sortie */}
            <h3>Sortie en {typeOutOfGame}</h3>
            {/* Encadré par joueur avec leur pseudo et leur score */}
            {players.map((player, index) => {
                return <div key={player.pseudo} className={currentPlayer == index ? "player-card active-player" : "player-card"} >
                    <h4>{player.pseudo}</h4>
                    {/* flechette du Dernier tour accomplie / AMÉLIORATTION*/}
                    <h5>Histo :{players[index].histo[players[index].histo.length - 1] && players[index].histo[players[index].histo.length - 1].join(',')}</h5>
                    {/* Moyenne du joueurs / AMÉLIORATION */}
                    {/* <h5>Avg : {players[index].histo[players[index].histo.length - 1] &&  
                        players[index].histo[players[index].histo.length - 1].reduce((acc, currentValue) => {return acc + currentValue}) / players[index].histo[players[index].histo.length - 1].length
                    }</h5> */}
                    <h5>Avg :{calculMoyenne(index)}</h5>
                    <p>{player.score}</p>
                </div>
            })}
            {/* Suggestion / AMÉLIORATION */}

                {showSuggestion()}

            {/* Numéro du tour */}
            <h3>Tour {tour}</h3>
            {/* Score du tour */}
            <h3>{scoreTour}</h3>
            <div className="score-section">
                {/* Score par flechette */}
                {players[currentPlayer].histo[tour - 1] && players[currentPlayer].histo[tour - 1].map((element, index) => {
                    return <li key={index}>{element}</li>
                })}
            </div>
            {/* Boutons pour faire le score */}
            <div className="score-buttons">
                <button onClick={() => handleFlechette(1)}>1</button>
                <button onClick={() => handleFlechette(2)}>2</button>
                <button onClick={() => handleFlechette(3)}>3</button>
                <button onClick={() => handleFlechette(4)}>4</button>
                <button onClick={() => handleFlechette(5)}>5</button>
                <button onClick={() => handleFlechette(6)}>6</button>
                <button onClick={() => handleFlechette(7)}>7</button>
                <button onClick={() => handleFlechette(8)}>8</button>
                <button onClick={() => handleFlechette(9)}>9</button>
                <button onClick={() => handleFlechette(10)}>10</button>
            </div>
            <div className="score-buttons">
                <button onClick={() => handleFlechette(11)}>11</button>
                <button onClick={() => handleFlechette(12)}>12</button>
                <button onClick={() => handleFlechette(13)}>13</button>
                <button onClick={() => handleFlechette(14)}>14</button>
                <button onClick={() => handleFlechette(15)}>15</button>
                <button onClick={() => handleFlechette(16)}>16</button>
                <button onClick={() => handleFlechette(17)}>17</button>
                <button onClick={() => handleFlechette(18)}>18</button>
                <button onClick={() => handleFlechette(19)}>19</button>
                <button onClick={() => handleFlechette(20)}>20</button>
            </div>
            {/* Bouton coeff / Miss / Annuler  */}
            <div className="special-buttons">
                <button onClick={() => handleFlechette(25)} disabled={coef == 3} className={coef == 3 ? "disabled" : ""}>25</button>
                <button className={coef == 1 ? "active" : ""} onClick={() => { setCoef(1) }}>Simple</button>
                <button className={coef == 2 ? "active" : ""} onClick={() => { setCoef(2) }}>Double</button>
                <button className={coef == 3 ? "active" : ""} onClick={() => { setCoef(3) }}>Triple</button>
                <button onClick={() => handleFlechette(0)}>Miss</button>
                <button onClick={removeFlechette}>Annuler</button>
            </div>

            {/* Histo du joueurs / AMÉLIORATION */}
            <div className="current-player-histo">
                {players[currentPlayer].histo.map((tours, index) => {
                    return <span key={index}>Tour {index + 1} =&gt; {tours.join(', ')}</span>
                })}
            </div>
        </div>
    </>;
}

export default GamePage;