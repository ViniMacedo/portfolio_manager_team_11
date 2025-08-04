export default function PortfolioTable({ rows }) {
  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {['Ticker','Quantity','Price','Value'].map(h => (
              <th
                key={h}
                className="px-6 py-3 text-xs font-medium text-gray-500 uppercase text-left"
              >
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {rows.map(r => (
            <tr key={r.ticker} className="hover:bg-gray-50 transition">
              <td className="px-6 py-4 text-sm text-gray-900">{r.ticker}</td>
              <td className="px-6 py-4 text-sm text-gray-900 text-right">{r.quantity}</td>
              <td className="px-6 py-4 text-sm text-gray-900 text-right">${r.price.toFixed(2)}</td>
              <td className="px-6 py-4 text-sm text-gray-900 text-right">
                ${(r.quantity * r.price).toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
