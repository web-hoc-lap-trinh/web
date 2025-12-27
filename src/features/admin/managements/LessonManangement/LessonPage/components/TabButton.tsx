interface TabButtonProps {
    active: boolean;
    onClick: () => void;
    label: string;
}

const TabButton = ({active, onClick, label}: TabButtonProps) => {
    return(
        <button
            onClick={onClick}
            className={`flex items-center gap-2 py-4 px-4 text-xs font-bold uppercase tracking-widest border-b-2 transition-all ${
                active ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-gray-500 hover:text-gray-300'
            }`}
        >
            {label}
        </button>
    )
}

export default TabButton