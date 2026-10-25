import { Service, signal } from '@angular/core';

@Service()
export class ErrorService {
    public showErrorMsg = signal(false)
    public msg = signal('')

    public clearMsg(){
        setTimeout(()=>{
            this.showErrorMsg.set(false)
            this.msg.set('')
        }, 3000)
    }
    public setErrorMsg(msg: string){
        this.showErrorMsg.set(true)
        this.msg.set(msg)
    }
}
