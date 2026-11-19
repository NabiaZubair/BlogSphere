import React from 'react'
import { Cpu,HouseHeart ,Handshake,CodeXml} from 'lucide-react'

const Categories = () => {
  return (
    <div>
      <h2 className="font-semibold text-3xl  mb-14  ">Explore by Categories</h2>
      <div className="flex  justify-between ">
        <div className=" rounded-lg bg-purple-100 flex flex-col items-center justify-center gap-2 p-2 h-30 w-60 text-gray-800">
            <div className="text-purple-600"><CodeXml size={32} /></div>
            Programing
        </div>
        <div  className=" rounded-lg bg-purple-100 flex flex-col items-center justify-center gap-2 p-2 h-30 w-60 text-gray-800">
          <div className="text-purple-600"><HouseHeart size={32} /></div>
            LifeStyle
        </div>
        <div  className=" rounded-lg bg-purple-100 flex flex-col items-center justify-center gap-2 p-2 h-30 w-60 text-gray-800">
              <div className="text-purple-600"><Cpu size={32}/></div>
            Technology
        </div>
        <div  className=" rounded-lg bg-purple-100 flex flex-col items-center justify-center gap-2 p-2 h-30 w-60 text-gray-800">
            <div className="text-purple-600"><Handshake size={32}/></div>
            Business
        </div>
      </div>
    </div>
  )
}

export default Categories
