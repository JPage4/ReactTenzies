import React from "react"
import Die from "./components/Die"
import { nanoid } from 'nanoid'
import Confetti from "react-confetti"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [heldNumber, setHeldNumber] = React.useState()
    const [rollCount, setRollCount] = React.useState(0)
    const [bestRollCount, setBestRollCount] = React.useState(
        JSON.parse(localStorage.getItem("bestRollCount")) || 1000000)
    const [newHighScore, setNewHighScore] = React.useState(false)

    React.useEffect(() => {
        var isGameWon = false
        var heldCount = 0
        for (let i = 0; i < dice.length; i++) {
            if(dice[i].isHeld){
                heldCount++
                setHeldNumber(dice[i].value)
            }
        }

        if(heldCount == 10){
            isGameWon = true

            if(rollCount < bestRollCount){
                setBestRollCount(rollCount)
                localStorage.setItem("bestRollCount", JSON.stringify(rollCount))
                setNewHighScore(true)
            }
        }
        setTenzies(isGameWon)
    }, [dice])

    function generateNewDie() {
        return {
            value: Math.ceil(Math.random() * 6),
            isHeld: false,
            id: nanoid()
        }
    }
    
    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(generateNewDie())
        }
        return newDice
    }
    
    function rollDice() {
        if(tenzies){
            setTenzies(false)
            setDice(allNewDice())
            setRollCount(0)
            setNewHighScore(false)
        }
        else{
            setDice(oldDice => oldDice.map(die => {
                return die.isHeld ? 
                    die :
                    generateNewDie()
            }))
            setRollCount(oldRollCount => oldRollCount + 1)
        }
    }

    function holdDice(id){
        if(dice.filter(die => die.isHeld) == 0){
            setDice(oldDice => oldDice.map(die => {
                return die.id === id ?
                {...die, isHeld: !die.isHeld} :
                die
            }))
        }
        else{
            setDice(oldDice => oldDice.map(die => {
                return die.id === id && die.value === heldNumber ?
                {...die, isHeld: !die.isHeld} :
                die
            }))
        }
    }
    
    const diceElements = dice.map(die => (
        <Die 
            key={die.id} 
            id={die.id} 
            value={die.value} 
            isHeld={die.isHeld} 
            handleClick={holdDice}
        />
    ))
    
    return (
        <main>
            {tenzies && <Confetti/>}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. 
            Click each die to freeze it at its current value between rolls.</p>
            <div className="dice-container">
                {diceElements}
            </div>
            <h3>{newHighScore ? "Whooooo new high score!!!": `${rollCount} Rolls`}</h3>
            <button className="roll-dice" id="roll-button" onClick={rollDice}>{tenzies === true ? "New Game" : "Roll!"}</button>
        </main>
    )
}