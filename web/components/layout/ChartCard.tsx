import { FC } from "react"
import { ReactNode } from "react"
import ToolTip from "../tooltip"

interface Props {
  title: string,
  tooltip?: string
}

const ChartCard: FC<Props> = (props) => {
  const { children, title, tooltip } = props
  return(
      <div className="bg-white border-2 border-black p-2 my-2 rounded-lg shadow-xl">
        <p className="font-extrabold text-3xl md:text-5xl mb-2">{title}<span className="cursor-pointer"><ToolTip content={tooltip}/></span></p>
        <div className="h-80 md:h-96">
            {children}
        </div>
      </div>
  )
}
export default ChartCard