import { UpdateUserFormData, FormFieldState } from '@/types/updateUserTypes';
import { TUser } from '@/types/usertype';

/**
 * Utility function to collect only the dirty/changed fields from the form
 */
export function collectDirtyFields(formState: {
  profile: { [key: string]: FormFieldState };
  experiences: { [index: number]: { [key: string]: FormFieldState } };
  educations: { [index: number]: { [key: string]: FormFieldState } };
  payroll: { [key: string]: FormFieldState };
}): UpdateUserFormData {
  const result: UpdateUserFormData = {};

  // Collect dirty profile fields
  const profileFields: Record<string, string | number | boolean | string[] | null> = {};
  Object.entries(formState.profile).forEach(([key, field]) => {
    if (field.isDirty) {
      profileFields[key] = field.value;
    }
  });
  if (Object.keys(profileFields).length > 0) {
    result.profile = profileFields;
  }

  // Collect dirty experience fields
  const experiences: Record<string, string | number | boolean | string[] | null>[] = [];
  Object.entries(formState.experiences).forEach(([index, experienceFields]) => {
    const experienceData: Record<string, string | number | boolean | string[] | null> = {};
    let hasChanges = false;
    
    Object.entries(experienceFields).forEach(([key, field]) => {
      if (field.isDirty) {
        experienceData[key] = field.value;
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      experiences[parseInt(index)] = experienceData;
    }
  });
  if (experiences.length > 0) {
    result.experiences = experiences.filter(Boolean) as Partial<import('@/types/updateUserTypes').UpdateExperienceData>[];
  }

  // Collect dirty education fields
  const educations: Record<string, string | number | boolean | string[] | null>[] = [];
  Object.entries(formState.educations).forEach(([index, educationFields]) => {
    const educationData: Record<string, string | number | boolean | string[] | null> = {};
    let hasChanges = false;
    
    Object.entries(educationFields).forEach(([key, field]) => {
      if (field.isDirty) {
        educationData[key] = field.value;
        hasChanges = true;
      }
    });
    
    if (hasChanges) {
      educations[parseInt(index)] = educationData;
    }
  });
  if (educations.length > 0) {
    result.educations = educations.filter(Boolean) as Partial<import('@/types/updateUserTypes').UpdateEducationData>[];
  }

  // Collect dirty payroll fields
  const payrollFields: Record<string, string | number | boolean | string[] | null> = {};
  Object.entries(formState.payroll).forEach(([key, field]) => {
    if (field.isDirty) {
      payrollFields[key] = field.value;
    }
  });
  if (Object.keys(payrollFields).length > 0) {
    result.payroll = payrollFields;
  }

  return result;
}

/**
 * Initialize form state from existing user data
 */
export function initializeFormState(userData: Partial<TUser>) {
  const formState = {
    profile: {} as { [key: string]: FormFieldState },
    experiences: {} as { [index: number]: { [key: string]: FormFieldState } },
    educations: {} as { [index: number]: { [key: string]: FormFieldState } },
    payroll: {} as { [key: string]: FormFieldState }
  };

  // Initialize profile fields
  if (userData?.profile) {
    Object.entries(userData.profile).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'userId') {
        formState.profile[key] = {
          isDirty: false,
          value: value as string | number | boolean | string[] | null
        };
      }
    });
  }

  // Initialize experience fields
  if (userData?.experience && Array.isArray(userData.experience)) {
    userData.experience.forEach((exp, index: number) => {
      formState.experiences[index] = {};
      Object.entries(exp).forEach(([key, value]) => {
        if (key !== 'createdAt' && key !== 'updatedAt' && key !== 'userId') {
          formState.experiences[index][key] = {
            isDirty: false,
            value: value as string | number | boolean | string[] | null
          };
        }
      });
    });
  }

  // Initialize education fields
  if (userData?.educations && Array.isArray(userData.educations)) {
    userData.educations.forEach((edu, index: number) => {
      formState.educations[index] = {};
      Object.entries(edu).forEach(([key, value]) => {
        if (key !== 'createdAt' && key !== 'updatedAt' && key !== 'userId') {
          formState.educations[index][key] = {
            isDirty: false,
            value: value as string | number | boolean | string[] | null
          };
        }
      });
    });
  }

  // Initialize payroll fields
  if (userData?.payroll) {
    Object.entries(userData.payroll).forEach(([key, value]) => {
      if (key !== 'id' && key !== 'createdAt' && key !== 'updatedAt' && key !== 'userId') {
        formState.payroll[key] = {
          isDirty: false,
          value: value as string | number | boolean | string[] | null
        };
      }
    });
  }

  return formState;
}

/**
 * Mark a field as dirty and update its value
 */
export function updateFormField(
  formState: {
    profile: { [key: string]: FormFieldState };
    experiences: { [index: number]: { [key: string]: FormFieldState } };
    educations: { [index: number]: { [key: string]: FormFieldState } };
    payroll: { [key: string]: FormFieldState };
  },
  section: 'profile' | 'payroll',
  fieldName: string,
  value: string | number | boolean | string[] | null
) {
  if (!formState[section]) {
    formState[section] = {};
  }
  
  formState[section][fieldName] = {
    isDirty: true,
    value
  };
  
  return { ...formState };
}

/**
 * Mark an array field (experience/education) as dirty and update its value
 */
export function updateArrayFormField(
  formState: {
    profile: { [key: string]: FormFieldState };
    experiences: { [index: number]: { [key: string]: FormFieldState } };
    educations: { [index: number]: { [key: string]: FormFieldState } };
    payroll: { [key: string]: FormFieldState };
  },
  section: 'experiences' | 'educations',
  index: number,
  fieldName: string,
  value: string | number | boolean | string[] | null
) {
  if (!formState[section]) {
    formState[section] = {};
  }
  
  if (!formState[section][index]) {
    formState[section][index] = {};
  }
  
  formState[section][index][fieldName] = {
    isDirty: true,
    value
  };
  
  return { ...formState };
}
