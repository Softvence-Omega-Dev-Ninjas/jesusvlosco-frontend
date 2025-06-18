// src/components/UserProfile/SkillsCertificationsTab.tsx
import React from "react";
import {
  CertificationItem,
  dummyCertifications,
  dummySkills,
  SkillItem,
} from "./skillsCertificationsData"; // Adjust path if necessary

interface SkillsCertificationsTabProps {
  // If skills and certifications were part of the user object,
  // you would pass them as props here. For now, we use dummy data.
}

const SkillsCertificationsTab: React.FC<SkillsCertificationsTabProps> = () => {
  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4">Skills</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {dummySkills.map((skill: SkillItem) => (
          <div
            key={skill.id}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-[#4E53B1] mb-2">
              {skill.name} ({skill.yearsOfExperience} Years)
            </h3>
            <p className="text-sm text-gray-700 mb-1">
              Proficiency :{" "}
              <span className="font-medium">{skill.proficiency}</span>
            </p>
            {skill.tools && skill.tools.length > 0 && (
              <p className="text-sm text-gray-700 mb-1">
                Tools:{" "}
                <span className="font-medium">{skill.tools.join(", ")}</span>
              </p>
            )}
            <p className="text-sm text-gray-600">{skill.description}</p>
          </div>
        ))}
      </div>

      <h2 className="text-xl font-semibold text-gray-900 mb-4">
        Certifications
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {dummyCertifications.map((cert: CertificationItem) => (
          <div
            key={cert.id}
            className="bg-white rounded-lg p-6 shadow-sm border border-gray-200"
          >
            <h3 className="text-lg font-semibold text-indigo-600 mb-2">
              {cert.name}
            </h3>
            <p className="text-sm text-gray-700 mb-1">
              Issuing Organization:{" "}
              <span className="font-medium">{cert.issuingOrganization}</span>
            </p>
            <p className="text-sm text-gray-700 mb-1">
              Completion Date:{" "}
              <span className="font-medium">{cert.completionDate}</span>
            </p>
            <p className="text-sm text-gray-600">{cert.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SkillsCertificationsTab;
