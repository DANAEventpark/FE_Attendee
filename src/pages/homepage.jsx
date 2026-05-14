import { useEffect, useState } from "react";
import { FaChevronLeft, FaChevronRight, FaFilter, FaSearch } from "react-icons/fa";

import EventCard from "../components/eventCard";
import Footer from "../components/footer";
import Hero from "../components/hero";
import Navbar from "../components/navbar";
import { getCategories } from "../services/categoryService";
import getEvents from "../services/eventService";

function getPageItems(currentPage, lastPage) {
  if (lastPage <= 5) {
    return Array.from({ length: lastPage }, (_, index) => index + 1);
  }

  const items = [1];
  const start = Math.max(2, currentPage - 1);
  const end = Math.min(lastPage - 1, currentPage + 1);

  if (start > 2) {
    items.push("start-ellipsis");
  }

  for (let page = start; page <= end; page += 1) {
    items.push(page);
  }

  if (end < lastPage - 1) {
    items.push("end-ellipsis");
  }

  items.push(lastPage);

  return items;
}

export function Homepage() {
  const [events, setEvents] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalEvents, setTotalEvents] = useState(0);

  useEffect(() => {
    let ignore = false;

    const loadCategories = async () => {
      try {
        const response = await getCategories();

        if (!ignore) {
          setCategories(Array.isArray(response) ? response : []);
        }
      } catch {
        if (!ignore) {
          setError("Không thể tải danh mục lúc này.");
        }
      } finally {
        if (!ignore) {
          setCategoriesLoading(false);
        }
      }
    };

    void loadCategories();

    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;

    const loadEvents = async () => {
      try {
        const response = await getEvents(currentPage);

        if (!ignore) {
          setEvents(Array.isArray(response.data) ? response.data : []);
          setCurrentPage(response.current_page || 1);
          setLastPage(response.last_page || 1);
          setTotalEvents(response.total || 0);
          setError("");
        }
      } catch {
        if (!ignore) {
          setEvents([]);
          setLastPage(1);
          setTotalEvents(0);
          setError("Không thể tải sự kiện. Vui lòng thử lại sau.");
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    void loadEvents();

    return () => {
      ignore = true;
    };
  }, [currentPage]);

  const registeredPreview = events.reduce(
    (total, event) => total + Number(event.confirmed_registrations_count || 0),
    0
  );

  const pageItems = getPageItems(currentPage, lastPage);

  const handlePageChange = (page) => {
    if (page < 1 || page > lastPage || page === currentPage) {
      return;
    }

    setLoading(true);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#f6e5cb] text-[#173846]">
      <Navbar />
      <Hero
        totalEvents={totalEvents}
        categoriesCount={categories.length}
        registeredPreview={registeredPreview}
      />

      <main className="-mt-14 pb-16">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <section className="rounded-[30px] bg-[#f6e5cb] p-3 shadow-[0_24px_70px_rgba(23,56,70,0.16)]">
            <div className="grid gap-3 lg:grid-cols-[1fr_auto]">
              <div className="flex flex-col gap-3 rounded-[24px] bg-white px-4 py-4 shadow-sm sm:flex-row sm:items-center">
                <div className="flex items-center gap-3">
                  <FaSearch className="text-[#b8b0a3]" />
                  <input
                    type="text"
                    readOnly
                    placeholder="Tìm kiếm sẽ bổ sung sau..."
                    className="w-full bg-transparent text-sm text-[#173846] outline-none placeholder:text-[#b8b0a3] sm:min-w-[280px]"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between rounded-[24px] bg-white px-4 py-4 text-sm text-[#7d766d] shadow-sm sm:justify-center sm:gap-3">
                <span className="inline-flex items-center gap-2 font-medium">
                  <FaFilter className="text-[#c5b9a8]" />
                  Lọc và sắp xếp
                </span>
                <span className="rounded-full bg-[#f7efe4] px-3 py-1 font-semibold text-[#173846]">
                  Coming soon
                </span>
              </div>
            </div>
          </section>

          <section className="mt-6">
            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                className="rounded-full bg-[#e96a52] px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-[#e96a52]/20"
              >
                Tất cả
              </button>

              {categoriesLoading &&
                Array.from({ length: 5 }, (_, index) => (
                  <div
                    key={`category-skeleton-${index + 1}`}
                    className="h-10 w-28 animate-pulse rounded-full bg-white/70"
                  />
                ))}

              {!categoriesLoading &&
                categories.map((category) => (
                  <span
                    key={category.id}
                    className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-[#173846] shadow-sm"
                  >
                    {category.name}
                  </span>
                ))}
            </div>
          </section>

          <section className="mt-10">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#e96a52]">
                  Event lineup
                </p>
                <h2 className="mt-3 text-3xl font-bold sm:text-4xl">
                  Các sự kiện đang diễn ra & sắp tới
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-6 text-[#5f6461] sm:text-base">
                  Hiển thị {events.length} trên tổng số {totalEvents} sự kiện.
                  Trang chủ hiện đang tập trung vào hiển thị dữ liệu thật từ
                  database bằng Tailwind.
                </p>
              </div>
            </div>

            {error && (
              <div className="mt-6 rounded-[24px] border border-[#f0c8bc] bg-[#fff6f4] px-5 py-4 text-sm text-[#a24734]">
                {error}
              </div>
            )}

            {loading ? (
              <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {Array.from({ length: 6 }, (_, index) => (
                  <article
                    key={`event-skeleton-${index + 1}`}
                    className="overflow-hidden rounded-[28px] bg-white shadow-sm"
                  >
                    <div className="h-44 animate-pulse bg-[#e7d5bc]" />
                    <div className="space-y-3 p-6">
                      <div className="h-5 w-24 animate-pulse rounded-full bg-[#f1e3d0]" />
                      <div className="h-6 w-3/4 animate-pulse rounded-xl bg-[#efe1cd]" />
                      <div className="h-4 w-full animate-pulse rounded-xl bg-[#f5eadc]" />
                      <div className="h-4 w-5/6 animate-pulse rounded-xl bg-[#f5eadc]" />
                      <div className="mt-5 h-11 animate-pulse rounded-2xl bg-[#e9d6be]" />
                    </div>
                  </article>
                ))}
              </div>
            ) : events.length > 0 ? (
              <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {events.map((event) => (
                  <EventCard key={event.id} event={event} />
                ))}
              </div>
            ) : (
              <div className="mt-8 rounded-[30px] bg-white px-6 py-12 text-center shadow-sm">
                <p className="text-lg font-semibold text-[#173846]">
                  Chưa có sự kiện để hiển thị.
                </p>
                <p className="mt-2 text-sm text-[#6d716f]">
                  Kiểm tra lại API backend hoặc dữ liệu trong database.
                </p>
              </div>
            )}
          </section>

          {!loading && lastPage > 1 && (
            <section className="mt-10 flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#173846] shadow-sm transition hover:text-[#e96a52] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FaChevronLeft />
              </button>

              {pageItems.map((item) =>
                typeof item === "number" ? (
                  <button
                    key={`page-${item}`}
                    type="button"
                    onClick={() => handlePageChange(item)}
                    className={`h-11 min-w-11 rounded-2xl px-4 text-sm font-semibold transition ${
                      item === currentPage
                        ? "bg-[#e96a52] text-white shadow-lg shadow-[#e96a52]/20"
                        : "bg-white text-[#173846] shadow-sm hover:text-[#e96a52]"
                    }`}
                  >
                    {item}
                  </button>
                ) : (
                  <span
                    key={item}
                    className="px-2 text-sm font-semibold text-[#8b8377]"
                  >
                    ...
                  </span>
                )
              )}

              <button
                type="button"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === lastPage}
                className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#173846] shadow-sm transition hover:text-[#e96a52] disabled:cursor-not-allowed disabled:opacity-40"
              >
                <FaChevronRight />
              </button>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
