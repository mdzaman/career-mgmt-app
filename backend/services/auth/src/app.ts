import express, { Application } from 'express'

class App {
    public app: Application
    public port: number

    constructor(appInit: { port: number; middleWares: any; routes:any}) {
        this.app = express()
        this.port = appInit.port

        this.middlewares(appInit.middleWares)
        this.routes(appInit.routes)
    }

    private middlewares(middleWares: { forEach: (arg0: (middleWare: any) => void) => void; }) {
        middleWares.forEach(middleWare => {
            this.app.use(middleWare)
        })
    }

    private routes(routes: { forEach: (arg0: (router: any) => void) => void; }) {
        routes.forEach(router => {
            this.app.use(router.path, router.router)
        })
    }

    public listen() {
        this.app.listen(this.port, () => {
            console.log(`App listening on the ${this.port}`)
        })
    }
}

export default App