## Clonacion del proyecto

Abre la carpeta donde desea clonar el proyecto y ejecuta este comando en un cmd

```bash
$ git clone https://github.com/estefany-123/formatrackFront.git
```
luego de clonarlo le aparecera una carpeta "formatrackFront" y dentro de ella encontrara la carpeta raiz "Front" abralas con un click o en la terminal con cd + tabulador

Cree las variables de entorno en la carpeta raiztomando de guia el .env.example para crear su propio .env

## Instalación de dependencias
Luego de esto pasamos a ejecutar este comando dentro de la carpeta raiz para que se descarguen todas las dependencias necesarias 

```bash
$ npm install --force
```
## Compile y corra el proyecto

Antes de iniciar el servidor asegurese de tener en ejecucion la RestAPI, es decir el Backend

```bash
$ npm run dev
```
