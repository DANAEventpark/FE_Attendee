const fallbackCategories = [
  { id: 1, name: 'Music' },
  { id: 2, name: 'Sports' },
  { id: 3, name: 'Food' },
  { id: 4, name: 'Art' },
  { id: 5, name: 'Education' },
  { id: 6, name: 'Community' },
]

export default function CategoriesList({
  categories = [],
  activeCategoryId = 'all',
  onSelectCategory,
}) {
  const list = categories.length > 0 ? categories : fallbackCategories

  return (
    <div className="mt-8 flex flex-wrap justify-center gap-4 px-6 md:px-16">
      <button
        type="button"
        onClick={() => onSelectCategory?.('all')}
        className={`rounded-full px-8 py-2.5 font-medium shadow-md transition-all duration-300 ${
          activeCategoryId === 'all'
            ? 'bg-[#E85D4E] text-white shadow-orange-200'
            : 'border border-blue-100 bg-white text-gray-600 hover:border-[#E85D4E] hover:text-[#E85D4E]'
        }`}
      >
        Tat ca
      </button>

      {list.map((item) => (
        <button
          key={item.id}
          type="button"
          onClick={() => onSelectCategory?.(item.id)}
          className={`rounded-full px-8 py-2.5 transition-all duration-300 ${
            activeCategoryId === item.id
              ? 'bg-[#173846] text-white shadow-md shadow-slate-300'
              : 'border border-blue-100 bg-white text-gray-600 hover:border-[#E85D4E] hover:text-[#E85D4E]'
          }`}
        >
          {item.name}
        </button>
      ))}
    </div>
  )
}
