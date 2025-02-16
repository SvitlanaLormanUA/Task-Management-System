import { _getData } from "../handlers/getDataHandler"
export default function Header() {
    return <>
    <button onClick={_getData}>Click</button>
    </>
}