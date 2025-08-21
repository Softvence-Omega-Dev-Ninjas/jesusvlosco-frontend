
import { useHitLikeMutation } from "@/store/api/user/hitLike";
import { FiDownload, FiHeart } from "react-icons/fi";
import { toast } from "sonner";
import { jsPDF } from 'jspdf';

  const handleDownload = () => {
    const doc = new jsPDF();

    doc.text("Hello, this is a sample PDF document.", 10, 10);
    doc.save("sample.pdf");
  };

const UserRemotePolicyCard = ({ onClose, singleAnnouce }:{onClose:any,singleAnnouce:any}) => {
  const [hitLike] = useHitLikeMutation();

  const handleLike = async () => {
  try {
    const response:any = await hitLike(singleAnnouce?.data?.id)

    if (response?.success) {
      toast.success(response?.data?.message)
    }
    if (response?.error) {
      toast.warning(response?.error?.data?.message)
    }
  } catch (error) {
    console.log(error)
  }
}
  return (
    <div className="bg-white rounded-xl shadow-md p-6 max-w-8xl mx-auto relative">

      <button
        onClick={onClose}
        className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl"
        aria-label="Close"
      >
        &times;
      </button>

      <h2 className="text-xl font-semibold text-indigo-800 mb-2">
        {singleAnnouce?.data?.title}
      </h2>

      <div className="flex items-center text-sm text-gray-500 mb-4 gap-4">
        <span>{singleAnnouce?.data?.author?.profile?.firstName}</span>
        <span>•</span>
        <span>{singleAnnouce?.data?.viewCount}</span>
      </div>

      <p className="text-gray-700 text-sm mb-4">
        <div
          dangerouslySetInnerHTML={{
            __html: singleAnnouce?.data?.description,
          }}
        ></div>

      </p>

      {/* <p className="text-gray-700 text-sm mb-6"> */}
        <br />
        <br />
        {/* <strong>Key highlights of the new policy:</strong>
        <ul className="list-disc list-inside ml-4 mt-2 space-y-1">
          <li>Employees can work remotely up to 3 days per week</li>
          <li>Core collaboration hours: 10 AM - 3 PM in your local timezone</li>
          <li>Monthly in-person team meetings are mandatory</li>
          <li>Home office stipend of $500 annually for equipment</li>
          <li>Regular check-ins with managers to ensure productivity</li>
        </ul> */}
        {/* <br />
        This policy has been developed based on extensive feedback from our employee survey conducted last quarter, where 87% of respondents expressed interest in more flexible work arrangements. We believe this change will help us attract top talent while supporting our current team members in achieving better work-life integration.
        <br />
        <br />
        For questions about this policy, please reach out to HR at hr@topcompany.com or schedule a one-on-one meeting with your manager.
      </p> */}

      <div className="mb-6">
        <h4 className="text-sm font-semibold text-gray-700 mb-2">Attachments</h4>
        <ul className="space-y-2">
          <li className="flex justify-between items-center bg-gray-100 px-4 py-2 rounded-md text-sm">
            <span>{singleAnnouce?.data?.attachments.map((file: any) => (
              file?.file
            ))}</span>
            <a href="#" className="text-indigo-600 hover:underline flex items-center gap-1"
              onClick={(e) => {
                e.preventDefault();
                handleDownload();
              }}
            >
              <FiDownload className="w-4 h-4" />
              Download
            </a>
          </li>
        </ul>
      </div>

      <div className="flex items-center text-sm text-gray-600 gap-1">
        <FiHeart className="w-4 h-4 text-pink-500 cursor-pointer" onClick={handleLike} />
        <span>{singleAnnouce?.data?.likeCount} Likes</span>
      </div>
    </div>
  );
};

export default UserRemotePolicyCard;

