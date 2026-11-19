import React from 'react'
import { ArrowRight } from "lucide-react"
import Categories from '../components/Categories'
import LatestPosts from '../components/LatestPost'

const Home = () => {
  return (
    <>
      <section >
        <div className="flex flex-col items-center justify-center min-h-screen h-80  w-full mx-auto px-6  text-center">
          <p className="mb-4 font-medium text-purple-600 rounded-full bg-purple-100 px-3 py-1">
            STORIES THAT INSPIRE
          </p>

          <h1 className="text-4xl font-bold text-gray-900 sm:text-6xl">
            Every story deserves
            <span className="block text-purple-600 ">
              to be shared.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-600">
            Discover ideas, share your experiences, and connect
            with people through the power of writing.
          </p>
          <div className="flex gap-4">


            <button className="flex gap-2 items-center  text-white bg-purple-600 rounded-lg px-4 py-2 mt-8 font-semibold">Explore Articals</button>
            <button className="flex gap-2 items-center  text-gray-600 border border-gray-300 rounded-lg px-4 py-2 mt-8 font-semibold">Start Writing <ArrowRight size={20} /></button>

          </div>
        </div>
      </section>
      <section>
        <Categories />
      </section>

      
      <LatestPosts />

    </>

  )
}

export default Home
