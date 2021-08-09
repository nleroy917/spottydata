import Tippy from '@tippyjs/react';
const ToolTip = ({content}) => {
    const Info = () => {
        return (
            <div className="p-2 bg-white border border-black rounded-md text-sm text-gray-700 italic">
                {content}
            </div>
        )
    }
    return (
      <Tippy 
        content={<Info />} 
        className="cursor-pointer"
        placement="bottom"
    >
        <span className="text-base text-black mx-2">&#9432;</span>
      </Tippy>
    )
}
export default ToolTip