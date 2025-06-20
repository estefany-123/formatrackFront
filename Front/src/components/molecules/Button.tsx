import { Button } from "@heroui/button";


type propsBut = {
    children : React.ReactNode
    type? :"button" | "submit" | "reset" | undefined,
    className?: string,
    color? : "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined,
    variant? : "solid" | "bordered" | "light" | "flat" | "faded" | "shadow" | "ghost" | undefined
    onPress?: () => void
}


export default function Buton({children,type="button",className,color,variant="solid",onPress}:propsBut){
    return(
        <Button onPress={onPress} className={`text-white bg-blue-700 ${className}`} type={type} color={color} variant={variant}>
            {children}
        </Button>
    )
}



