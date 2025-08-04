export default function Tabs({ tabs, active, onTab }) {
  return (
    <nav className="flex space-x-4">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => onTab(tab.id)}
          disabled={!tab.enabled}
          className={`
            px-4 py-2 text-sm font-medium rounded-md
            ${active === tab.id 
              ? 'bg-white text-purple-800'
              : tab.enabled
                ? 'text-white hover:bg-purple-600'
                : 'text-purple-200 cursor-not-allowed'} 
            transition
          `}
        >
          {tab.label}
        </button>
      ))}
    </nav>
  )
}
