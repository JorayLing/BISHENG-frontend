
import { TipIcon } from "@/components/bs-icons/tip"
import i18next from "i18next"
import { X } from "lucide-react"
import { useRef, useState } from "react"
import { createRoot } from "react-dom/client"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "."
import './index.less'
import robot from './images/robot.png'
import closeIcon from './images/close.png'

interface ConfirmParams {
    title?: string
    desc: string | React.ReactNode
    canelTxt?: string
    okTxt?: string
    showClose?: boolean
    onClose?: () => void
    onCancel?: () => void
    onOk?: (next) => void
}

let openFn = (_: ConfirmParams) => { }

function ConfirmWrapper() {

    const [open, setOpen] = useState(false)
    const paramRef = useRef(null)

    openFn = (params: ConfirmParams) => {
        paramRef.current = params
        setOpen(true)
    }

    const close = () => {
        paramRef.current?.onClose?.()
        setOpen(false)
    }

    const handleCancelClick = () => {
        paramRef.current?.onCancel?.()
        close()
    }

    const handleOkClick = () => {
        paramRef.current?.onOk
            ? paramRef.current?.onOk?.(close)
            : close()
    }

    if (!paramRef.current) return null
    const { title, desc, okTxt, canelTxt, showClose = true } = paramRef.current

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogContent className="max-w-[458px] p-0 bg-transparent border-0">
                <div className="alert-dialog">
                    <img className="robot" src={robot} alt=""/>
                    {showClose && <img onClick={close} className="close" src={closeIcon} alt=""/>}
                    <div className="alert-dialog-content">
                        <p className="alert-dialog-desc">
                            {
                                desc.split('').map((item) => {
                                    return <span className={item === '删' || item === '除'? "text-red-500":''}>{item}</span>
                                })
                            }
                        </p>
                        <div className="alert-dialog-footer">
                            <div onClick={handleCancelClick} className="alert-dialog-cancel">{canelTxt}</div>
                            <div onClick={handleOkClick} className="alert-dialog-ok">{okTxt}</div>
                        </div>
                    </div>
                </div>
                {/*<AlertDialogHeader className="relative">*/}
                {/*    <div><TipIcon /></div>*/}
                {/*    {showClose && <X onClick={close} className="absolute right-0 top-[-0.5rem] cursor-pointer text-gray-400 hover:text-gray-600"></X>}*/}
                {/*    <AlertDialogTitle>{title}</AlertDialogTitle>*/}
                {/*    <AlertDialogDescription className="text-popover-foreground">*/}
                {/*        {desc}*/}
                {/*    </AlertDialogDescription>*/}
                {/*</AlertDialogHeader>*/}
                {/*<AlertDialogFooter>*/}
                {/*    <AlertDialogCancel onClick={handleCancelClick} className="px-11">{canelTxt}</AlertDialogCancel>*/}
                {/*    <AlertDialogAction onClick={handleOkClick} className="px-11">{okTxt}</AlertDialogAction>*/}
                {/*</AlertDialogFooter>*/}
            </AlertDialogContent>
        </AlertDialog>
    )
}

let confirmRoot: ReturnType<typeof createRoot> | null = null;

(function () {
    // 挂载组件
    let el = document.getElementById('confirm-wrap');
    if (!el) {
        el = document.createElement('div');
        el.id = 'confirm-wrap';
        document.body.append(el);
    }
    // 统一使用 createRoot (React 18+)
    if (!confirmRoot) {
        confirmRoot = createRoot(el);
    }
    confirmRoot.render(<ConfirmWrapper />);
})();


const bsConfirm = (params: ConfirmParams) => {
    const resource = i18next.getResourceBundle(i18next.language, 'bs')

    openFn({
        title: resource.prompt,
        canelTxt: resource.cancel,
        okTxt: resource.confirmButton,
        ...params,
    })
}
export { bsConfirm }
