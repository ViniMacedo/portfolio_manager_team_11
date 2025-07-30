import Tabs from './Tabs';

export default function Header({ tabs, active, onTab }) {
  return (
    <header className="bg-gradient-to-r from-purple-700 via-purple-800 to-purple-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <span className="text-2xl font-bold text-white">
          Financial Portfolio
        </span>
        <Tabs tabs={tabs} active={active} onTab={onTab} />
      </div>
    </header>
  )
}
