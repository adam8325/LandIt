import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Header from "./Components/Header"
import Stepper from "./Components/Stepper"

function App() {


  return (
    <div className='p-2 w-screen flex flex-col items-center gap-4'>
      <div className='w-3/5 h-full border border-stone-200 bg-stone-50 rounded-sm p-2'>
      <Header/>
      <Stepper/>

      <section className='flex justify-between mt-4'>
        <button className='p-2 rounded-lg border-stone-100 text-xs cursor-pointer font-semibold'>Forrige</button>
        <button className="p-2 cursor-pointer text-xs font-semibold rounded-lg border border-stone-100 text-white bg-gradient-to-r from-blue-400 via-blue-500 to-violet-400">
  Næste trin
</button>


      </section>        
      </div>
      

    </div>
  )
}

export default App
