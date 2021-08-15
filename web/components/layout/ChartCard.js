import ToolTip from "../tooltip"
const ChartCard = ({children, title, size, tooltip}) => {
    if(size === "sm") {
            return(
                <div className="bg-white border-2 border-black p-2 w-full my-2 md:w-1/3 rounded-lg shadow-xl md:mr-2">
                  <p className="font-extrabold text-3xl md:text-5xl mb-2">{title}<span className="cursor-pointer"><ToolTip content={tooltip}/></span></p>
                  <div className="h-80">
                      {children}
                  </div>
                </div>
            )
    } else if(size === "md") {
            return(
                <div className="bg-white border-2 border-black p-2 w-full my-2 md:w-5/12 rounded-lg shadow-xl md:mr-2">
                    <p className="font-extrabold text-3xl md:text-5xl mb-2">{title}<span className="cursor-pointer"><ToolTip content={tooltip}/></span></p>
                    <div className="h-80">
                        {children}
                    </div>
                </div>
            )
    } else {
            return(
                <div className="bg-white border-2 border-black p-2 w-full my-2 rounded-lg shadow-xl md:mr-2">
                    <p className="font-extrabold text-3xl md:text-5xl mb-2">{title}<span className="cursor-pointer"><ToolTip content={tooltip}/></span></p>
                    <div className="h-80">
                        {children}
                    </div>
                </div>
            )
    }
}
export default ChartCard