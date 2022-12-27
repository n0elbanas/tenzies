import React from 'react'
import { nanoid } from 'nanoid'
import Die from './Die'
import './App.css'
import Confetti from 'react-confetti'

export default function App() {
    const [dice, setDice] = React.useState(allNewDice())
    const [tenzies, setTenzies] = React.useState(false)
    const [rolls, setRolls] = React.useState(0)
    /**
     * 
     *  Helper function
     *  Repeated code
     */
    function generateNewDie() {
        return {
          value: Math.ceil(Math.random() * 6),
          isHeld: false,
          id: nanoid(),
      }
    }

    function allNewDice() {
        const newDice = []
        for (let i = 0; i < 10; i++) {
            // instead of Math.floor (starts from 0)
            // use Math.ceil (stars from 1)
            newDice.push(generateNewDie())
        }
        return newDice
    }

    function holdDice(id) {
        setDice(oldDice => oldDice.map(die => {
            return die.id === id ? 
              {...die, isHeld: !die.isHeld} : 
              die
        }))
    }

    function rollDice() {
        if (!tenzies) {
          setRolls(prevRolls => prevRolls + 1)

          setDice(oldDice => oldDice.map(die => {
              return die.isHeld ? 
                die :
                generateNewDie()
          }))
        } else {
            setTenzies(false)
            setDice(allNewDice())
            setRolls(0)
        }
    }

    const diceElements = dice.map((die) => (
        <Die 
            key={die.id} 
            value={die.value} 
            isHeld={die.isHeld}
            holdDice={() => holdDice(die.id)}
        />
    ))

    React.useEffect(() => {
        const allHeld = dice.every(die => die.isHeld)
        const firstValue = dice[0].value
        const allSameValue = dice.every(die => die.value === firstValue)
        if (allHeld && allSameValue) {
            setTenzies(true)
        }
    }, [dice])

    return (
        <main>
            {tenzies && <Confetti />}
            <h1 className="title">Tenzies</h1>
            <p className="instructions">Roll until all dice are the same. <br />Click each die to freeze it at its current value between rolls.</p>
            <div className='dice-container'>
                {diceElements}
            </div>
            <button className='roll-dice' onClick={rollDice}>
                {tenzies ? 'New Game' : 'Roll Dice'}
            </button>
            {tenzies && <h3>Congratulations! You won!</h3>}
            <h4>Number of dice rolls: {rolls}</h4>
        </main>
    )
}
