# User Profile Update System

This system provides a comprehensive user profile update functionality that allows users to modify their personal information, work experience, education, and payroll details with granular field-level tracking.

## Features

### 1. Personal Information Updates
- First Name, Last Name
- Gender (MALE, FEMALE, OTHER)
- Job Title, Department
- Date of Birth
- Address, City, State, Country, Nationality

### 2. Work Experience Management
- Add/Remove/Edit multiple work experiences
- Job Title, Company Name
- Job Type (Full-time, Part-time, Contract, Internship)
- Start/End dates with "Currently Working" option
- Job description

### 3. Education Management
- Add/Remove/Edit multiple education records
- Degree/Program name
- Institution name
- Graduation year

### 4. Payroll Information
- Regular and overtime pay rates
- Pay rate types (Hourly, Daily, Monthly)
- Leave allocations (Casual, Sick, Time Off)
- Off days selection
- Break time configuration

## How It Works

### Smart Change Tracking
The system only sends changed fields to the API, not the entire form. This is achieved through:

1. **Dirty Field Tracking**: Each form component tracks which fields have been modified
2. **Partial Updates**: Only modified data is included in the API request
3. **Section-based Updates**: Different sections (profile, experience, education, payroll) are handled independently

### API Request Format

```typescript
// Example update request
{
  "profile": {
    "firstName": "John",
    "lastName": "Doe"
  },
  "experiences": [
    {
      "id": "existing-exp-id", // For updates
      "designation": "Senior Developer",
      "companyName": "Tech Corp"
    },
    {
      // New experience (no id)
      "designation": "Junior Developer",
      "companyName": "Previous Corp"
    }
  ],
  "educations": [
    {
      "id": "existing-edu-id",
      "program": "Master of Computer Science"
    }
  ],
  "payroll": {
    "regularPayRate": 150,
    "casualLeave": 15
  }
}
```

## Components Structure

### Main Components
- `UserProfileTabsNew.tsx` - Main container managing all tabs and updates
- `ExperienceUpdateForm.tsx` - Work experience management
- `EducationUpdateForm.tsx` - Education records management
- `PayrollUpdateForm.tsx` - Payroll information management

### Utility Files
- `types/updateUserTypes.ts` - TypeScript definitions for update operations
- `utils/formStateUtils.ts` - Utilities for tracking form changes

## Usage Example

```tsx
import UserProfileTabsNew from '@/components/UserProfile/UserProfileTabsNew';
import { UpdateUserFormData } from '@/types/updateUserTypes';

const handleSaveUpdates = async (updateData: UpdateUserFormData) => {
  try {
    const result = await updateUser({
      data: updateData,
      userId: user.id
    }).unwrap();
    
    if (result?.success) {
      console.log('User updated successfully');
    }
  } catch (error) {
    console.error('Error updating user:', error);
  }
};

<UserProfileTabsNew
  userData={userData}
  isEditing={isEditing}
  onSave={handleSaveUpdates}
  onCancelEdit={handleCancelEdit}
/>
```

## API Integration

The system integrates with the existing `updateUser` mutation in `userApi.ts`. The API expects a PATCH request with the update data in the request body.

### Backend API Expected Format
- **Profile updates**: Direct field mapping to user profile
- **Experience updates**: Array of experience objects with optional `id` for existing records
- **Education updates**: Array of education objects with optional `id` for existing records
- **Payroll updates**: Direct field mapping to payroll configuration

## Field Validation

### Required Fields
- **Experience**: designation, companyName, jobType, startDate
- **Education**: program, institution, year
- **Profile**: Based on business requirements
- **Payroll**: All fields are optional with sensible defaults

### Data Types
- Dates are stored as ISO strings
- Numeric fields (pay rates, years) are validated as numbers
- Enum fields (jobType, gender, etc.) are validated against allowed values

## Error Handling

The system includes comprehensive error handling:
1. Form validation before submission
2. API error catching and user feedback
3. Optimistic updates with rollback on failure
4. Loading states during API calls

## Future Enhancements

1. **File Upload**: Profile picture and document uploads
2. **Validation Messages**: Real-time field validation
3. **Auto-save**: Periodic saving of draft changes
4. **Audit Trail**: Track who made what changes when
5. **Bulk Operations**: Import/export functionality
