import light from "@/assets/light-c.png";
import user1 from "@/assets/reactionuser2.png";
import user2 from "@/assets/reactionu1.png";
import user3 from "@/assets/reaction user 3.png";

const SummeryTab = () => {
  return (
    <div className=" ">
      <div>
        <div className="bg-[#FFEFD9] rounded-2xl py-10 p-6 max-w-4xl  mx-auto">
          <div className=" flex flex-col mb-6 mt-6 h-auto md:h-52 gap-4 items-center md:flex-row md:justify-center">
            {/* Left Text */}
            <div className="w-full text-left md:text-right font-semibold  text-[#484848]">
              XYZ recognized
            </div>

            {/* Middle Image */}
            <div className="w-full flex justify-center ">
              <div className="bg-indigo-100 p-4 rounded-xl">
                <img src={light} alt="Creative" className="w-full  mx-auto" />
              </div>
            </div>

            {/* Right User List */}
            <div className="w-full space-y-6  ">
              <div className="flex items-center space-x-3">
                <img
                  src={user1}
                  alt="Cody Fisher"
                  className="w-10 h-10 rounded-full"
                />
                <span className="text-gray-800">Cody Fisher</span>
              </div>
              <div className="flex items-center space-x-3">
                <img
                  src={user2}
                  alt="Leslie Alexander"
                  className="w-10 h-10 rounded-full"
                />
                <span className="text-gray-800">Leslie Alexander</span>
              </div>
              <div className="flex items-center space-x-3">
                <img
                  src={user3}
                  alt="Robert Fox"
                  className="w-10 h-10 rounded-full"
                />
                <span className="text-gray-800">Robert Fox</span>
              </div>
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
