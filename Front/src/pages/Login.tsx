import useLogin from "@/hooks/Usuarios/useLogin"
import { Card, CardBody, Input, Button, Spinner } from "@heroui/react"
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { LoginSchema } from "@/schemas/User";

type Props = {}

function Login({ }: Props) {

  const { login, isError, error, isLoading } = useLogin();
  const {register, handleSubmit, formState : { errors }} = useForm({
    resolver :  zodResolver(LoginSchema),
    mode:"onChange"
  });

  return (
    <div className="flex ">
      <div className='w-1/2 bg-blue-400 h-9/10 h-dvh flex justify-content-center'>
        <img src="src\assets\Formatrack.png" alt="Formatrack" className="w-full h-4/5 mt-16 " />
      </div>

      <div className="w-1/2 flex items-center">

        <Card className="shadow-lg shadow-blue-500/50 w-1/2 mx-auto">
          <CardBody className="">
            <form onSubmit={handleSubmit(login)} className="space-y-4">
              <h1 className="text-2xl text-center text-blue-500 ">INICIO DE SESION</h1>

              <Input label="Numero de documento" placeholder="Documento" type="text" autoComplete='off'  {...register("documento")} isInvalid={!!errors.documento}
                errorMessage={errors.documento?.message} />
              
              <Input {...register("password")} label="Contraseña" placeholder="Password" type="password" autoComplete='off' isInvalid={!!errors.password}
                errorMessage={errors.password?.message} />
              
              {isError && <p className="text-red-500 text-center">{error}</p>}
              {isLoading && <Spinner className="flex justify-center" />}

              <p className="text-end text-blue-400"><a href="/forgotPass">¿Has olvidado tu contraseña?</a></p>
              <div className="flex">
                <Button color="primary" type="submit" className="text-white px-8 mx-auto">Ingresar</Button>
              </div>
            </form>
          </CardBody>
        </Card>
      </div>
    </div>
  )
}

export default Login