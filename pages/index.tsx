import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { Button, Icon } from '@aws-amplify/ui-react'
import { useDrag } from 'react-dnd'
import { useState } from 'react'
import { GiSkullCrossedBones } from 'react-icons/gi';
import { API } from '@aws-amplify/api'

export default function Home() {
  const [result, setResult] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [rhyming, setRhyming] = useState(true);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([
    { index: 1, description:  "Lounge chair in the dining room"},
    { index: 2, description:  "Blue pot in the greenhouse"},
    { index: 3, description:  "Behind the fireplace"}
  ])

  const generate = async () => {
    API.post("treasurehunt", "/generate", { body: waypoints.toString() })
      .then(res => {
        console.log(res)
      })
      .catch(rej => {
        console.error(rej)
      })
  }

  return (
    <>
      <Head>
        <title>Treasure Hunt</title>
        <meta name="description" content="AI powered app to create your very own treasure hunt." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div>
        <div className="absolute z-[-1] w-screen">
            <Image src="/map.png" alt="map" fill className="!relative !h-auto"></Image>
            <Image src="/coin.png" alt="coin" fill className="!relative !h-auto"></Image>
        </div>
      </div>
      <main className={styles.main}>
        <div>
          <section className="m-14">
            <h1 className="text-4xl md:text-6xl font-bold text-center text-stone-800">Create your own<br/>Treasure Hunt</h1>
          </section>
          <section className="w-full">
            <div>
              <p className="font-bold">1. Describe your waypoints</p>
              <div className="p-3">
                <ul>
                  {waypoints.map(waypoint =>
                    (
                    <li key={waypoint.index}>
                      <div className="flex justify-between content-center mb-1 px-3 py-2 min-w-[5rem] bg-stone-800 text-orange-300 rounded hover:bg-stone-600 cursor-grab">
                        <p>{waypoint.description}</p>
                        <div className="p-1 hover:text-red-800" id={waypoint.index.toString()} onClick={ev => {
                          setWaypoints(prevState => prevState.filter(x => x.index !== waypoint.index))}
                        }>
                          <GiSkullCrossedBones />
                        </div>
                      </div>
                    </li>
                  ))}
                  <li>
                    <div 
                        tabIndex={0} 
                        className="mb-1 px-3 py-2 w-full min-w-[5rem] bg-stone-600 text-orange-300 rounded hover:bg-stone-600 focus:outline-dotted focus:outline-red-800" 
                        contentEditable="true"
                        onKeyDown={ev => {
                          if(ev.key === "Enter" && ev.currentTarget.textContent != "") {
                            ev.preventDefault()
                            let content = ev.currentTarget.textContent!;
                            setWaypoints(prevState => prevState.concat({ index: prevState.length, description: content }))
                            ev.currentTarget.textContent = ""
                          }
                        }}
                        placeholder="Enter waypoint...">
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <div className="mt-5">
              <p className="font-bold">2. Options</p>
              <div className="p-3">
                <p className="mb-2 ">Difficulty</p>
                <div className="flex space-x-10">
                  <Button className={`px-3 py-2 min-w-[6rem] bg-stone-800 text-orange-300 rounded hover:bg-stone-600 focus:outline-dotted focus:outline-red-800 ${difficulty === "easy" && "bg-red-900 hover:bg-red-900"}`} onClick={() => setDifficulty("easy")}>Easy</Button>
                  <Button className={`px-3 py-2 min-w-[6rem] bg-stone-800 text-orange-300 rounded hover:bg-stone-600 focus:outline-dotted focus:outline-red-800 ${difficulty === "medium" && "bg-red-900 hover:bg-red-900"}`} onClick={() => setDifficulty("medium")}>Medium</Button>
                  <Button className={`px-3 py-2 min-w-[6rem] bg-stone-800 text-orange-300 rounded hover:bg-stone-600 focus:outline-dotted focus:outline-red-800 ${difficulty === "hard" && "bg-red-900 hover:bg-red-900"}`} onClick={() => setDifficulty("hard")}>Hard</Button>
                </div>
              </div>
              <div className="p-3">
                <p className="mb-2">Rhyming</p>
                <div className="flex space-x-10">
                  <Button className={`px-3 py-2 min-w-[6rem] bg-stone-800 text-orange-300 rounded hover:bg-stone-600 focus:outline-dotted focus:outline-red-800 ${rhyming && "bg-red-900 hover:bg-red-900"}`} onClick={() => setRhyming(true)}>Yes</Button>
                  <Button className={`px-3 py-2 min-w-[6rem] bg-stone-800 text-orange-300 rounded hover:bg-stone-600 focus:outline-dotted focus:outline-red-800 ${!rhyming && "bg-red-900 hover:bg-red-900"}`} onClick={() => setRhyming(false)}>No</Button>
                </div>
              </div>
            </div>
          </section>
          <section className="flex justify-center mt-14">
            <Button className="px-3 py-2 min-w-[10rem] bg-stone-800 text-orange-300 rounded hover:bg-stone-600 focus:outline-dotted focus:outline-red-800" onClick={generate}>Generate</Button>
          </section>
          <section className="mt-10 text-orange-900">{result}</section>
        </div>
      </main>
    </>
  )
}

interface Waypoint {
  index: number,
  description: string
}