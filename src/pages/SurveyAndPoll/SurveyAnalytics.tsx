/* eslint-disable @typescript-eslint/no-explicit-any */
import { useGetSurveyAnalyticsQuery } from "@/store/api/admin/survey/servey";
import CircularProgress from "./CircularProgress";
import { FaSpinner } from "react-icons/fa";
import { Link } from "react-router-dom";

const SurveyAnalytics = () => {
  const { data: surveyStatesData, isLoading: isSurveyLoading } = useGetSurveyAnalyticsQuery(null);
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-primary">Survey</h3>
        <Link to={"/admin/survey-analytics"}>
          <button className="text-[#484848] text-sm font-medium cursor-pointer bg-slate-100 hover:bg-slate-200 rounded-md px-4 py-2">View All</button>
        </Link>
      </div>
      {isSurveyLoading && (
        <div className="flex items-center justify-center opacity-50 h-44 w-full">
          <FaSpinner className="animate-spin text-4xl" />
        </div>
      )}
      {!isSurveyLoading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {surveyStatesData?.data?.slice(0, 4)?.map((stat: any, index: number) => (
            <div key={index} className=" p-6 rounded-lg border border-gray-200 shadow-sm">
              <div className="flex flex-col items-center">
                <div className="text-center  mt-4">
                  <h4 className="text-xl text-primary font-semibold">{stat?.title}</h4>
                  <p className="text-base  my-2 text-primary">{stat?.description}</p>
                </div>
                <CircularProgress percentage={stat?.responsePercentage} />
                <div className="text-center mt-4 text-[#949494]">
                  <p className="  mt-2">Response Rate: {stat?.responsePercentage}%</p>
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

export default SurveyAnalytics;
