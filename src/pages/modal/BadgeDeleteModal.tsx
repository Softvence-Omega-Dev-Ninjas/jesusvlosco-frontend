import { useDeleteBadgeMutation } from "@/store/api/admin/recognation/recognationApi";
import { X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
interface IProp {
  card: any;
}
export default function BadgeDeleteModal({ card }: IProp) {
  const [isOpen, setIsOpen] = useState(false);
  const [deleteBadge, { isLoading }] = useDeleteBadgeMutation();
  const handleDelete = async (id: string) => {
    console.log("Item deleted!", id);
    
    try {
      const result = await deleteBadge({id}).unwrap();
      if (result.success) {
        toast.success(result?.message || "Badge deleted succesfully");
      }
    } catch (error: any) {
        console.log({error})
      toast.error(error?.message || "Something went wrong");
    } finally {
      setIsOpen(false);
    }
  };

  return (
    <>
      {/* Trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="w-full px-4 py-2 cursor-pointer text-left text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
      >
        Delete
      </button>
      {/* <button
        onClick={() => setIsOpen(true)}
        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
      >
        Delete Item
      </button> */}

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-sm p-6 animate-fadeIn">
            <div className="flex justify-between">
              <h2 className="text-lg font-semibold text-gray-800">
                Delete Badge?
              </h2>
              <X className="text-gray-700" onClick={() => setIsOpen(false)} />
            </div>

            <p className="mt-2 text-sm text-gray-500">
              Are you sure you want to delete this badge? This action cannot be
              undone.
            </p>

            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                disabled={isLoading}
                onClick={() => handleDelete(card?.id)}
                className="px-4 disabled:opacity-70 disabled:cursor-not-allowed py-2 rounded-lg bg-red-600 text-white hover:bg-red-700"
              >
                {isLoading ? "Deleting..." : " Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
