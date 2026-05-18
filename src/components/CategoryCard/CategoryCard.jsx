import { Link } from 'react-router-dom';

const CategoryCard = (props) => {
    const getIcon = (name) => {
        switch (name) {
            case 'Music':
            case 'Âm nhạc': return '🎸';
            case 'Sports':
            case 'Thể thao': return '⚽';
            case 'Food':
            case 'Ẩm thực': return '🍜';
            case 'Art':
            case 'Nghệ thuật': return '🎨';
            case 'Education':
            case 'Giáo dục': return '📚';
            case 'Community':
            case 'Cộng đồng': return '👥';
            default: return '📁';
        }
    };

    return (
        <Link to={`/categories/${props.id}/events`} className="block no-underline group">
            <div className="bg-white border border-[#e2e8f0] rounded-2xl p-6 text-center shadow-xs transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md cursor-pointer">
                
                <div className="w-16 h-16 bg-[#2d3e50]/10 rounded-full flex items-center justify-center mx-auto mb-4 transition-colors duration-300 group-hover:bg-[#2d3e50]/20">
                    <span className="text-3xl">{getIcon(props.name)}</span>
                </div>
                
                <h4 className="text-[#2d3e50] text-lg font-bold mb-1 transition-colors group-hover:text-[#1a2633]">
                    {props.name}
                </h4>
                
                <p className="text-gray-500 text-sm">
                    {props.count || 0} sự kiện
                </p>
                
            </div>
        </Link>
    );
};

export default CategoryCard;