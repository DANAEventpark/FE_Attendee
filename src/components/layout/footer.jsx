import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  // Retrieve translation array for links, fallback to default Vietnamese array if not found
  const links = t("footer.links", { returnObjects: true }) || [];
  const defaultLinks = ["Khám phá", "Dành cho nhà tổ chức", "Về chúng tôi", "Trung tâm trợ giúp"];
  const displayLinks = Array.isArray(links) ? links : defaultLinks;

  return (
    <footer className="bg-[#1A3138] text-white py-20 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#E76241] mb-6">EventSpark</h2>
        <p className="text-gray-400 max-w-xl mx-auto mb-10 leading-relaxed">
          {t("footer.description", "Nền tảng tổ chức và quản lý sự kiện hàng đầu. Kết nối đam mê và tạo ra những khoảng khắc đáng nhớ.")}
        </p>
        
        <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 mb-12 font-medium text-sm">
          {displayLinks.map((item, idx) => (
            <a key={idx} href="#" className="hover:text-[#E76241] transition-colors">{item}</a>
          ))}
        </div>
        
        <div className="w-full h-[1px] bg-gray-700/50 mb-8" />
        
        <p className="text-xs text-gray-500 uppercase tracking-widest">
          {t("footer.rights", "@ EventSpark 2026. All right reserved.")}
        </p>
      </div>
    </footer>
  );
};

export default Footer;