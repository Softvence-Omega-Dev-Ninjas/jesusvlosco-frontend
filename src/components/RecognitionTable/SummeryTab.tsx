// import light from "@/assets/light-c.png";
// import user1 from "@/assets/reactionuser2.png";
// import user2 from "@/assets/reactionu1.png";
// import user3 from "@/assets/reaction user 3.png";
import { IBadge, IRecognation } from "@/types/recognation";
import { IUser } from "@/types/user";
import { PiUserCircleLight } from "react-icons/pi";
// import { useAddRecognationMutation } from "@/store/api/admin/recognation/recognationApi";
interface IProp {
  formData: IRecognation;
  selectedBadge: IBadge;
  selectedUsersData: IUser[];
  handleRecognation: () => void;
}
const SummeryTab = ({
  formData,
  selectedBadge,
  selectedUsersData,

}: IProp) => {
  return (
    <div className=" ">
      <div>
        <div className="bg-[#FFEFD9] rounded-2xl py-10 p-6 max-w-4xl  mx-auto">
          <div className="flex flex-col md:flex-row mb-6 mt-6 gap-6 items-center md:items-start md:justify-center h-auto md:h-52 text-center md:text-left">
            {/* Left Text */}
            <div className="w-full  md:w-1/3 text-center md:text-end font-semibold text-[#484848] flex items-center justify-center md:justify-end h-full">
              {formData?.message}
            </div>

            {/* Middle Image */}
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="bg-indigo-100 p-4 rounded-xl">
                <img
                  src={selectedBadge?.iconImage}
                  alt="Creative"
                  className="w-full max-h-[200px] max-w-[150px] mx-auto"
                />
              </div>
            </div>

            {/* Right User List */}
            <div className="w-full md:w-1/3 space-y-4 flex flex-col items-center justify-center md:items-start">
              {selectedUsersData?.map((user: IUser) => (
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    {user?.profile?.profileUrl ? (
                      <img
                        className="h-10 w-10 rounded-full"
                        src={user?.profile?.profileUrl}
                        alt={`Avatar of ${user?.profile?.firstName}`}
                      />
                    ) : (
                      <PiUserCircleLight size={36} />
                    )}
                  </div>
                  <div className="ml-3 ">
                    <div className="text-sm flex items-center gap-2 font-medium text-gray-900">
                      <p>{user?.profile?.firstName}</p>
                      <p> {user?.profile?.lastName}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <h2 className="text-center">Admin recognized Project A</h2>
        </div>
      </div>
      <h2 className="text-center mt-16">All user can see this recognition</h2>
    </div>
  );
};

export default SummeryTab;
