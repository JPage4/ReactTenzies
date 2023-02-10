import React from "react"
import Die from "./components/Die"

export default function App() {

    const [dice, setDice] = React.useState(allNewDice())

    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            newDice.push(Math.ceil(Math.random() * 6))
        }
        return newDice
    }

    function handleClick(){
        setDice(allNewDice())
    }
     
    const diceElements = dice.map(die => <Die value={die} />)

    return (
        <main>
            <div className="dice-container">
                {diceElements}
            </div>
            <button className="roll-dice" onClick={handleClick}>Roll!</button>
        </main>
    )
}