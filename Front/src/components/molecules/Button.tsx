import { Button } from "@heroui/button";


type propsBut = {
    text?: string,
    type? :"button" | "submit" | "reset" | undefined,
    isLoading? : boolean,
    form?:string,
    className?: string,
    color? : "default" | "primary" | "secondary" | "success" | "warning" | "danger" | undefined,
    variant? : "solid" | "bordered" | "light" | "flat" | "faded" | "shadow" | "ghost" | undefined
    onPress?: () => void
}


export default function Buton({text,type="button",className="text-white bg-blue-700",color,variant="solid",onPress, isLoading, form}:propsBut){
    return(
        <Button form={form} isLoading={isLoading} onPress={onPress} className={className} type={type} color={color} variant={variant}>
            {text}
        </Button>
    )
}



