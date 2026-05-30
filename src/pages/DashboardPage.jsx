import { useState, useEffect, useDeferredValue } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ChevronRight, Search, SlidersHorizontal, Calendar, CheckCircle2, Clock4, XCircle, ChevronLeft, ChevronRight as ChevronRightIcon, Inbox } from 'lucide-react'

import useAuthStore from '@/store/authStore'
import {
  getDashboardStats,
  getRegistrations,
  getWaitlist,
  getCancelledRegistrations,
} from '@/services/registrationService'
import { getCategories } from '@/services/categoryService'

import RegistrationCard from '@/components/dashboard/RegistrationCard'
import EventDetailModal from '@/components/dashboard/EventDetailModal'

/**
 * DashboardPage — REQ_11
 * Trang dashboard lịch sử đăng ký sự kiện của Attendee.
 * Gồm 3 tab: Đã đăng ký | Waitlist | Đã huỷ
 * Mỗi tab có: tìm kiếm, lọc danh mục/năm, phân trang, chi tiết modal.
 */

const TABS = [
  { key: 'registered', label: 'Sự kiện đã đăng ký', statKey: 'registered' },
  { key: 'waitlist',   label: 'Waitlist',             statKey: 'waitlist'   },
  { key: 'cancelled',  label: 'Đã huỷ',               statKey: 'cancelled'  },
]

// Danh sách năm cho dropdown filter (từ 2023 đến năm hiện tại + 2)
const CURRENT_YEAR = new Date().getFullYear()
const YEAR_OPTIONS = Array.from({ length: CURRENT_YEAR - 2022 }, (_, i) => CURRENT_YEAR - i)

export default function DashboardPage() {
  const { t } = useTranslation()
  const user     = useAuthStore((s) => s.user)
  const navigate = useNavigate()

  // ── State: tab hiện tại ──────────────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('registered')

  // ── State: thống kê ─────────────────────────────────────────────────────
  const [stats, setStats] = useState({ registered: 0, waitlist: 0, cancelled: 0 })
  const [statsLoading, setStatsLoading] = useState(true)

  // ── State: bộ lọc ────────────────────────────────────────────────────────
  const [searchTerm, setSearchTerm]   = useState('')
  const [categoryId, setCategoryId]   = useState('all')
  const [year, setYear]               = useState('all')
  const [categories, setCategories]   = useState([])
  const deferredSearch = useDeferredValue(searchTerm)

  // ── State: danh sách registrations ────────────────────────────────────────
  const [registrations, setRegistrations] = useState([])
  const [loading, setLoading]             = useState(true)
  const [error, setError]                 = useState('')
  const [page, setPage]                   = useState(1)
  const [pagination, setPagination]       = useState({ currentPage: 1, lastPage: 1, total: 0 })

  // ── State: modal chi tiết ──────────────────────────────────────────────────
  const [selectedRegistration, setSelectedRegistration] = useState(null)
  const [isModalOpen, setIsModalOpen]                   = useState(false)

  // ── Guard: chưa đăng nhập → redirect ───────────────────────────────────
  useEffect(() => {
    if (!user) navigate('/login', { replace: true })
  }, [user, navigate])

  // ── Tải danh mục ──────────────────────────────────────────────────────────
  useEffect(() => {
    getCategories()
      .then((res) => setCategories(res.data || res || []))
      .catch(() => {})
  }, [])

  // ── Tải thống kê ──────────────────────────────────────────────────────────
  useEffect(() => {
    setStatsLoading(true)
    getDashboardStats()
      .then((res) => {
        if (res.success) setStats(res.data)
      })
      .catch(() => {})
      .finally(() => setStatsLoading(false))
  }, [])

  // ── Reset trang khi bộ lọc / tab thay đổi ─────────────────────────────────
  useEffect(() => {
    setPage(1)
  }, [activeTab, deferredSearch, categoryId, year])

  // ── Tải danh sách registrations theo tab ──────────────────────────────────
  useEffect(() => {
    if (!user) return
    let cancelled = false
    setLoading(true)
    setError('')

    const params = { page, search: deferredSearch.trim(), category_id: categoryId, year }

    const fetcher =
      activeTab === 'registered' ? getRegistrations :
      activeTab === 'waitlist'   ? getWaitlist      :
                                   getCancelledRegistrations

    fetcher(params)
      .then((res) => {
        if (cancelled) return
        setRegistrations(res.data || [])
        setPagination({
          currentPage: res.current_page || 1,
          lastPage:    res.last_page    || 1,
          total:       res.total        || 0,
        })
      })
      .catch((err) => {
        if (cancelled) return
        setRegistrations([])
        setError(err.response?.data?.message ?? 'Không thể tải danh sách lúc này.')
      })
      .finally(() => { if (!cancelled) setLoading(false) })

    return () => { cancelled = true }
  }, [activeTab, page, deferredSearch, categoryId, year, user])

  // ── Handlers ──────────────────────────────────────────────────────────────
  const openModal = (reg) => { setSelectedRegistration(reg); setIsModalOpen(true) }
  const closeModal = () => { setIsModalOpen(false); setSelectedRegistration(null) }

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.lastPage) return
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // ── Stat cards config ──────────────────────────────────────────────────────
  const STAT_CARDS = [
    {
      label:   t('attendee_dashboard.tab_registered_count', 'Đã tham dự'),
      value:   stats.registered,
      icon:    <CheckCircle2 size={20} />,
      color:   'text-[#e96a52]',
      iconBg:  'bg-[#e96a52]/10 text-[#e96a52]',
    },
    {
      label:   t('attendee_dashboard.tab_waitlist_count', 'Đang chờ'),
      value:   stats.waitlist,
      icon:    <Clock4 size={20} />,
      color:   'text-amber-500',
      iconBg:  'bg-amber-50 text-amber-500',
    },
    {
      label:   t('attendee_dashboard.tab_cancelled_count', 'Đã huỷ'),
      value:   stats.cancelled,
      icon:    <XCircle size={20} />,
      color:   'text-slate-400',
      iconBg:  'bg-slate-100 text-slate-400',
    },
  ]

  if (!user) return null

  return (
    <div className="min-h-screen bg-[#FDF6E2]">

      {/* ── Hero / Header Section ─────────────────────────────────────────── */}
      <section className="bg-[#1F3846] pt-10 pb-16 px-4">
        <div className="max-w-5xl mx-auto">

          {/* Star Badge / Pill */}
          <div className="flex items-center gap-2 mb-6">
            <span
              className="inline-flex items-center gap-1.5 rounded-full bg-[#C0442B] px-4 py-1.5 text-xs font-semibold text-white shadow-sm"
            >
              <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M12 .587l3.668 7.431 8.2 1.192-5.934 5.786 1.4 8.168L12 18.896l-7.334 3.857 1.4-8.168L.132 9.21l8.2-1.192z"/>
              </svg>
              {t('attendee_dashboard.history_badge', 'Lịch sử sự kiện của tôi')}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">{t('navbar.dashboard', 'Dashboard')}</h1>
          <p className="text-white/60 text-sm sm:text-base max-w-lg">
            {t('attendee_dashboard.description', 'Quản lý các sự kiện bạn đã đăng ký, danh sách chờ và lịch sử huỷ.')}
          </p>

          {/* Stat Dividers */}
          <div className="mt-8 flex items-center gap-8 sm:gap-12 flex-wrap text-left select-none">
            {STAT_CARDS.map((card, idx) => (
              <div key={card.label} className="flex items-center gap-8 sm:gap-12">
                <div>
                  <div className="flex items-baseline gap-1.5">
                    <span className="text-3xl sm:text-4xl font-extrabold text-white">
                      {statsLoading ? '—' : String(card.value).padStart(2, '0')}
                    </span>
                    <span className="text-xs font-bold text-[#C0442B]">{t('attendee_dashboard.events_unit', 'sự kiện')}</span>
                  </div>
                  <p className="text-xs text-white/50 mt-1 font-semibold">{card.label}</p>
                </div>
                {idx < STAT_CARDS.length - 1 && (
                  <div className="h-8 w-px bg-white/20" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Main Content ──────────────────────────────────────────────────── */}
      <main className="max-w-5xl mx-auto px-4 -mt-6 pb-20">

        {/* ── Filter Row ─────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder={t('attendee_dashboard.search_placeholder', 'Tìm kiếm sự kiện...')}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white py-2.5 pl-10 pr-4 text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#C0442B]/20 focus:border-[#C0442B]/40 transition shadow-sm"
            />
          </div>

          {/* Category filter */}
          <select
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#C0442B]/20 focus:border-[#C0442B]/40 transition cursor-pointer shadow-sm"
          >
            <option value="all">{t('attendee_dashboard.all_categories', 'Tất cả danh mục')}</option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>{t('category.' + cat.name, cat.name)}</option>
            ))}
          </select>

          {/* Year filter */}
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 focus:outline-none focus:ring-2 focus:ring-[#C0442B]/20 focus:border-[#C0442B]/40 transition cursor-pointer shadow-sm"
          >
            <option value="all">{t('attendee_dashboard.all_years', 'Tất cả năm')}</option>
            {YEAR_OPTIONS.map((y) => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        {/* ── Tab Navigation ──────────────────────────────────────────────── */}
        <div className="flex gap-1 bg-white rounded-xl border border-slate-200 p-1.5 shadow-sm mb-6 overflow-x-auto">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key
            const count    = stats[tab.statKey] || 0
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`flex-1 min-w-max flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-bold transition-all duration-200 whitespace-nowrap ${
                  isActive
                    ? 'bg-[#1F3846] text-white shadow-sm'
                    : 'text-slate-600 hover:text-slate-800 hover:bg-slate-50'
                }`}
              >
                {t('attendee_dashboard.tab_' + tab.key, tab.label)}
                <span className={`inline-flex items-center justify-center h-5 min-w-[20px] rounded-full px-1.5 text-[11px] font-bold ${
                  isActive ? 'bg-white text-[#1F3846]' : 'bg-slate-100 text-slate-500'
                }`}>
                  {count}
                </span>
              </button>
            )
          })}
        </div>

        {/* ── Registration List ────────────────────────────────────────────── */}
        {loading ? (
          /* Skeleton loading */
          <div className="space-y-3">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex gap-4 bg-white rounded-2xl border border-slate-100 p-4 animate-pulse">
                <div className="w-28 h-28 rounded-xl bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-3 py-1">
                  <div className="h-3 bg-slate-200 rounded-full w-20" />
                  <div className="h-5 bg-slate-200 rounded-full w-3/4" />
                  <div className="h-3 bg-slate-200 rounded-full w-1/2" />
                  <div className="h-3 bg-slate-200 rounded-full w-2/3" />
                  <div className="h-8 bg-slate-200 rounded-xl w-28 mt-4" />
                </div>
              </div>
            ))}
          </div>
        ) : error ? (
          /* Lỗi */
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50 mb-4">
              <XCircle size={28} className="text-red-400" />
            </div>
            <p className="text-slate-600 font-medium">{error}</p>
            <button
              onClick={() => setPage(1)}
              className="mt-4 rounded-xl bg-[#e96a52] px-5 py-2 text-sm font-semibold text-white hover:bg-[#d75c46] transition-colors"
            >
              {t('attendee_dashboard.try_again', 'Thử lại')}
            </button>
          </div>
        ) : registrations.length === 0 ? (
          /* Trống */
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#e96a52]/10 mb-5">
              <Inbox size={32} className="text-[#e96a52]" />
            </div>
            <p className="text-lg font-bold text-slate-700 mb-1">{t('attendee_dashboard.empty_title', 'Chưa có sự kiện nào')}</p>
            <p className="text-sm text-slate-500 max-w-xs">
              {activeTab === 'registered' && t('attendee_dashboard.empty_registered_desc', 'Bạn chưa đăng ký sự kiện nào. Khám phá các sự kiện hấp dẫn ngay!')}
              {activeTab === 'waitlist'   && t('attendee_dashboard.empty_waitlist_desc', 'Bạn không có sự kiện nào trong danh sách chờ.')}
              {activeTab === 'cancelled'  && t('attendee_dashboard.empty_cancelled_desc', 'Bạn chưa huỷ đăng ký sự kiện nào.')}
            </p>
            {activeTab === 'registered' && (
              <Link
                to="/"
                className="mt-5 inline-block rounded-xl bg-[#e96a52] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#d75c46] transition-colors"
              >
                {t('attendee_dashboard.explore_btn', 'Khám phá sự kiện')}
              </Link>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {registrations.map((reg) => (
              <RegistrationCard
                key={reg.id}
                registration={reg}
                tab={activeTab}
                onViewDetail={openModal}
              />
            ))}
          </div>
        )}

        {/* ── Pagination ──────────────────────────────────────────────────── */}
        {!loading && !error && pagination.lastPage > 1 && (
          <div className="mt-8 flex items-center justify-center gap-2">
            {/* Prev */}
            <button
              onClick={() => handlePageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-slate-300 transition-colors"
            >
              <ChevronLeft size={15} />
            </button>

            {/* Page numbers */}
            {Array.from({ length: pagination.lastPage }, (_, i) => i + 1)
              .filter((p) => p === 1 || p === pagination.lastPage || Math.abs(p - pagination.currentPage) <= 1)
              .reduce((acc, p, idx, arr) => {
                if (idx > 0 && arr[idx - 1] !== p - 1) acc.push('...')
                acc.push(p)
                return acc
              }, [])
              .map((item, idx) =>
                item === '...' ? (
                  <span key={`ellipsis-${idx}`} className="px-1 text-slate-400 text-sm select-none">...</span>
                ) : (
                  <button
                    key={item}
                    onClick={() => handlePageChange(item)}
                    className={`h-9 w-9 rounded-lg text-sm font-bold transition-all duration-200 ${
                      item === pagination.currentPage
                        ? 'bg-[#C0442B] text-white shadow-md shadow-red-500/20'
                        : 'border border-slate-200 bg-white text-slate-600 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    {item}
                  </button>
                )
              )}

            {/* Next */}
            <button
              onClick={() => handlePageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.lastPage}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50 hover:border-slate-300 transition-colors"
            >
              <ChevronRightIcon size={15} />
            </button>
          </div>
        )}
      </main>

      {/* ── Event Detail Modal ────────────────────────────────────────────── */}
      <EventDetailModal
        registration={selectedRegistration}
        isOpen={isModalOpen}
        onClose={closeModal}
        tab={activeTab}
      />
    </div>
  )
}
