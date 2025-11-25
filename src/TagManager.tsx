import { useState } from "react";
import { v4 as uuid } from "uuid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark, faTrashCan, faTag } from "@fortawesome/free-solid-svg-icons";
import { TAG_COLORS } from "./constants";
import type { Tag } from "./types";

type Props = {
  tags: Tag[];
  onAddTag: (tag: Tag) => void;
  onDeleteTag: (id: string) => void;
  onClose: () => void;
};

const TagManager = ({ tags, onAddTag, onDeleteTag, onClose }: Props) => {
  const [newTagName, setNewTagName] = useState("");
  const [selectedColor, setSelectedColor] = useState(TAG_COLORS[0].className);

  const handleAdd = () => {
    if (!newTagName.trim()) return;
    const newTag: Tag = {
      id: uuid(),
      label: newTagName,
      color: selectedColor,
    };
    onAddTag(newTag);
    setNewTagName("");
  };

  return (
    <div className="fixed inset-0 z-60 flex items-center justify-center bg-black/50 p-4 transition-opacity">
      <div className="w-full max-w-sm animate-slide-up rounded-2xl bg-white p-5 shadow-2xl sm:animate-none">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="flex items-center gap-2 text-xl font-bold text-gray-800">
            <FontAwesomeIcon icon={faTag} className="text-indigo-500" />
            タグの管理
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <FontAwesomeIcon icon={faXmark} size="xl" />
          </button>
        </div>

        {/* 新規追加フォーム */}
        <div className="mb-6 space-y-3 rounded-xl bg-gray-50 p-3">
          <input
            type="text"
            value={newTagName}
            onChange={(e) => setNewTagName(e.target.value)}
            placeholder="新しいタグ名 (例: #重要)"
            className="w-full rounded-md border border-gray-300 p-2 font-bold focus:border-indigo-500 focus:outline-none"
          />
          <div className="flex justify-between gap-1">
            {TAG_COLORS.map((color) => (
              <button
                key={color.className}
                onClick={() => setSelectedColor(color.className)}
                className={`h-8 w-8 rounded-full border-2 transition-transform hover:scale-110 ${color.className} ${
                  selectedColor === color.className ? "border-gray-600 scale-110" : "border-transparent"
                }`}
              />
            ))}
          </div>
          <button
            onClick={handleAdd}
            disabled={!newTagName}
            className="w-full rounded-md bg-indigo-600 py-2 font-bold text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            追加
          </button>
        </div>

        {/* タグ一覧 */}
        <div className="max-h-60 overflow-y-auto space-y-2">
          {tags.length === 0 && <p className="text-center text-sm text-gray-400">タグがまだありません</p>}
          {tags.map((tag) => (
            <div key={tag.id} className="flex items-center justify-between rounded-md border border-gray-100 bg-white p-2 shadow-sm">
              <span className={`rounded-md px-2 py-1 text-sm font-bold ${tag.color}`}>
                {tag.label}
              </span>
              <button
                onClick={() => onDeleteTag(tag.id)}
                className="text-gray-400 hover:text-red-500"
              >
                <FontAwesomeIcon icon={faTrashCan} />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TagManager;