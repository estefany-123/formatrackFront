import React from 'react'
import Tap from "@/components/molecules/Tabs";
import UsersTable from './usuarios';
import Bodega from './Bodega';
import Home from './Home';

const Admin =() => {

        const tabs = [
            {
                key : "1",
                title : "Usuarios",
                content : <UsersTable/>
            },
            {
                key : "2",
                title : "Centros",
                content : "centros aquis"
            },
            {
                key : "3",
                title : "Areas",
                content : "Areas aquis"
            },
            {
                key : "4",
                title : "Programas de formacion",
                content : <Home/>
            }
        ]

  return (
        
        <Tap tabs={tabs}></Tap>
  )
}

export default Admin