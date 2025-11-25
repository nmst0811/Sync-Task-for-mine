// src/constants.ts
import { 
  faGraduationCap, 
  faBriefcase, 
  faHouse, 
  faLaptopCode,
  faEllipsis 
} from "@fortawesome/free-solid-svg-icons"; 

// カテゴリのデータ定義
export const CATEGORIES = [
  { id: 'school', label: '学校', icon: faGraduationCap, color: 'bg-blue-500' },
  { id: 'work', label: 'バイト', icon: faBriefcase, color: 'bg-orange-500' },
  { id: 'coding', label: '開発', icon: faLaptopCode, color: 'bg-indigo-600' },
  { id: 'private', label: '私用', icon: faHouse, color: 'bg-green-500' },
  { id: 'other', label: 'その他', icon: faEllipsis, color: 'bg-gray-500' },
];

// 色をIDから引けるようにする辞書（TodoItemで使います）
export const CATEGORY_COLORS: Record<string, string> = {
  school: 'bg-blue-500',
  work: 'bg-orange-500',
  coding: 'bg-indigo-600',
  private: 'bg-green-500',
  other: 'bg-gray-500',
};

// タグ用の色リスト
export const TAG_COLORS = [
  { label: "赤", className: "bg-red-100 text-red-700" },
  { label: "青", className: "bg-blue-100 text-blue-700" },
  { label: "緑", className: "bg-green-100 text-green-700" },
  { label: "黄", className: "bg-yellow-100 text-yellow-700" },
  { label: "紫", className: "bg-purple-100 text-purple-700" },
  { label: "灰", className: "bg-gray-100 text-gray-700" },
];