import { useEffect, useRef } from "react";

const AtmList = ({
    label = 'List',
    items = [],
    emptyMsg = 'No items found',
    maxHeight = "300px",
    textColor = "text-gray-200"
}) => {
    const logsEndRef = useRef(null);

    useEffect(() => {
        if (logsEndRef.current) {
            logsEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [items]);

    return (
        <div className={`bg-transparent w-full`}>
            <h3 className="text-lg font-semibold mb-2 text-white">{label}</h3>
            <div
                className={`overflow-y-auto ${textColor} text-sm font-mono`}
                style={{ maxHeight }}
            >
                {items.length === 0 ? (
                    <p className="text-gray-500 italic">{emptyMsg}</p>
                ) : (
                    <ul className="space-y-1">
                        {items.map((message, index) => (
                            <li key={index} className="border-b border-gray-800 pb-1 last:border-b-0">
                                {message}
                            </li>
                        ))}
                        <div ref={logsEndRef} />
                    </ul>
                )}
            </div>
        </div>
    )
}

export default AtmList