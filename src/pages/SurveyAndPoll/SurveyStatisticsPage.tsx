/* eslint-disable @typescript-eslint/no-explicit-any */
import { FaSpinner } from "react-icons/fa";
import CircularProgress from "./CircularProgress";
import { useGetSurveyAnalyticsQuery } from "@/store/api/admin/survey/servey";
import { IoIosArrowBack } from "react-icons/io";
import { useNavigate } from "react-router-dom";

const SurveyStatisticsPage = () => {
  const { data: surveyStatesData, isLoading: isSurveyLoading } = useGetSurveyAnalyticsQuery(null);
  const navigate = useNavigate();
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-bold text-primary mt-6">All Survey</h3>
        <button onClick={() => navigate(-1)} className="text-[#484848] text-sm font-medium cursor-pointer flex items-center gap-1">
          <IoIosArrowBack className="text-lg mt-0.5" />
          <span className="text-lg">Back</span>
        </button>
      </div>
      {isSurveyLoading && (
        <div className="flex items-center justify-center opacity-50 h-44 w-full">
          <FaSpinner className="animate-spin text-4xl" />
        </div>
      )}
      {!isSurveyLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {surveyStatesData?.data?.map((stat: any, index: number) => (
            <div key={index} className=" p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex flex-col items-center">
                <div className="text-center  mt-4">
                  <h4 className="text-xl text-primary font-semibold">{stat?.title}</h4>
                  <p className="text-base  my-2 text-primary">{stat?.description}</p>
                </div>
                <CircularProgress percentage={Math.round(stat?.responsePercentage || 0)} />
                <div className="text-center mt-4 text-[#949494]">
                  <p className="  mt-2">Response Rate: {Math.round(stat?.responsePercentage || 0)}%</p>
                  <p className=" ">
                    ({stat?.respondedCount} of {stat?.totalAssigned} responded)
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SurveyStatisticsPage;
