import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

const members = [
  { id: 1, name: "Theresa Webb", avatar: "https://i.pravatar.cc/150?img=1" },
  { id: 2, name: "Robert Fox", avatar: "https://i.pravatar.cc/150?img=2" },
  { id: 3, name: "Arlene McCoy", avatar: "https://i.pravatar.cc/150?img=3" },
  { id: 4, name: "Wade Warren", avatar: "https://i.pravatar.cc/150?img=4" },
];

const MemberSelectorModal = ({
  setShowMemberModal,
}: {
  setShowMemberModal: (arg0: boolean) => void;
}) => {
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<any[]>([]);
  const modalRef = useRef<HTMLDivElement>(null);

  const filtered = members.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) &&
      !selected.some((s) => s.id === m.id)
  );

  const addMember = (member: any) => {
    setSelected([...selected, member]);
    setSearch("");
  };

  const removeMember = (id: number) => {
    setSelected(selected.filter((m) => m.id !== id));
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        modalRef.current &&
        !modalRef.current.contains(event.target as Node)
      ) {
        setShowMemberModal(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setShowMemberModal]);

  return (
    <div className="fixed inset-0 bg-white/50 z-50 flex drop-shadow-xl items-center justify-center">
      <div ref={modalRef} className="w-80 p-4 bg-white rounded-2xl shadow-xl">
        {/* Search + Add */}
        <div className="flex items-center space-x-2 mb-2">
          <input
            type="text"
            placeholder="Search members"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-3 py-2 border rounded-full text-sm focus:outline-none"
          />
          <button className="bg-primary text-white px-4 py-1.5 rounded-md text-sm">
            Add
          </button>
        </div>

        {/* Selected tags */}
        <div className="flex flex-wrap gap-2 mb-3">
          {selected.map((user) => (
            <div
              key={user.id}
              className="flex items-center bg-indigo-100 text-primary px-3 py-1 rounded-full text-sm"
            >
              {user.name}
              <X
                size={14}
                className="ml-2 cursor-pointer"
                onClick={() => removeMember(user.id)}
              />
            </div>
          ))}
        </div>

        {/* Member list */}
        <div className="max-h-40 overflow-y-auto">
          {filtered.map((user) => (
            <div
              key={user.id}
              onClick={() => addMember(user)}
              className="flex items-center space-x-3 p-2 rounded-md hover:bg-gray-100 cursor-pointer"
            >
              <img
                src={user.avatar}
                alt={user.name}
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm text-gray-700">{user.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MemberSelectorModal;
