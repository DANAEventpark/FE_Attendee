import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '@/services/api';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authStore';
import { AlertCircle, AlertTriangle, CheckCircle2, Minus, Plus, X } from 'lucide-react';
import artImg from '@/assets/art.jpg';
import communityImg from '@/assets/community.jpg';
import educationImg from '@/assets/education.jpg';
import foodImg from '@/assets/food.jpg';
import musicImg from '@/assets/music.jpg';
import sportsImg from '@/assets/sports.jpg';

const MAX_REVIEW_LENGTH = 300;
const MAX_GROUP_SEATS = 100;

const getCategoryImage = (imageName) => {
    switch (imageName) {
        case 'art.jpg': return artImg;
        case 'community.jpg': return communityImg;
        case 'education.jpg': return educationImg;
        case 'food.jpg': return foodImg;
        case 'music.jpg': return musicImg;
        case 'sports.jpg': return sportsImg;
        default: return musicImg;
    }
};

const getCategoryColor = (categoryName) => {
    if (categoryName === 'Music' || categoryName === 'Âm nhạc') return 'bg-[#F05A4A] text-white';
    return 'bg-[#BCE2CD] text-slate-800';
};

const getInitials = (name) => {
    if (!name) return 'U';
    const parts = name.split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    return name.substring(0, 2).toUpperCase();
};

const getAvatarUrl = (avatarPath) => {
    if (!avatarPath) return null;
    if (avatarPath.startsWith('http')) return avatarPath;
    const baseUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:8000';
    return `${baseUrl}/storage/${avatarPath}`;
};

const avatarColors = ['#fca5a5', '#60a5fa', '#c084fc', '#fcd34d'];

const EventDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { t, i18n } = useTranslation();
    const { user, token } = useAuthStore();

    const [event, setEvent] = useState(null);
    const [userRegistration, setUserRegistration] = useState(null);
    const [loading, setLoading] = useState(true);
    const [notFound, setNotFound] = useState(false);
    const [comment, setComment] = useState('');
    const [rating, setRating] = useState(0);
    const [registering, setRegistering] = useState(false);
    const [submittingReview, setSubmittingReview] = useState(false);
    const [error, setError] = useState(null);
    const [currentTime, setCurrentTime] = useState(() => Date.now());

    // Registration dialog state (UC-15: individual vs organization)
    const [showRegModal, setShowRegModal] = useState(false);
    const [regType, setRegType] = useState('individual');
    const [organizationName, setOrganizationName] = useState('');
    const [seatQuantity, setSeatQuantity] = useState(1);
    const [regFormError, setRegFormError] = useState('');

    const fetchEvent = useCallback(async () => {
        try {
            const response = await api.get(`/events/${id}`);
            setEvent(response.data.data);
            setUserRegistration(response.data.user_registration || null);
            setCurrentTime(Date.now());
            setNotFound(false);
            setError(null);
        } catch (err) {
            console.error('Error fetching event details', err);
            if (err.response?.status === 404) {
                setNotFound(true);
                setError(null);
            } else {
                setError(err.response?.data?.message || t('event_detail.error_loading', 'Không thể tải dữ liệu sự kiện.'));
            }
        } finally {
            setLoading(false);
        }
    }, [id, t]);

    useEffect(() => {
        setLoading(true);
        setNotFound(false);
        setError(null);
        fetchEvent();
    }, [fetchEvent]);

    // Real-time comments (Polling)
    useEffect(() => {
        if (!event || !event.id || notFound) return;

        const intervalId = setInterval(() => {
            fetchEvent();
        }, 3000);

        return () => clearInterval(intervalId);
    }, [event, notFound, fetchEvent]);

    const openRegisterDialog = () => {
        if (!token) {
            alert(t('event_detail.login_required_alert', 'Vui lòng đăng nhập để đăng ký tham gia!'));
            return;
        }
        setRegType('individual');
        setOrganizationName('');
        setSeatQuantity(1);
        setRegFormError('');
        setShowRegModal(true);
    };

    const handleConfirmRegister = async (e) => {
        e.preventDefault();
        setRegFormError('');

        if (regType === 'organization') {
            if (!organizationName.trim()) {
                setRegFormError(t('event_detail.org_name_required', 'Vui lòng nhập tên tổ chức.'));
                return;
            }
            if (seatQuantity < 1 || seatQuantity > MAX_GROUP_SEATS) {
                setRegFormError(t('event_detail.quantity_invalid', 'Số lượng chỗ đăng ký phải từ 1 đến 100.'));
                return;
            }
        }

        setRegistering(true);
        try {
            const payload =
                regType === 'organization'
                    ? {
                        registration_type: 'organization',
                        organization_name: organizationName.trim(),
                        quantity: seatQuantity,
                    }
                    : {
                        registration_type: 'individual',
                        quantity: 1,
                    };

            const response = await api.post(`/events/${id}/register`, payload);
            setShowRegModal(false);
            alert(response.data.message || t('event_detail.success_alert', 'Đăng ký thành công!'));
            await fetchEvent();
        } catch (err) {
            const apiErrors = err.response?.data?.errors;
            const firstFieldError = apiErrors ? Object.values(apiErrors).flat()[0] : null;
            setRegFormError(firstFieldError || err.response?.data?.message || t('event_detail.general_error_alert', 'Đã có lỗi xảy ra'));
        } finally {
            setRegistering(false);
        }
    };

    const handleCancel = async () => {
        if (!window.confirm(t('event_detail.cancel_confirm', 'Bạn có chắc chắn muốn hủy đăng ký sự kiện này không?'))) {
            return;
        }
        setRegistering(true);
        try {
            if (!token) {
                alert(t('event_detail.login_required_alert', 'Vui lòng đăng nhập để thao tác!'));
                setRegistering(false);
                return;
            }
            const response = await api.post(`/events/${id}/cancel`, {});
            alert(response.data.message || t('event_detail.cancel_success', 'Hủy đăng ký thành công!'));
            await fetchEvent();
        } catch (err) {
            alert(err.response?.data?.message || t('event_detail.general_error_alert', 'Đã có lỗi xảy ra'));
        } finally {
            setRegistering(false);
        }
    };

    const handleSubmitReview = async () => {
        if (rating === 0) {
            alert(t('event_detail.rating_empty_alert', 'Vui lòng chọn số sao đánh giá!'));
            return;
        }

        if (comment.length > MAX_REVIEW_LENGTH) {
            alert(t('event_detail.comment_too_long_alert', 'Nội dung nhận xét không được vượt quá 300 ký tự!'));
            return;
        }

        setSubmittingReview(true);
        try {
            if (!token) {
                alert(t('event_detail.comment_login_required', 'Vui lòng đăng nhập để bình luận!'));
                setSubmittingReview(false);
                return;
            }

            const trimmedComment = comment.trim();
            await api.post(`/events/${id}/reviews`, {
                rating,
                comment: trimmedComment || null,
            });

            alert(t('event_detail.comment_success_alert', 'Gửi đánh giá thành công!'));
            setComment('');
            setRating(0);
            await fetchEvent();
        } catch (err) {
            const apiErrors = err.response?.data?.errors;
            const firstFieldError = apiErrors ? Object.values(apiErrors).flat()[0] : null;
            alert(firstFieldError || err.response?.data?.message || t('event_detail.general_error_alert', 'Đã có lỗi xảy ra'));
        } finally {
            setSubmittingReview(false);
        }
    };

    if (loading) {
        return <div className="min-h-screen flex items-center justify-center bg-[#fdfaf2]">{t('event_detail.loading', 'Loading...')}</div>;
    }

    if (notFound || (!event && !error)) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[75vh] bg-[#EBEFEA] text-slate-800 px-4 py-16">
                <AlertCircle className="w-20 h-20 text-[#e96a52] mb-5" />
                <h1 className="text-5xl font-bold mb-3 text-slate-900">404</h1>
                <h2 className="text-2xl font-semibold mb-2 text-center">
                    {t('event_detail.not_found_friendly', 'Sự kiện không tồn tại hoặc đã bị xóa')}
                </h2>
                <p className="text-slate-600 text-center max-w-md mb-8 text-sm">
                    {t('event_detail.not_found_desc', 'Đường dẫn bạn truy cập không hợp lệ hoặc sự kiện đã bị gỡ bỏ khỏi hệ thống.')}
                </p>
                <Link
                    to="/"
                    className="px-6 py-3 bg-[#e96a52] hover:bg-[#d75c46] text-white font-semibold rounded-xl transition-all shadow-md"
                >
                    {t('event_detail.back_home', 'Quay lại trang chủ')}
                </Link>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-[75vh] flex flex-col items-center justify-center bg-[#EBEFEA] px-4 py-16">
                <p className="text-red-600 font-medium mb-4">{error}</p>
                <Link to="/" className="px-5 py-2.5 bg-[#e96a52] text-white rounded-xl font-medium">
                    {t('event_detail.back_home', 'Quay lại trang chủ')}
                </Link>
            </div>
        );
    }

    const bannerImg = event.category ? getCategoryImage(event.category.image) : musicImg;
    const catName = event.category ? event.category.name : 'Sự kiện';

    const startDate = new Date(typeof event.start_time === 'string' ? event.start_time.replace(/-/g, '/') : event.start_time);
    const endDate = event.end_time ? new Date(typeof event.end_time === 'string' ? event.end_time.replace(/-/g, '/') : event.end_time) : null;
    const deadlineDate = event.registration_deadline ? new Date(typeof event.registration_deadline === 'string' ? event.registration_deadline.replace(/-/g, '/') : event.registration_deadline) : null;

    const formatDate = (date) => {
        if (!date || Number.isNaN(date.getTime())) return 'N/A';
        if (i18n.language === 'en') {
            return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
        }
        return `${date.getDate()} tháng ${date.getMonth() + 1}, ${date.getFullYear()}`;
    };
    const formatTime = (date) => {
        if (!date || Number.isNaN(date.getTime())) return 'N/A';
        return `${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    };

    const isSameDay = startDate && endDate &&
        startDate.getFullYear() === endDate.getFullYear() &&
        startDate.getMonth() === endDate.getMonth() &&
        startDate.getDate() === endDate.getDate();

    const isEnded = endDate && !Number.isNaN(endDate.getTime()) ? currentTime > endDate.getTime() : false;
    const hasValidDeadline = deadlineDate && !Number.isNaN(deadlineDate.getTime());
    const isDeadlinePassed = hasValidDeadline ? currentTime > deadlineDate.getTime() : false;
    const isCancellable = hasValidDeadline ? currentTime < deadlineDate.getTime() : false;

    const isCancelled = event.status === 'cancelled';
    const isDone = event.status === 'done' || (!isCancelled && isEnded);
    const isDraft = event.status === 'draft';
    const isRegistrationOpen = event.status === 'published' && !isEnded && !isDeadlinePassed;

    const getEventStatusDisplay = () => {
        if (isCancelled) {
            return {
                label: t('event_detail.status_cancelled_event', 'Sự kiện đã bị hủy'),
                className: 'bg-red-100 text-red-700 border border-red-200 px-3 py-1 rounded-full text-xs font-semibold',
            };
        }
        if (isDone) {
            return {
                label: t('event_detail.status_done', 'Đã kết thúc'),
                className: 'text-gray-500 font-semibold',
            };
        }
        if (isDraft) {
            return {
                label: t('event_detail.status_closed', 'Chưa mở'),
                className: 'text-amber-600 font-semibold',
            };
        }
        if (isDeadlinePassed) {
            return {
                label: t('event_detail.register_closed', 'Hết hạn đăng ký'),
                className: 'text-red-600 font-semibold',
            };
        }
        return {
            label: t('event_detail.status_open', 'Đang mở đăng ký'),
            className: 'text-green-600 font-semibold',
        };
    };

    const statusDisplay = getEventStatusDisplay();

    const registeredCount = event.registrations
        ? event.registrations.reduce((sum, reg) => sum + (Number(reg.quantity) || 1), 0)
        : 0;
    const remainingSpots = Math.max(0, event.capacity - registeredCount);

    const isRegistered = !!userRegistration && userRegistration.status === 'approved';
    const hasAnyRegistration = !!userRegistration;

    const userReview = user && event.reviews
        ? event.reviews.find((r) => String(r.user_id) === String(user.id) || String(r.user?.id) === String(user.id))
        : null;

    const reviewsCount = event && event.reviews ? event.reviews.length : 0;
    const avgRating = event && event.reviews && reviewsCount > 0
        ? (event.reviews.reduce((sum, r) => sum + r.rating, 0) / reviewsCount).toFixed(1)
        : null;

    return (
        <div className="min-h-screen bg-[#EBEFEA] font-sans">
            {/* Top Navigation Bar / Banner Area */}
            <div className="relative w-full h-[300px] md:h-[400px]">
                <img src={bannerImg} alt="Event Banner" className="w-full h-full object-cover" />
                <div className="absolute top-0 left-0 w-full p-4 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent">
                    <button onClick={() => navigate(-1)} className="text-white border border-white rounded-full px-4 py-1 text-sm hover:bg-white/20 transition backdrop-blur-sm flex items-center gap-2">
                        <span>&lt;</span> {t('event_detail.back', 'Quay lại')}
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-20 relative z-10 pb-20">
                <div className="flex flex-col lg:flex-row gap-6 items-start">

                    {/* Left Column - Details */}
                    <div className="w-full lg:w-2/3 space-y-6">
                        <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-10">
                            <div className="flex flex-wrap items-center gap-3 mb-4">
                                <span className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${getCategoryColor(catName)}`}>
                                    {t('category.' + catName, catName)}
                                </span>
                                {isCancelled && (
                                    <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-700 border border-red-200">
                                        {t('event_detail.status_cancelled_event', 'Sự kiện đã bị hủy')}
                                    </span>
                                )}
                            </div>

                            <h1 className="text-3xl sm:text-4xl font-bold text-slate-800 mb-6">{event.title}</h1>

                            {isCancelled && (
                                <div className="mb-8 flex gap-3 rounded-2xl border border-red-200 bg-red-50 p-4">
                                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-100">
                                        <AlertTriangle size={18} className="text-red-600" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-red-700 mb-1">
                                            {t('event_detail.status_cancelled_event', 'Sự kiện đã bị hủy')}
                                        </p>
                                        <p className="text-sm text-red-600 leading-relaxed">
                                            <span className="font-medium">{t('event_detail.cancel_reason_label', 'Lý do hủy: ')}</span>
                                            {event.cancel_reason || t('event_detail.no_cancel_reason', 'Nhà tổ chức chưa cung cấp lý do hủy.')}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {avgRating && (
                                <div className="flex items-center gap-1.5 mb-8 text-slate-700 font-semibold bg-amber-50 px-4 py-2 rounded-2xl w-fit border border-amber-200">
                                    <svg className="w-5 h-5 text-amber-500 fill-current" viewBox="0 0 20 20">
                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                    </svg>
                                    <span className="text-lg font-bold text-slate-800">{avgRating}</span>
                                    <span className="text-slate-500 text-sm font-medium">
                                        {t('event_detail.rating_count', { count: reviewsCount })}
                                    </span>
                                </div>
                            )}

                            <div className="flex flex-col sm:flex-row gap-6 mb-10">
                                <div className="flex items-start gap-3">
                                    <div className="mt-1">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">{t('event_detail.date_time', 'Ngày & giờ')}</p>
                                        {isSameDay ? (
                                            <>
                                                <p className="font-semibold text-slate-800">{formatDate(startDate)}</p>
                                                <p className="font-semibold text-slate-800">{formatTime(startDate)} - {formatTime(endDate)}</p>
                                            </>
                                        ) : (
                                            <>
                                                <p className="font-semibold text-slate-800">{formatTime(startDate)}, {formatDate(startDate)}</p>
                                                <p className="text-sm text-gray-400 my-0.5 text-center">đến</p>
                                                <p className="font-semibold text-slate-800">{formatTime(endDate)}, {formatDate(endDate)}</p>
                                            </>
                                        )}
                                    </div>
                                </div>

                                <div className="flex items-start gap-3 sm:ml-8">
                                    <div className="mt-1">
                                        <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500 mb-1">{t('event_detail.location', 'Địa điểm')}</p>
                                        <p className="font-semibold text-slate-800">{event.location}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mb-8">
                                <h2 className="text-xl font-bold text-slate-800 mb-4">{t('event_detail.about_title', 'Giới thiệu sự kiện')}</h2>
                                <div className="text-gray-600 whitespace-pre-line leading-relaxed">
                                    {event.description}
                                </div>
                            </div>

                            <div>
                                <h2 className="text-xl font-bold text-slate-800 mb-4">{t('event_detail.attendees_title', 'Người tham gia')}</h2>
                                <div className="flex items-center">
                                    <div className="flex -space-x-3">
                                        {event.registrations && event.registrations.slice(0, 5).map((reg, idx) => (
                                            reg.user?.avatar ? (
                                                <img
                                                    key={idx}
                                                    src={getAvatarUrl(reg.user.avatar)}
                                                    alt={reg.user.name}
                                                    className="w-10 h-10 rounded-full border-2 border-white object-cover"
                                                />
                                            ) : (
                                                <div key={idx} className="w-10 h-10 rounded-full border-2 border-white flex items-center justify-center text-xs font-bold text-slate-800" style={{ backgroundColor: avatarColors[idx % avatarColors.length] }}>
                                                    {getInitials(reg.user?.name)}
                                                </div>
                                            )
                                        ))}
                                        {registeredCount > 5 && (
                                            <div className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center text-xs font-bold text-slate-800">
                                                +{registeredCount - 5}
                                            </div>
                                        )}
                                    </div>
                                    <span className="ml-4 text-sm text-gray-500">{registeredCount} {t('event_detail.attending_suffix', 'đang tham dự')}</span>
                                </div>
                            </div>
                        </div>

                        {/* Comments Card */}
                        <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-10 border border-[#fef3c7]">
                            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
                                <h2 className="text-xl font-bold text-slate-800">{t('event_detail.comments_title', { count: reviewsCount })}</h2>
                                {avgRating && (
                                    <div className="flex items-center gap-1">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className={`w-4 h-4 ${i < Math.round(Number(avgRating)) ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                            </svg>
                                        ))}
                                        <span className="text-sm font-bold text-slate-700 ml-1">{avgRating}/5</span>
                                    </div>
                                )}
                            </div>

                            {!token ? (
                                <div className="bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl p-6 text-center mb-8">
                                    <p className="text-slate-600 font-medium mb-3">{t('event_detail.comment_login_prompt', 'Vui lòng đăng nhập để bình luận và đánh giá sự kiện.')}</p>
                                    <button onClick={() => navigate('/login')} className="bg-slate-800 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-slate-700 transition">{t('event_detail.login_now', 'Đăng nhập ngay')}</button>
                                </div>
                            ) : !isRegistered ? (
                                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 text-center mb-8">
                                    <svg className="w-8 h-8 text-amber-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                                    </svg>
                                    <p className="text-amber-800 font-semibold mb-1">{t('event_detail.review_restricted_title', 'Quyền đánh giá bị giới hạn')}</p>
                                    <p className="text-amber-700 text-sm">{t('event_detail.review_restricted_desc', 'Bạn cần đăng ký tham gia và được chấp nhận vào sự kiện này trước khi có thể gửi bình luận đánh giá.')}</p>
                                </div>
                            ) : !isEnded ? (
                                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center mb-8">
                                    <svg className="w-8 h-8 text-blue-500 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                    </svg>
                                    <p className="text-blue-800 font-semibold mb-1">Sự kiện chưa kết thúc</p>
                                    <p className="text-blue-700 text-sm">Bạn chỉ có thể gửi đánh giá và bình luận sau khi sự kiện này đã chính thức kết thúc.</p>
                                </div>
                            ) : userReview ? (
                                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-8">
                                    <div className="flex items-center gap-2 text-emerald-800 font-semibold mb-2">
                                        <CheckCircle2 size={18} className="text-emerald-600" />
                                        <span>{t('event_detail.already_reviewed', 'Bạn đã đánh giá sự kiện này')}</span>
                                    </div>
                                    <div className="flex items-center gap-1 mb-2">
                                        {[...Array(5)].map((_, i) => (
                                            <svg key={i} className={`w-4 h-4 ${i < userReview.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                            </svg>
                                        ))}
                                        <span className="text-xs font-medium text-emerald-700 ml-1">{userReview.rating}/5</span>
                                    </div>
                                    {userReview.comment && (
                                        <p className="text-sm text-slate-700 bg-white/80 rounded-xl p-3 border border-emerald-100">
                                            {userReview.comment}
                                        </p>
                                    )}
                                </div>
                            ) : (
                                <>
                                    {/* Star Rating Selection */}
                                    <div className="flex gap-2 mb-4">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button key={star} type="button" onClick={() => setRating(star)} className="focus:outline-none">
                                                <svg className={`w-8 h-8 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                                </svg>
                                            </button>
                                        ))}
                                    </div>

                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value.slice(0, MAX_REVIEW_LENGTH))}
                                        maxLength={MAX_REVIEW_LENGTH}
                                        placeholder={t('event_detail.comment_placeholder', 'Nhập bình luận của bạn (không bắt buộc)...')}
                                        className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#BCE2CD] resize-none"
                                        rows="3"
                                    ></textarea>
                                    <div className="flex justify-between items-center mt-2 mb-4">
                                        <span className="text-xs text-gray-400">
                                            {t('event_detail.comment_optional_hint', 'Nhận xét là không bắt buộc (tối đa 300 ký tự)')}
                                        </span>
                                        <span className={`text-xs font-medium ${comment.length >= MAX_REVIEW_LENGTH ? 'text-red-500' : 'text-gray-500'}`}>
                                            {comment.length}/{MAX_REVIEW_LENGTH}
                                        </span>
                                    </div>
                                    <div className="flex justify-end">
                                        <button
                                            type="button"
                                            onClick={handleSubmitReview}
                                            disabled={submittingReview}
                                            className="bg-slate-800 text-white px-6 py-2 rounded-xl hover:bg-slate-700 transition disabled:opacity-50"
                                        >
                                            {submittingReview ? t('event_detail.submitting', 'Đang gửi...') : t('event_detail.submit_review', 'Gửi đánh giá')}
                                        </button>
                                    </div>
                                </>
                            )}

                            {/* Existing Comments */}
                            <div className="mt-8 space-y-6">
                                {event.reviews && event.reviews.length > 0 ? (
                                    event.reviews.map((rev, idx) => (
                                        <div key={rev.id || idx} className="flex gap-4">
                                            {rev.user?.avatar ? (
                                                <img
                                                    src={getAvatarUrl(rev.user.avatar)}
                                                    alt={rev.user.name}
                                                    className="w-10 h-10 rounded-full object-cover shrink-0"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold text-slate-800 shrink-0" style={{ backgroundColor: avatarColors[idx % avatarColors.length] }}>
                                                    {getInitials(rev.user?.name)}
                                                </div>
                                            )}
                                            <div>
                                                <div className="flex items-center gap-2 mb-1">
                                                    <h4 className="font-semibold text-slate-800">{rev.user?.name || t('event_detail.modal.unknown', 'Người dùng')}</h4>
                                                    <div className="flex">
                                                        {[...Array(5)].map((_, i) => (
                                                            <svg key={i} className={`w-3 h-3 ${i < rev.rating ? 'text-yellow-400' : 'text-gray-300'}`} fill="currentColor" viewBox="0 0 20 20">
                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
                                                            </svg>
                                                        ))}
                                                    </div>
                                                </div>
                                                {rev.comment && <p className="text-gray-600 text-sm">{rev.comment}</p>}
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-center py-6 text-gray-500 text-sm">
                                        Chưa có bình luận nào. Hãy là người đầu tiên đánh giá sự kiện này!
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Registration Summary Card */}
                    <div className="w-full lg:w-1/3">
                        <div className="bg-white rounded-3xl shadow-lg p-6 sm:p-8 sticky top-24 border border-[#BCE2CD]">
                            <div className="space-y-4 mb-8">
                                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                    <span className="text-gray-500 text-sm">{t('event_detail.status_label', 'Trạng thái sự kiện:')}</span>
                                    <span className={statusDisplay.className}>
                                        {statusDisplay.label}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center border-b border-gray-100 pb-4">
                                    <span className="text-gray-500 text-sm">
                                        {t('event_detail.capacity', { capacity: event.capacity })}
                                    </span>
                                    <span className="text-[#F05A4A] font-semibold text-sm">
                                        {remainingSpots > 0 ? t('event_detail.spots_left', { count: remainingSpots }) : t('event_detail.spots_full', 'Hết chỗ')}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center pb-2">
                                    <span className="text-gray-500 text-sm">{t('event_detail.deadline', 'Hạn đăng ký:')}</span>
                                    <span className="text-slate-800 font-medium text-sm">{formatDate(deadlineDate)}</span>
                                </div>
                                {userRegistration && (
                                    <div className="flex justify-between items-center border-t border-gray-100 pt-4 mt-2">
                                        <span className="text-gray-500 text-sm">{t('event_detail.your_registration', 'Đăng ký của bạn:')}</span>
                                        {userRegistration.status === 'approved' && (
                                            <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
                                                {t('event_detail.status_approved', 'Chính thức')}
                                                {userRegistration.quantity > 1 ? ` (${userRegistration.quantity})` : ''}
                                            </span>
                                        )}
                                        {userRegistration.status === 'pending' && (
                                            <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-full border border-amber-200">
                                                {t('event_detail.status_pending', 'Đang chờ duyệt')}
                                                {userRegistration.quantity > 1 ? ` (${userRegistration.quantity})` : ''}
                                            </span>
                                        )}
                                        {userRegistration.status === 'cancelled' && (
                                            <span className="bg-rose-100 text-rose-800 text-xs font-semibold px-2.5 py-1 rounded-full border border-rose-200">
                                                {t('event_detail.status_cancelled', 'Đã hủy')}
                                            </span>
                                        )}
                                    </div>
                                )}
                            </div>

                            {hasAnyRegistration ? (
                                <div className="space-y-3">
                                    <button
                                        disabled={true}
                                        className="w-full py-4 rounded-xl font-semibold text-lg bg-gray-200 text-gray-500 cursor-not-allowed"
                                    >
                                        {userRegistration.status === 'approved' && t('event_detail.registered_approved', 'Đã đăng ký chính thức')}
                                        {userRegistration.status === 'pending' && t('event_detail.registered_pending', 'Đang ở hàng chờ')}
                                        {userRegistration.status === 'cancelled' && t('event_detail.registered_cancelled', 'Đăng ký đã bị hủy')}
                                    </button>
                                    {userRegistration.status !== 'cancelled' && !isCancelled && !isDone && isCancellable && (
                                        <button
                                            onClick={handleCancel}
                                            disabled={registering}
                                            className="w-full py-3 rounded-xl font-semibold text-md border-2 border-rose-500 text-rose-500 hover:bg-rose-50 hover:text-rose-600 transition flex items-center justify-center gap-2"
                                        >
                                            {registering ? t('event_detail.processing', 'Đang xử lý...') : t('event_detail.cancel_btn', 'Hủy đăng ký')}
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <button
                                    onClick={openRegisterDialog}
                                    disabled={registering || !isRegistrationOpen}
                                    className={`w-full py-4 rounded-xl font-semibold text-lg transition ${
                                        !isRegistrationOpen
                                            ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                            : remainingSpots <= 0
                                                ? 'bg-[#F05A4A] text-white hover:bg-[#d84e3f]'
                                                : 'bg-[#BCE2CD] text-slate-800 hover:bg-[#a6d1b8]'
                                    }`}
                                >
                                    {registering
                                        ? t('event_detail.processing', 'Đang xử lý...')
                                        : isCancelled
                                            ? t('event_detail.status_cancelled_event', 'Sự kiện đã bị hủy')
                                            : isDone
                                                ? t('event_detail.status_done', 'Đã kết thúc')
                                                : isDraft
                                                    ? t('event_detail.status_closed', 'Chưa mở')
                                                    : isDeadlinePassed
                                                        ? t('event_detail.register_closed', 'Hết hạn đăng ký')
                                                        : (remainingSpots > 0 ? t('event_detail.register_now', 'Đăng ký tham gia') : t('event_detail.register_waitlist', 'Đăng ký vào hàng chờ'))
                                    }
                                </button>
                            )}
                        </div>
                    </div>

                </div>
            </div>

            {/* UC-15 Registration Type Dialog (Cá nhân / Tổ chức) */}
            {showRegModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden">
                        <div className="flex justify-between items-center p-5 border-b border-gray-100">
                            <h3 className="text-lg font-bold text-slate-800">
                                {t('event_detail.reg_modal_title', 'Đăng ký tham dự sự kiện')}
                            </h3>
                            <button
                                type="button"
                                onClick={() => setShowRegModal(false)}
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                            >
                                <X size={20} />
                            </button>
                        </div>

                        <form onSubmit={handleConfirmRegister} className="p-6 space-y-5">
                            {regFormError && (
                                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
                                    {regFormError}
                                </div>
                            )}

                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-2">
                                    {t('event_detail.reg_type_label', 'Hình thức đăng ký')}
                                </label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setRegType('individual');
                                            setSeatQuantity(1);
                                            setRegFormError('');
                                        }}
                                        className={`py-2.5 px-4 rounded-xl border text-sm font-semibold transition ${
                                            regType === 'individual'
                                                ? 'border-[#e96a52] bg-[#e96a52]/10 text-[#e96a52]'
                                                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        {t('event_detail.reg_type_individual', 'Cá nhân')}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setRegType('organization');
                                            setRegFormError('');
                                        }}
                                        className={`py-2.5 px-4 rounded-xl border text-sm font-semibold transition ${
                                            regType === 'organization'
                                                ? 'border-[#e96a52] bg-[#e96a52]/10 text-[#e96a52]'
                                                : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                    >
                                        {t('event_detail.reg_type_organization', 'Tổ chức')}
                                    </button>
                                </div>
                            </div>

                            {regType === 'organization' && (
                                <>
                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                            {t('event_detail.org_name_label', 'Tên tổ chức')} <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={organizationName}
                                            onChange={(e) => {
                                                setOrganizationName(e.target.value);
                                                setRegFormError('');
                                            }}
                                            placeholder={t('event_detail.org_name_placeholder', 'Nhập tên tổ chức / đơn vị')}
                                            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#e96a52]/20 focus:border-[#e96a52] text-sm"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-slate-700 mb-1.5">
                                            {t('event_detail.quantity_label', 'Số lượng chỗ đăng ký')}
                                        </label>
                                        <div className="flex items-center gap-3">
                                            <button
                                                type="button"
                                                aria-label="Giảm số lượng chỗ"
                                                onClick={() => setSeatQuantity((prev) => Math.max(1, prev - 1))}
                                                disabled={seatQuantity <= 1}
                                                className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-slate-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <input
                                                type="number"
                                                min={1}
                                                max={MAX_GROUP_SEATS}
                                                value={seatQuantity}
                                                onChange={(e) => {
                                                    const val = parseInt(e.target.value, 10);
                                                    if (Number.isNaN(val)) {
                                                        setSeatQuantity(1);
                                                    } else {
                                                        setSeatQuantity(Math.min(MAX_GROUP_SEATS, Math.max(1, val)));
                                                    }
                                                }}
                                                className="w-24 text-center py-2 rounded-xl border border-gray-200 font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#e96a52]/20"
                                            />
                                            <button
                                                type="button"
                                                aria-label="Tăng số lượng chỗ"
                                                onClick={() => setSeatQuantity((prev) => Math.min(MAX_GROUP_SEATS, prev + 1))}
                                                disabled={seatQuantity >= MAX_GROUP_SEATS}
                                                className="w-10 h-10 rounded-xl border border-gray-200 flex items-center justify-center text-slate-700 hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition"
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                    </div>
                                </>
                            )}

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="button"
                                    onClick={() => setShowRegModal(false)}
                                    disabled={registering}
                                    className="flex-1 py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-slate-700 font-semibold text-sm transition"
                                >
                                    {t('event_detail.cancel_modal', 'Hủy')}
                                </button>
                                <button
                                    type="submit"
                                    disabled={registering}
                                    className="flex-1 py-2.5 rounded-xl bg-[#e96a52] hover:bg-[#d75c46] text-white font-semibold text-sm transition disabled:opacity-50"
                                >
                                    {registering
                                        ? t('event_detail.processing', 'Đang xử lý...')
                                        : t('event_detail.confirm_register', 'Xác nhận đăng ký')}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EventDetailPage;
