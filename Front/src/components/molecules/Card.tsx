import React from 'react'
import { Card , CardBody } from "@heroui/react";


type Props = {
    children : React.ReactNode
}

function Card1({children}: Props) {
  return (
    <Card className='border-collapse flex w-2/4'>
        <CardBody>
            {children}
        </CardBody>
    </Card>
  )
}

export default Card1