import { useTranslation } from 'react-i18next'

export default function EventEmpty() {
  const { t } = useTranslation()

  return (
    <div className="rounded-[28px] border border-dashed border-slate-300 bg-white px-8 py-16 text-center shadow-sm">

      <h3 className="text-2xl font-semibold text-slate-900">
        {t('event.empty_title')}
      </h3>

      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-slate-600 sm:text-base">
        {t('event.empty_desc')}
      </p>

    </div>
  )
}