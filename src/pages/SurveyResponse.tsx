import SurveyFirstCard from "@/components/AdminSurveyResponse/SurveyFirstCard";
import SurveyQuestionCard from "@/components/AdminSurveyResponse/SurveyQuestionCard";

const SurveyResponse: React.FC = () => {
  return (
   <div className="mx-auto my-6">
    <SurveyFirstCard></SurveyFirstCard>
    <SurveyQuestionCard></SurveyQuestionCard>
   </div>
  );
};

export default SurveyResponse;
