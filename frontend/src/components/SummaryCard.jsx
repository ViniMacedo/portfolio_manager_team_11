export default function SummaryCard({ title, value }) {
  return (
    <dl className="p-4 bg-gradient-to-br from-purple-50 to-white rounded-lg shadow">
      <dt className="text-sm font-medium text-gray-600">{title}</dt>
      <dd className="mt-1 text-2xl font-semibold text-purple-800">{value}</dd>
    </dl>
  )
}
