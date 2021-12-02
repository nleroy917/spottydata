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
      <div className="p-2 my-2 bg-white border-2 border-black rounded-lg shadow-xl">
        <div className="flex flex-row items-center">
          <div className="mb-2 text-3xl font-extrabold md:text-3xl lg:text-4xl xl:text-5xl">{title}</div>
          <div className="cursor-pointer"><ToolTip content={tooltip}/></div>
        </div>
        <div className="h-96">
            {children}
        </div>
      </div>
  )
}
export default ChartCard