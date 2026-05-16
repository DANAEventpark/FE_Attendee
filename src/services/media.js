const STORAGE_BASE_URL = 'http://127.0.0.1:8000/storage/'

export function resolveMediaUrl(path) {

  // Không có ảnh
  if (!path) {
    return ''
  }

  // Nếu đã là link đầy đủ
  if (path.startsWith('http')) {
    return path
  }

  // Xoá dấu / dư ở đầu
  const cleanPath = path.startsWith('/')
    ? path.slice(1)
    : path

  // Trả về URL đầy đủ
  return `${STORAGE_BASE_URL}${cleanPath}`
}