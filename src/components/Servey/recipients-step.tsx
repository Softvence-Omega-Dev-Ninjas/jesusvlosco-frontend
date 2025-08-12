import { SurveySettings, User } from "./types/survey";
import PollRecipients from "@/pages/PollComponents/PollRecipients";

interface RecipientsStepProps {
  users: User[];
  selectedUsers: string[];
  onUserSelectionChange: (userId: string, selected: boolean) => void;
  settings: SurveySettings;
}

export const RecipientsStep: React.FC<RecipientsStepProps> = ({ settings }) => {
  // const [searchTerm, setSearchTerm] = useState("");

  // const filteredUsers = users.filter(
  //   (user) =>
  //     user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
  //     user.department.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  // const handleSelectAll = (checked: boolean) => {
  //   if (checked) {
  //     filteredUsers.forEach((user) => {
  //       if (!selectedUsers.includes(user.id)) {
  //         onUserSelectionChange(user.id, true);
  //       }
  //     });
  //   } else {
  //     filteredUsers.forEach((user) => {
  //       if (selectedUsers.includes(user.id)) {
  //         onUserSelectionChange(user.id, false);
  //       }
  //     });
  //   }
  // };

  // const isAllSelected = useMemo(() => {
  //   return filteredUsers.length > 0 && filteredUsers.every((user) => selectedUsers.includes(user.id));
  // }, [filteredUsers, selectedUsers]);

  return (
    <div className="bg-white">
      <PollRecipients settings={settings} />
    </div>
  );
};
