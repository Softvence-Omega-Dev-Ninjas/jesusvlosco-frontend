import light from "@/assets/light-c.png";
import user1 from "@/assets/reactionuser2.png";
import user2 from "@/assets/reactionu1.png";
import user3 from "@/assets/reaction user 3.png";

const SummeryTab = () => {
  return (
    <div className=" ">
      <div>
        <div className="bg-[#FFEFD9] rounded-2xl py-10 p-6 max-w-4xl  mx-auto">
          <div className="flex flex-col md:flex-row mb-6 mt-6 gap-6 items-center md:items-start md:justify-center h-auto md:h-52 text-center md:text-left">
            {/* Left Text */}
            <div className="w-full  md:w-1/3 text-center md:text-end font-semibold text-[#484848] flex items-center justify-center md:justify-end h-full">
              XYZ recognized
            </div>

            {/* Middle Image */}
            <div className="w-full md:w-1/3 flex justify-center">
              <div className="bg-indigo-100 p-4 rounded-xl">
                <img
                  src={light}
                  alt="Creative"
                  className="w-full max-w-[150px] mx-auto"
                />
              </div>
            </div>

            {/* Right User List */}
            <div className="w-full md:w-1/3 space-y-4 flex flex-col items-center justify-center md:items-start">
              {[
                { src: user1, name: "Cody Fisher" },
                { src: user2, name: "Leslie Alexander" },
                { src: user3, name: "Robert Fox" },
              ].map(({ src, name }, i) => (
                <div key={i} className="flex items-center space-y-4 space-x-3">
                  <img
                    src={src}
                    alt={name}
                    className="w-10 h-10 rounded-full"
                  />
                  <span className="text-gray-800">{name}</span>
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
