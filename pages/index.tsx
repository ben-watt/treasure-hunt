import Head from 'next/head'
import Image from 'next/image'
import { Button, Icon } from '@aws-amplify/ui-react'
import { useDrag } from 'react-dnd'
import { useState } from 'react'
import { GiSkullCrossedBones } from 'react-icons/gi';
import { API } from '@aws-amplify/api'
import mapPic from '../public/map.png'
import coinPic from '../public/coin.png'

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState([]);
  const [difficulty, setDifficulty] = useState("easy");
  const [rhyming, setRhyming] = useState(true);
  const [waypoints, setWaypoints] = useState<Waypoint[]>([])
  const [error, setError] = useState("");


  const addWaypoint = (content: string) => {
    if(waypoints.length >= 2) {
      setError("");
    }

    setWaypoints(prevState => prevState.concat({ index: prevState.length, description: content }));
  }

  const generate = async () => {
    if(waypoints.length < 3) {
      setError("You need to enter at least three clues to generate a treasure hunt")
      return;
    }

    setLoading(true)
    API.post("treasurehunt", "/generate", { body: waypoints })
      .then(res => {
        setLoading(false)
        setResult(res)
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
        <div className="absolute z-[-1] w-screen max-h-screen overflow-y-hidden">
            <Image src={mapPic} alt="map" className="!relative !h-auto w-screen" placeholder="blur"></Image>
            <Image src={coinPic} alt="coin" className="!relative !h-auto w-screen" placeholder="blur"></Image>
        </div>
      </div>
      <main className="flex flex-col justify-between content-center p-3 pt-1 sm:p-28 sm:max-w-4xl m-auto min-h-screen">
        <div>
          <section className="m-14">
            <h1 className="text-4xl md:text-6xl font-bold text-center text-stone-800">Create your own<br/>Treasure Hunt</h1>
            <p className="text-center p-5 italic text-yellow-900">You tell us the hiding places and we'll do the rest, your the hunters find the treasure chest.</p>
          </section>
          <section className="w-full">
            <div>
              <p><span className="font-bold">1. Describe where your clues are hidden</span></p>
              <p>&nbsp;&nbsp; e.g. Under the wooden kitchen table</p>
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
                          if(ev.key === "Enter") {
                            ev.preventDefault()
                            ev.stopPropagation()
                            let text = ev.currentTarget.textContent?.trim();
                            if(text != "" && text != null) {
                              addWaypoint(text!)
                              ev.currentTarget.textContent = ""
                            }
                          }
                        }}
                        placeholder="Enter waypoint...">
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            {/* <div className="mt-5">
              <p className="font-bold">2. Options</p>
              <div className="p-3">
                <p className="mb-2 ">Difficulty</p>
                <div className="flex space-x-10">
                  <Button className={`py-2 min-w-[5rem] bg-stone-800 text-orange-300 rounded hover:bg-stone-600 focus:outline-dotted focus:outline-red-800 ${difficulty === "easy" && "bg-red-900 hover:bg-red-900"}`} onClick={() => setDifficulty("easy")}>Easy</Button>
                  <Button className={`py-2 min-w-[5rem] bg-stone-800 text-orange-300 rounded hover:bg-stone-600 focus:outline-dotted focus:outline-red-800 ${difficulty === "medium" && "bg-red-900 hover:bg-red-900"}`} onClick={() => setDifficulty("medium")}>Medium</Button>
                  <Button className={`py-2 min-w-[5rem] bg-stone-800 text-orange-300 rounded hover:bg-stone-600 focus:outline-dotted focus:outline-red-800 ${difficulty === "hard" && "bg-red-900 hover:bg-red-900"}`} onClick={() => setDifficulty("hard")}>Hard</Button>
                </div>
              </div>
              <div className="p-3">
                <p className="mb-2">Rhyming</p>
                <div className="flex space-x-10">
                  <Button className={`py-2 min-w-[5rem] bg-stone-800 text-orange-300 rounded hover:bg-stone-600 focus:outline-dotted focus:outline-red-800 ${rhyming && "bg-red-900 hover:bg-red-900"}`} onClick={() => setRhyming(true)}>Yes</Button>
                  <Button className={`py-2 min-w-[5rem] bg-stone-800 text-orange-300 rounded hover:bg-stone-600 focus:outline-dotted focus:outline-red-800 ${!rhyming && "bg-red-900 hover:bg-red-900"}`} onClick={() => setRhyming(false)}>No</Button>
                </div>
              </div>
            </div> */}
          </section>
          <section className={error === "" ? "hidden" : ""}>
            <p className="text-red-900 text-center">
              <span className="font-bold">Error:</span> {error}
            </p>
          </section>
          <section className="flex justify-center mt-14">
            <GenerateButton isLoading={loading} onClick={generate} />
          </section>
          <section className="mt-10 text-orange-900">
            {result.map((clue, i) => <p key={i} className="p-2">{clue}</p>)}
          </section>
        </div>
      </main>
    </>
  )
}

const GenerateButton = ({ isLoading = false, onClick = () => {} }) => {
  if(!isLoading) {
    return (
      <Button 
      className="px-3 py-2 min-w-[10rem] bg-stone-800 text-orange-300 rounded hover:bg-stone-600 focus:outline-dotted focus:outline-red-800" 
      onClick={onClick}>Generate</Button>
    )
  } else {
    return (  
    <Button 
      className="px-3 py-2 min-w-[10rem] text-orange-300 rounded bg-stone-600 focus:outline-dotted focus:outline-red-800" 
      onClick={onClick}>
        <svg aria-hidden="true" className="m-auto w-8 h-6 text-gray-200 animate-spin dark:text-gray-600 fill-white" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
          <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
      </svg>
    </Button>)
  }
}

interface Waypoint {
  index: number,
  description: string
}