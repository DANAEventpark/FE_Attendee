import Navbar from "../components/navbar";
import Hero from "../components/hero";
import SearchBar from "../components/searchbar";
import CategoriesList from "../components/categoriesList";
import EventCard from "../components/eventCard";
import Footer from "../components/footer";

const events = [
  {
    id: 1,
    category: "Âm nhạc",
    title: "Hòa nhạc cộng đồng mùa hè 2025",
    date: "Thứ bảy | 19:00",
    location: "Sơn Trà, Đà Nẵng",
    slots: 20,
    image:
      "https://images.unsplash.com/photo-1501386761578-eac5c94b800a",
  },
  {
    id: 2,
    category: "Workshop",
    title: "Workshop AI dành cho sinh viên",
    date: "Chủ nhật | 08:00",
    location: "FPT University",
    slots: 50,
    image:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3",
  },
  {
    id: 3,
    category: "Thể thao",
    title: "Giải chạy bộ cộng đồng",
    date: "Thứ hai | 05:00",
    location: "Biển Mỹ Khê",
    slots: 100,
    image:
      "https://images.unsplash.com/photo-1483721310020-03333e577078",
  },
  {
    id: 4,
    category: "Ẩm thực",
    title: "Food Festival Đà Nẵng",
    date: "Thứ sáu | 18:00",
    location: "Cầu Rồng",
    slots: 35,
    image:
      "https://images.unsplash.com/photo-1498837167922-ddd27525d352",
  },
  {
    id: 5,
    category: "Nghệ thuật",
    title: "Triển lãm tranh hiện đại",
    date: "Thứ ba | 09:00",
    location: "Bảo tàng Đà Nẵng",
    slots: 15,
    image:
      "https://images.unsplash.com/photo-1460661419201-fd4cecdf8a8b",
  },
  {
    id: 6,
    category: "Giáo dục",
    title: "English Speaking Day",
    date: "Thứ tư | 14:00",
    location: "Youth Center",
    slots: 25,
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f",
  },
];

export default function Homepage() {
  return (
    <div className="bg-[#F6E7D8] min-h-screen">
      <Navbar />

      <Hero />

      <SearchBar />

      <CategoriesList />

      <section className="px-6 md:px-16 py-10">
        <h2 className="text-3xl font-bold text-center text-[#14313F] mb-10">
          Các sự kiện đang diễn ra & sắp tới
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>

        <div className="flex justify-center gap-3 mt-12">
          <button className="w-10 h-10 rounded-lg bg-[#E85D4E] text-white">
            1
          </button>

          <button className="w-10 h-10 rounded-lg bg-white">
            2
          </button>

          <button className="w-10 h-10 rounded-lg bg-white">
            3
          </button>
        </div>
      </section>

      <Footer />
    </div>
  );
}